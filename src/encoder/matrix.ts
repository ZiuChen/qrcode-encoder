/**
 * QR Code 模块矩阵生成
 *
 * 从文本内容生成 QR 码的 boolean[][] 矩阵。
 * 纯算法实现，零运行时依赖，可在任意 JS 环境中使用。
 *
 * 参考规范：ISO/IEC 18004 (QR Code)
 */

import { computeFormatBits, computeVersionBits } from './bch'
import { MAX_PAYLOAD_BYTES } from './constants'
import { encodeDataBits } from './data-encoder'
import { evaluatePenalty, MASK_FUNCTIONS } from './mask'
import {
  placeAlignmentPatterns,
  placeDarkModule,
  placeFinderPatterns,
  placeTimingPatterns,
  reserveInfoAreas
} from './patterns'
import type { QRCodeOptions } from './types'
import { textToBytes } from './utf8'

/** 根据数据长度选择最小版本 */
function getMinVersion(byteLength: number, minVersion: number = 1): number {
  for (let v = minVersion; v <= 40; v++) {
    if (byteLength <= MAX_PAYLOAD_BYTES[v]) return v
  }
  throw new Error('Data too long, maximum supported is Version 40')
}

/** 数据位放置（Z字形扫描） */
function placeDataBits(
  modules: (boolean | null)[][],
  isFunction: boolean[][],
  codewords: number[],
  size: number
): void {
  let bitIdx = 0
  const totalBits = codewords.length * 8

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5

    const upward = ((right + 1) & 2) === 0

    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const col = right - j
        const row = upward ? size - 1 - vert : vert

        if (row < 0 || row >= size || col < 0 || col >= size) continue
        if (isFunction[row][col]) continue

        if (bitIdx < totalBits) {
          const byteIdx = bitIdx >>> 3
          const bitPos = 7 - (bitIdx & 7)
          modules[row][col] = ((codewords[byteIdx] >> bitPos) & 1) === 1
          bitIdx++
        } else {
          modules[row][col] = false
        }
      }
    }
  }
}

/** 格式信息放置 */
function writeFormatBits(modules: boolean[][], size: number, mask: number): void {
  const bits = computeFormatBits(mask)

  const getBit = (i: number): boolean => ((bits >>> i) & 1) === 1

  // 第一副本（围绕左上定位图案）
  for (let i = 0; i <= 5; i++) modules[i][8] = getBit(i)
  modules[7][8] = getBit(6)
  modules[8][8] = getBit(7)
  modules[8][7] = getBit(8)
  for (let i = 9; i < 15; i++) modules[8][14 - i] = getBit(i)

  // 第二副本（围绕另外两个定位图案）
  for (let i = 0; i < 8; i++) modules[8][size - 1 - i] = getBit(i)
  for (let i = 8; i < 15; i++) modules[size - 15 + i][8] = getBit(i)
}

/** 版本信息放置 */
function writeVersionBits(modules: boolean[][], size: number, version: number): void {
  if (version < 7) return
  const bits = computeVersionBits(version)

  for (let i = 0; i < 18; i++) {
    const bit = ((bits >>> i) & 1) === 1
    const row = Math.floor(i / 3)
    const col = size - 11 + (i % 3)
    modules[row][col] = bit
    modules[col][row] = bit
  }
}

/**
 * 从文本内容生成 QR 码模块矩阵
 * @returns boolean[][] 其中 true = 黑色, false = 白色
 */
export function encode(text: string, options?: QRCodeOptions): boolean[][] {
  const dataBytes = textToBytes(text)
  const version = getMinVersion(dataBytes.length, options?.minVersion)
  const size = version * 4 + 17

  // 初始化矩阵
  const modules: (boolean | null)[][] = []
  const isFunction: boolean[][] = []
  for (let i = 0; i < size; i++) {
    modules.push(new Array<boolean | null>(size).fill(null))
    isFunction.push(new Array<boolean>(size).fill(false))
  }

  // 放置功能图案
  placeFinderPatterns(modules, isFunction, size)
  if (version >= 2) {
    placeAlignmentPatterns(modules, isFunction, version)
  }
  placeTimingPatterns(modules, isFunction, size)
  placeDarkModule(modules, isFunction, version)
  reserveInfoAreas(isFunction, size, version)

  // 编码数据
  const codewords = encodeDataBits(dataBytes, version)

  // 放置数据位
  placeDataBits(modules, isFunction, codewords, size)

  // 选择最佳掩码
  let bestMask = 0
  let bestPenalty = Infinity

  for (let mask = 0; mask < 8; mask++) {
    const test: boolean[][] = []
    for (let r = 0; r < size; r++) {
      test.push(new Array<boolean>(size))
      for (let c = 0; c < size; c++) {
        let val = modules[r][c] === true
        if (!isFunction[r][c] && MASK_FUNCTIONS[mask](r, c)) {
          val = !val
        }
        test[r][c] = val
      }
    }
    writeFormatBits(test, size, mask)
    if (version >= 7) writeVersionBits(test, size, version)

    const score = evaluatePenalty(test, size)
    if (score < bestPenalty) {
      bestPenalty = score
      bestMask = mask
    }
  }

  // 应用最佳掩码
  const maskFn = MASK_FUNCTIONS[bestMask]
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!isFunction[r][c] && maskFn(r, c)) {
        modules[r][c] = !modules[r][c]
      }
    }
  }

  // 写入格式和版本信息
  writeFormatBits(modules as boolean[][], size, bestMask)
  if (version >= 7) {
    writeVersionBits(modules as boolean[][], size, version)
  }

  return modules.map((row) => row.map((cell) => cell === true))
}
