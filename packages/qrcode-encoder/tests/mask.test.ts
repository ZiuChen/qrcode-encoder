import { describe, expect, it } from 'vitest'
import { evaluatePenalty, MASK_FUNCTIONS } from '../src/encoder/mask'

describe('MASK_FUNCTIONS', () => {
  it('should have exactly 8 mask functions', () => {
    expect(MASK_FUNCTIONS.length).toBe(8)
  })

  it('mask 0: (r + c) % 2 === 0', () => {
    const fn = MASK_FUNCTIONS[0]
    expect(fn(0, 0)).toBe(true)
    expect(fn(0, 1)).toBe(false)
    expect(fn(1, 0)).toBe(false)
    expect(fn(1, 1)).toBe(true)
  })

  it('mask 1: r % 2 === 0', () => {
    const fn = MASK_FUNCTIONS[1]
    expect(fn(0, 0)).toBe(true)
    expect(fn(0, 5)).toBe(true)
    expect(fn(1, 0)).toBe(false)
    expect(fn(2, 3)).toBe(true)
  })

  it('mask 2: c % 3 === 0', () => {
    const fn = MASK_FUNCTIONS[2]
    expect(fn(0, 0)).toBe(true)
    expect(fn(0, 3)).toBe(true)
    expect(fn(0, 1)).toBe(false)
    expect(fn(5, 6)).toBe(true)
  })

  it('mask 3: (r + c) % 3 === 0', () => {
    const fn = MASK_FUNCTIONS[3]
    expect(fn(0, 0)).toBe(true)
    expect(fn(1, 2)).toBe(true)
    expect(fn(0, 1)).toBe(false)
  })

  it('mask 4: (floor(r/2) + floor(c/3)) % 2 === 0', () => {
    const fn = MASK_FUNCTIONS[4]
    expect(fn(0, 0)).toBe(true)
    expect(fn(0, 3)).toBe(false)
    expect(fn(2, 3)).toBe(true)
  })

  it('mask 7: (((r+c)%2) + ((r*c)%3)) % 2 === 0', () => {
    const fn = MASK_FUNCTIONS[7]
    expect(fn(0, 0)).toBe(true)
    // (1+1)%2=0, (1*1)%3=1 → (0+1)%2=1 → false
    expect(fn(1, 1)).toBe(false)
  })
})

describe('evaluatePenalty', () => {
  const makeMatrix = (size: number, fill: boolean): boolean[][] =>
    Array.from({ length: size }, () => new Array<boolean>(size).fill(fill))

  it('all-dark matrix should have high penalty', () => {
    const all = makeMatrix(21, true)
    const p = evaluatePenalty(all, 21)
    expect(p).toBeGreaterThan(0)
  })

  it('all-light matrix should have high penalty', () => {
    const none = makeMatrix(21, false)
    const p = evaluatePenalty(none, 21)
    expect(p).toBeGreaterThan(0)
  })

  it('checkerboard pattern should have low rule-1 and rule-2 penalty', () => {
    const size = 21
    const board: boolean[][] = Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => (r + c) % 2 === 0)
    )
    const p = evaluatePenalty(board, size)
    // checkerboard has no runs of 5+, no 2×2 blocks, only Rule 4 penalty
    expect(p).toBeLessThan(100)
  })

  it('should return a non-negative number', () => {
    const size = 21
    const m = makeMatrix(size, false)
    expect(evaluatePenalty(m, size)).toBeGreaterThanOrEqual(0)
  })
})
