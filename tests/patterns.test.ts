import { describe, expect, it } from 'vitest'
import {
  placeAlignmentPatterns,
  placeDarkModule,
  placeFinderPatterns,
  placeTimingPatterns,
  reserveInfoAreas
} from '../src/encoder/patterns'

function makeMatrices(size: number): {
  modules: (boolean | null)[][]
  isFunction: boolean[][]
} {
  return {
    modules: Array.from({ length: size }, () => new Array<boolean | null>(size).fill(null)),
    isFunction: Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  }
}

describe('placeFinderPatterns', () => {
  it('should mark top-left 7x7 finder pattern center correctly', () => {
    const size = 21
    const { modules, isFunction } = makeMatrices(size)
    placeFinderPatterns(modules, isFunction, size)

    // 中心 (3,3) 是黑色
    expect(modules[3][3]).toBe(true)
    // 内部环 dist=1 是黑色
    expect(modules[3][4]).toBe(true)
    // 中间环 dist=2 是白色
    expect(modules[3][5]).toBe(false)
    // 外环 dist=3 是黑色
    expect(modules[3][6]).toBe(true)
    // 分离条 dist=4 是白色
    expect(modules[3][7]).toBe(false)
  })

  it('should mark all finder pattern cells as function modules', () => {
    const size = 21
    const { modules, isFunction } = makeMatrices(size)
    placeFinderPatterns(modules, isFunction, size)

    // 左上角 0-6, 0-6 全部是功能模块（含分离条在 row/col 7 的边缘是 -4..4 范围）
    // center (3,3) dist=0, outer dist=4 是分离条
    expect(isFunction[3][3]).toBe(true)
    expect(isFunction[0][0]).toBe(true)
  })

  it('should place three finder patterns', () => {
    const size = 21
    const { modules, isFunction } = makeMatrices(size)
    placeFinderPatterns(modules, isFunction, size)

    // 右上角中心 (3, size-4)
    expect(modules[3][size - 4]).toBe(true)
    // 左下角中心 (size-4, 3)
    expect(modules[size - 4][3]).toBe(true)
  })
})

describe('placeTimingPatterns', () => {
  it('should alternate dark/light along row 6 between finders', () => {
    const size = 21
    const { modules, isFunction } = makeMatrices(size)
    // Pre-mark finder areas so timing doesn't overwrite them
    placeFinderPatterns(modules, isFunction, size)
    placeTimingPatterns(modules, isFunction, size)

    // timing row 6 from col 8 to size-9: even col = dark, odd col = light
    for (let col = 8; col < size - 8; col++) {
      expect(modules[6][col]).toBe(col % 2 === 0)
    }
  })
})

describe('placeDarkModule', () => {
  it('should place dark module at (4*version+9, 8)', () => {
    const version = 1
    const size = version * 4 + 17
    const { modules, isFunction } = makeMatrices(size)
    placeDarkModule(modules, isFunction, version)

    expect(modules[4 * version + 9][8]).toBe(true)
    expect(isFunction[4 * version + 9][8]).toBe(true)
  })
})

describe('reserveInfoAreas', () => {
  it('should reserve format info areas for V1', () => {
    const size = 21
    const { isFunction } = makeMatrices(size)
    reserveInfoAreas(isFunction, size, 1)

    // Left format strip (row 8, col 0-8)
    for (let i = 0; i < 9; i++) {
      expect(isFunction[8][i]).toBe(true)
    }
    // Top format strip (col 8, row 0-8)
    for (let i = 0; i < 9; i++) {
      expect(isFunction[i][8]).toBe(true)
    }
  })

  it('should NOT reserve version info areas for V1-V6', () => {
    const size = 21
    const { isFunction } = makeMatrices(size)
    reserveInfoAreas(isFunction, size, 1)
    // Version info area is at top-right corner for V7+; V1 should not mark these as function
    expect(isFunction[0][size - 11]).toBe(false)
  })

  it('should reserve version info areas for V7+', () => {
    const version = 7
    const size = version * 4 + 17
    const { isFunction } = makeMatrices(size)
    reserveInfoAreas(isFunction, size, version)

    expect(isFunction[0][size - 11]).toBe(true)
    expect(isFunction[5][size - 9]).toBe(true)
  })
})

describe('placeAlignmentPatterns', () => {
  it('should place alignment pattern center for V2 at (18, 18)', () => {
    const size = 25
    const { modules, isFunction } = makeMatrices(size)
    placeFinderPatterns(modules, isFunction, size) // pre-mark finders
    placeAlignmentPatterns(modules, isFunction, 2)

    // V2 only has one alignment position at (18, 18)
    expect(modules[18][18]).toBe(true) // center is dark
    expect(modules[17][18]).toBe(false) // inner ring is light
    expect(modules[16][18]).toBe(true) // outer ring is dark
  })
})
