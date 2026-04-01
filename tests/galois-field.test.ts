import { describe, expect, it } from 'vitest'
import { GF_EXP, GF_LOG, gfMul } from '../src/encoder/galois-field'

describe('GF(256) Galois Field', () => {
  it('should have correct EXP table size', () => {
    expect(GF_EXP.length).toBe(512)
  })

  it('should have correct LOG table size', () => {
    expect(GF_LOG.length).toBe(256)
  })

  it('gfMul(0, x) = 0', () => {
    expect(gfMul(0, 0)).toBe(0)
    expect(gfMul(0, 1)).toBe(0)
    expect(gfMul(0, 255)).toBe(0)
    expect(gfMul(1, 0)).toBe(0)
  })

  it('gfMul(1, x) = x (identity)', () => {
    for (let x = 1; x < 256; x++) {
      expect(gfMul(1, x)).toBe(x)
    }
  })

  it('gfMul should be commutative', () => {
    expect(gfMul(2, 3)).toBe(gfMul(3, 2))
    expect(gfMul(17, 42)).toBe(gfMul(42, 17))
    expect(gfMul(100, 200)).toBe(gfMul(200, 100))
  })

  it('GF_EXP[GF_LOG[x]] = x for all non-zero x', () => {
    for (let x = 1; x < 256; x++) {
      expect(GF_EXP[GF_LOG[x]]).toBe(x)
    }
  })

  // 已知值验证：2 * 3 = 6 in GF(256) (small values same as normal multiplication)
  it('gfMul(2, 3) = 6', () => {
    expect(gfMul(2, 3)).toBe(6)
  })
})
