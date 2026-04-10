/**
 * 数据编码：位流构建 + 多块交织
 */

import { VERSION_EC_TABLE } from './constants'
import { rsEncode } from './reed-solomon'

/** 编码数据并返回交织后的码字数组 */
export function encodeDataBits(dataBytes: number[], version: number): number[] {
  const ecInfo = VERSION_EC_TABLE[version]

  let totalDataCodewords = 0
  for (const g of ecInfo.groups) {
    totalDataCodewords += g.count * g.dataCodewords
  }

  const totalBlocks = ecInfo.groups.reduce((s, g) => s + g.count, 0)
  const totalEcCodewords = ecInfo.totalCodewords - totalDataCodewords
  const ecPerBlock = (totalEcCodewords / totalBlocks) | 0

  // 构建位流
  const bits: number[] = []

  // 模式指示符: 0100 = Byte mode
  bits.push(0, 1, 0, 0)

  // 字符计数指示符 (V1-9: 8位, V10+: 16位)
  const ccBits = version <= 9 ? 8 : 16
  for (let i = ccBits - 1; i >= 0; i--) {
    bits.push((dataBytes.length >> i) & 1)
  }

  // 数据字节
  for (const byte of dataBytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1)
    }
  }

  // 终止符 (最多4位)
  const maxBits = totalDataCodewords * 8
  for (let i = 0; i < 4 && bits.length < maxBits; i++) {
    bits.push(0)
  }

  // 对齐到字节边界
  while (bits.length % 8 !== 0 && bits.length < maxBits) {
    bits.push(0)
  }

  // 填充码字 (0xEC, 0x11 交替)
  const padBytes = [0xec, 0x11]
  let padIdx = 0
  while (bits.length < maxBits) {
    for (let i = 7; i >= 0; i--) {
      bits.push((padBytes[padIdx] >> i) & 1)
    }
    padIdx = (padIdx + 1) % 2
  }

  // 转为码字数组
  const allDataCodewords: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0
    for (let j = 0; j < 8; j++) byte = (byte << 1) | (bits[i + j] || 0)
    allDataCodewords.push(byte)
  }

  // 分块
  const dataBlocks: number[][] = []
  const ecBlocks: number[][] = []
  let offset = 0

  for (const group of ecInfo.groups) {
    for (let b = 0; b < group.count; b++) {
      const blockData = allDataCodewords.slice(offset, offset + group.dataCodewords)
      offset += group.dataCodewords
      const ecWords = rsEncode(blockData, ecPerBlock)
      dataBlocks.push(blockData)
      ecBlocks.push(ecWords)
    }
  }

  // 交织数据码字
  const interleaved: number[] = []
  const maxDataLen = Math.max(...dataBlocks.map((b) => b.length))
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) interleaved.push(block[i])
    }
  }

  // 交织纠错码字
  const maxEcLen = Math.max(...ecBlocks.map((b) => b.length))
  for (let i = 0; i < maxEcLen; i++) {
    for (const block of ecBlocks) {
      if (i < block.length) interleaved.push(block[i])
    }
  }

  return interleaved
}
