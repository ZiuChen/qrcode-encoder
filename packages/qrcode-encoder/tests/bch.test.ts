import { describe, expect, it } from 'vitest'
import { computeFormatBits, computeVersionBits } from '../src/encoder/bch'

describe('BCH encoding', () => {
  describe('computeFormatBits', () => {
    // ISO 18004 Table C.1 提供了 ECC-M 各掩码的格式位参考值
    // ECC-M (0b00) + mask 0~7 的期望输出（15位格式信息，含解掩码异或）
    const FORMAT_BITS_ECC_M: Record<number, number> = {
      0: 0b101010000010010,
      1: 0b101000100100101,
      2: 0b101111001111100,
      3: 0b101101101001011,
      4: 0b100010111111001,
      5: 0b100000011001110,
      6: 0b100111110010111,
      7: 0b100101010100000
    }

    for (const [mask, expected] of Object.entries(FORMAT_BITS_ECC_M)) {
      it(`mask=${mask} should produce correct 15-bit format word`, () => {
        expect(computeFormatBits(Number(mask))).toBe(expected)
      })
    }

    it('should be deterministic', () => {
      expect(computeFormatBits(3)).toBe(computeFormatBits(3))
    })
  })

  describe('computeVersionBits', () => {
    // ISO 18004 Annex D 提供了各版本的版本信息位（18位）
    const VERSION_BITS: Record<number, number> = {
      7: 0b000111110010010100,
      8: 0b001000010110111100,
      9: 0b001001101010011001,
      10: 0b001010010011010011,
      14: 58893,
      40: 167017
    }

    for (const [version, expected] of Object.entries(VERSION_BITS)) {
      it(`version=${version} should produce correct 18-bit version info`, () => {
        expect(computeVersionBits(Number(version))).toBe(expected)
      })
    }

    it('should be deterministic', () => {
      expect(computeVersionBits(7)).toBe(computeVersionBits(7))
    })
  })
})
