/**
 * BCH 编码：格式信息与版本信息
 */

import type { ErrorCorrectionLevel } from './types'

/** 各 ECC 等级对应的 2-bit 指示符 (ISO 18004 Table 10) */
const EC_INDICATOR: Record<ErrorCorrectionLevel, number> = {
  M: 0b00,
  L: 0b01,
  H: 0b10,
  Q: 0b11
}

/** BCH(15,5) 格式信息编码，默认 ECC-M */
export function computeFormatBits(mask: number, ec: ErrorCorrectionLevel = 'M'): number {
  const data = (EC_INDICATOR[ec] << 3) | mask
  let remainder = data << 10
  for (let i = 4; i >= 0; i--) {
    if ((remainder >> (i + 10)) & 1) {
      remainder ^= 0x537 << i
    }
  }
  return ((data << 10) | remainder) ^ 0x5412
}

/** BCH(18,6) 版本信息编码 */
export function computeVersionBits(version: number): number {
  let remainder = version << 12
  for (let i = 5; i >= 0; i--) {
    if ((remainder >> (i + 12)) & 1) {
      remainder ^= 0x1f25 << i
    }
  }
  return (version << 12) | remainder
}
