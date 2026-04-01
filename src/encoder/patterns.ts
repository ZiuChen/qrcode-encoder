/**
 * 功能图案放置：Finder、Alignment、Timing、Dark Module
 */

import { ALIGNMENT_POSITIONS } from './constants'

export function placeFinderPatterns(
  modules: (boolean | null)[][],
  isFunction: boolean[][],
  size: number
): void {
  const centers = [
    [3, 3],
    [3, size - 4],
    [size - 4, 3]
  ]
  for (const [cy, cx] of centers) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const r = cy + dy
        const c = cx + dx
        if (r < 0 || r >= size || c < 0 || c >= size) continue
        const dist = Math.max(Math.abs(dy), Math.abs(dx))
        const dark = dist <= 3 && dist !== 2
        modules[r][c] = dark
        isFunction[r][c] = true
      }
    }
  }
}

export function placeTimingPatterns(
  modules: (boolean | null)[][],
  isFunction: boolean[][],
  size: number
): void {
  for (let i = 8; i < size - 8; i++) {
    if (!isFunction[6][i]) {
      modules[6][i] = i % 2 === 0
      isFunction[6][i] = true
    }
    if (!isFunction[i][6]) {
      modules[i][6] = i % 2 === 0
      isFunction[i][6] = true
    }
  }
}

export function placeAlignmentPatterns(
  modules: (boolean | null)[][],
  isFunction: boolean[][],
  version: number
): void {
  const positions = ALIGNMENT_POSITIONS[version - 1]
  for (const row of positions) {
    for (const col of positions) {
      if (isFunction[row][col]) continue
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const dark = Math.max(Math.abs(dy), Math.abs(dx)) !== 1
          modules[row + dy][col + dx] = dark
          isFunction[row + dy][col + dx] = true
        }
      }
    }
  }
}

export function placeDarkModule(
  modules: (boolean | null)[][],
  isFunction: boolean[][],
  version: number
): void {
  modules[4 * version + 9][8] = true
  isFunction[4 * version + 9][8] = true
}

export function reserveInfoAreas(isFunction: boolean[][], size: number, version: number): void {
  for (let i = 0; i < 9; i++) {
    if (!isFunction[8][i]) isFunction[8][i] = true
    if (!isFunction[i][8]) isFunction[i][8] = true
  }
  for (let i = 0; i < 8; i++) {
    if (!isFunction[8][size - 1 - i]) isFunction[8][size - 1 - i] = true
    if (!isFunction[size - 1 - i][8]) isFunction[size - 1 - i][8] = true
  }
  if (version >= 7) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        isFunction[i][size - 11 + j] = true
        isFunction[size - 11 + j][i] = true
      }
    }
  }
}
