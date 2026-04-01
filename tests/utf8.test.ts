import { describe, expect, it } from 'vitest'
import { textToBytes } from '../src/encoder/utf8'

describe('UTF-8 encoding', () => {
  it('should encode ASCII correctly', () => {
    expect(textToBytes('A')).toEqual([0x41])
    expect(textToBytes('Hello')).toEqual([0x48, 0x65, 0x6c, 0x6c, 0x6f])
  })

  it('should encode 2-byte characters', () => {
    // 'é' = U+00E9 → 0xC3 0xA9
    expect(textToBytes('é')).toEqual([0xc3, 0xa9])
  })

  it('should encode 3-byte characters (CJK)', () => {
    // '你' = U+4F60 → 0xE4 0xBD 0xA0
    expect(textToBytes('你')).toEqual([0xe4, 0xbd, 0xa0])
    // '好' = U+597D → 0xE5 0xA5 0xBD
    expect(textToBytes('好')).toEqual([0xe5, 0xa5, 0xbd])
  })

  it('should encode 4-byte characters (emoji)', () => {
    // '🌍' = U+1F30D → 0xF0 0x9F 0x8C 0x8D
    expect(textToBytes('🌍')).toEqual([0xf0, 0x9f, 0x8c, 0x8d])
  })

  it('should encode mixed content', () => {
    const bytes = textToBytes('A你')
    expect(bytes).toEqual([0x41, 0xe4, 0xbd, 0xa0])
  })

  it('should handle empty string', () => {
    expect(textToBytes('')).toEqual([])
  })
})
