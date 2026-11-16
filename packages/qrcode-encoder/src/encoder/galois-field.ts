/**
 * GF(256) 有限域算术
 * 不可约多项式: x^8 + x^4 + x^3 + x^2 + 1 (0x11D)
 */

const GF_EXP = new Uint8Array(512)
const GF_LOG = new Uint8Array(256)

// 初始化对数/反对数表
let x = 1
for (let i = 0; i < 255; i++) {
  GF_EXP[i] = x
  GF_LOG[x] = i
  x <<= 1
  if (x >= 256) x ^= 0x11d
}
for (let i = 255; i < 512; i++) {
  GF_EXP[i] = GF_EXP[i - 255]
}

/** GF(256) 乘法 */
export function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return GF_EXP[GF_LOG[a] + GF_LOG[b]]
}

export { GF_EXP, GF_LOG }
