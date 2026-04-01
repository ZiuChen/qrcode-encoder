/**
 * 纠错级别
 * - L: ~7% 纠错能力
 * - M: ~15% 纠错能力
 * - Q: ~25% 纠错能力
 * - H: ~30% 纠错能力
 */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export interface QRCodeOptions {
  /** 纠错级别，默认 'M'（当前仅支持 M） */
  errorCorrection?: ErrorCorrectionLevel
  /** 最小版本（1-40），默认自动选择最小可用版本 */
  minVersion?: number
}

export interface ECBlockGroup {
  count: number
  dataCodewords: number
}

export interface VersionECInfo {
  totalCodewords: number
  groups: ECBlockGroup[]
}
