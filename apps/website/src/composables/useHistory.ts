import { ref } from 'vue'
import {
  createHistoryStorage,
  createRecord,
  type QRRecord,
  type QRHistoryStorage,
} from '@/lib/history'
import type { QRRenderOptions } from '@/lib/qr'

const storage: QRHistoryStorage = createHistoryStorage()
const records = ref<QRRecord[]>([])

async function refresh(): Promise<void> {
  records.value = await storage.getAll()
}

/**
 * 二维码历史记录 composable
 *
 * - 自动保存：调用 upsert 即合并写入（同内容+同参数只更新时间，不产生重复）
 * - records 按 updatedAt 倒序，可直接渲染
 */
export function useHistory() {
  return {
    records,
    refresh,
    async upsert(text: string, options: QRRenderOptions): Promise<void> {
      if (!text.trim()) return
      const existing = records.value.find(record => record.id === createRecord(text, options).id)
      const record = existing
        ? { ...existing, text, options, updatedAt: Date.now() }
        : createRecord(text, options)
      await storage.put(record)
      await refresh()
    },
    async remove(id: string): Promise<void> {
      await storage.remove(id)
      await refresh()
    },
    async clear(): Promise<void> {
      await storage.clear()
      await refresh()
    },
  }
}
