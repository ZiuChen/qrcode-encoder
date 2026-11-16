import { describe, expect, it } from 'vitest'
import { rsEncode, rsGeneratorPoly } from '../src/encoder/reed-solomon'

describe('Reed-Solomon', () => {
  it('rsGeneratorPoly(1) should be [1, 1]', () => {
    // g(x) = (x - α^0) = x + 1
    expect(rsGeneratorPoly(1)).toEqual([1, 1])
  })

  it('rsGeneratorPoly should return correct degree polynomial', () => {
    const gen = rsGeneratorPoly(10)
    expect(gen.length).toBe(11) // degree 10 → 11 coefficients
  })

  it('rsEncode should return correct number of EC codewords', () => {
    const data = [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236, 17, 236, 17]
    const ec = rsEncode(data, 10)
    expect(ec.length).toBe(10)
  })

  it('rsEncode output should be deterministic', () => {
    const data = [65, 66, 67]
    const ec1 = rsEncode(data, 7)
    const ec2 = rsEncode(data, 7)
    expect(ec1).toEqual(ec2)
  })
})
