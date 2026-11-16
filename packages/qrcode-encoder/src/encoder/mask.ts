/**
 * 掩码函数与惩罚评估
 */

export type MaskFn = (row: number, col: number) => boolean

/** 8 种标准掩码函数 (ISO 18004) */
export const MASK_FUNCTIONS: MaskFn[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
]

/** 评估掩码惩罚分数 */
export function evaluatePenalty(modules: boolean[][], size: number): number {
  let penalty = 0

  // Rule 1: 连续 5+ 同色模块
  for (let row = 0; row < size; row++) {
    let run = 1
    for (let col = 1; col < size; col++) {
      if (modules[row][col] === modules[row][col - 1]) {
        run++
      } else {
        if (run >= 5) penalty += run - 2
        run = 1
      }
    }
    if (run >= 5) penalty += run - 2
  }
  for (let col = 0; col < size; col++) {
    let run = 1
    for (let row = 1; row < size; row++) {
      if (modules[row][col] === modules[row - 1][col]) {
        run++
      } else {
        if (run >= 5) penalty += run - 2
        run = 1
      }
    }
    if (run >= 5) penalty += run - 2
  }

  // Rule 2: 2x2 同色块
  for (let row = 0; row < size - 1; row++) {
    for (let col = 0; col < size - 1; col++) {
      const v = modules[row][col]
      if (
        v === modules[row][col + 1] &&
        v === modules[row + 1][col] &&
        v === modules[row + 1][col + 1]
      ) {
        penalty += 3
      }
    }
  }

  // Rule 3: 1:1:3:1:1 finder-like pattern
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - 11; col++) {
      if (
        modules[row][col + 0] &&
        !modules[row][col + 1] &&
        modules[row][col + 2] &&
        modules[row][col + 3] &&
        modules[row][col + 4] &&
        !modules[row][col + 5] &&
        modules[row][col + 6] &&
        !modules[row][col + 7] &&
        !modules[row][col + 8] &&
        !modules[row][col + 9] &&
        !modules[row][col + 10]
      ) {
        penalty += 40
      }
      if (
        !modules[row][col + 0] &&
        !modules[row][col + 1] &&
        !modules[row][col + 2] &&
        !modules[row][col + 3] &&
        modules[row][col + 4] &&
        !modules[row][col + 5] &&
        modules[row][col + 6] &&
        modules[row][col + 7] &&
        modules[row][col + 8] &&
        !modules[row][col + 9] &&
        modules[row][col + 10]
      ) {
        penalty += 40
      }
    }
  }
  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - 11; row++) {
      if (
        modules[row + 0][col] &&
        !modules[row + 1][col] &&
        modules[row + 2][col] &&
        modules[row + 3][col] &&
        modules[row + 4][col] &&
        !modules[row + 5][col] &&
        modules[row + 6][col] &&
        !modules[row + 7][col] &&
        !modules[row + 8][col] &&
        !modules[row + 9][col] &&
        !modules[row + 10][col]
      ) {
        penalty += 40
      }
      if (
        !modules[row + 0][col] &&
        !modules[row + 1][col] &&
        !modules[row + 2][col] &&
        !modules[row + 3][col] &&
        modules[row + 4][col] &&
        !modules[row + 5][col] &&
        modules[row + 6][col] &&
        modules[row + 7][col] &&
        modules[row + 8][col] &&
        !modules[row + 9][col] &&
        modules[row + 10][col]
      ) {
        penalty += 40
      }
    }
  }

  // Rule 4: 暗模块比例偏离 50%
  let darkCount = 0
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (modules[row][col]) darkCount++
    }
  }
  const total = size * size
  const pct = (darkCount * 100) / total
  const prev5 = Math.floor(pct / 5) * 5
  const next5 = prev5 + 5
  penalty += Math.min(Math.abs(prev5 - 50) / 5, Math.abs(next5 - 50) / 5) * 10

  return penalty
}
