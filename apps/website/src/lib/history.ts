import type { QRRenderOptions } from '@/lib/qr'
import { isIndexedDBAvailable, requestToPromise } from '@/lib/db'

export interface QRRecord {
  /** 由内容与参数派生的稳定 id：同内容+同参数的记录自动合并 */
  id: string
  text: string
  options: QRRenderOptions
  /** 首次创建时间（毫秒时间戳） */
  createdAt: number
  /** 最近一次生成时间（毫秒时间戳），历史列表按此倒序 */
  updatedAt: number
}

/** 存储层抽象：UI 只依赖这个接口，不感知 IndexedDB 细节 */
export interface QRHistoryStorage {
  getAll(): Promise<QRRecord[]>
  put(record: QRRecord): Promise<void>
  remove(id: string): Promise<void>
  clear(): Promise<void>
}

const DB_NAME = 'qrcode-encoder'
const DB_VERSION = 1
const STORE_NAME = 'history'
export const MAX_RECORDS = 500

/** 对内容与参数做 FNV-1a 32 位哈希，得到稳定 id */
function computeId(text: string, options: QRRenderOptions): string {
  const key = `${text}\u0000${options.ecc}\u0000${options.moduleSize}\u0000${options.quietZone}`
  let hash = 0x811c9dc5
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

export function createRecord(
  text: string,
  options: QRRenderOptions,
  now = Date.now(),
): QRRecord {
  return {
    id: computeId(text, options),
    text,
    options,
    createdAt: now,
    updatedAt: now,
  }
}

class IndexedDBStorage implements QRHistoryStorage {
  private dbPromise: Promise<IDBDatabase>

  constructor() {
    this.dbPromise = this.open()
  }

  private open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  private async store(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this.dbPromise
    return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME)
  }

  async getAll(): Promise<QRRecord[]> {
    const store = await this.store('readonly')
    const records = await requestToPromise(store.getAll() as IDBRequest<QRRecord[]>)
    return records.sort((a, b) => b.updatedAt - a.updatedAt)
  }

  async put(record: QRRecord): Promise<void> {
    const store = await this.store('readwrite')
    await requestToPromise(store.put(record))
    await this.prune(store)
  }

  async remove(id: string): Promise<void> {
    const store = await this.store('readwrite')
    await requestToPromise(store.delete(id))
  }

  async clear(): Promise<void> {
    const store = await this.store('readwrite')
    await requestToPromise(store.clear())
  }

  /** 只保留最近 MAX_RECORDS 条，防止无限膨胀 */
  private async prune(store: IDBObjectStore): Promise<void> {
    const count = await requestToPromise(store.count())
    if (count <= MAX_RECORDS) return
    const all = await requestToPromise(store.getAll() as IDBRequest<QRRecord[]>)
    const excess = all
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(MAX_RECORDS)
    for (const record of excess) {
      store.delete(record.id)
    }
  }
}

/** 内存降级实现：不支持 IndexedDB 的环境也能正常使用，仅不持久化 */
class MemoryStorage implements QRHistoryStorage {
  private records = new Map<string, QRRecord>()

  async getAll(): Promise<QRRecord[]> {
    return [...this.records.values()].sort((a, b) => b.updatedAt - a.updatedAt)
  }

  async put(record: QRRecord): Promise<void> {
    this.records.set(record.id, record)
    const excess = [...this.records.values()]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(MAX_RECORDS)
    for (const item of excess) this.records.delete(item.id)
  }

  async remove(id: string): Promise<void> {
    this.records.delete(id)
  }

  async clear(): Promise<void> {
    this.records.clear()
  }
}

export function createHistoryStorage(): QRHistoryStorage {
  return isIndexedDBAvailable() ? new IndexedDBStorage() : new MemoryStorage()
}
