/**
 * Reed-Solomon 纠错编码
 */

import { GF_EXP, gfMul } from './galois-field'

const _generatorPolyCache = new Map<number, number[]>()

/** 生成 RS 生成多项式（自动缓存结果） */
export function rsGeneratorPoly(degree: number): number[] {
  const cached = _generatorPolyCache.get(degree)
  if (cached) return cached
  let gen = [1]
  for (let i = 0; i < degree; i++) {
    const newGen = new Array<number>(gen.length + 1).fill(0)
    for (let j = 0; j < gen.length; j++) {
      newGen[j] ^= gen[j]
      newGen[j + 1] ^= gfMul(gen[j], GF_EXP[i])
    }
    gen = newGen
  }
  _generatorPolyCache.set(degree, gen)
  return gen
}

/** 计算纠错码字 */
export function rsEncode(data: number[], ecCount: number): number[] {
  const gen = rsGeneratorPoly(ecCount)
  const msg = new Array<number>(data.length + ecCount).fill(0)
  for (let i = 0; i < data.length; i++) msg[i] = data[i]

  for (let i = 0; i < data.length; i++) {
    const coef = msg[i]
    if (coef !== 0) {
      for (let j = 1; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef)
      }
    }
  }
  return msg.slice(data.length)
}
