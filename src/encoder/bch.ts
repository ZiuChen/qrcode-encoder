/**
 * BCH 编码：格式信息与版本信息
 */

/** BCH(15,5) 格式信息编码 */
export function computeFormatBits(mask: number): number {
  const data = (0b00 << 3) | mask // ECC-M = 0b00
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
