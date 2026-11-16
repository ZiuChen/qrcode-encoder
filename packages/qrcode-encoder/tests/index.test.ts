import { expect, test } from 'vitest'
import { encode, toCanvas, toPng, toPngDataURL, toSVG, toTerminal } from '../src'

test('public API exports', () => {
  expect(typeof encode).toBe('function')
  expect(typeof toCanvas).toBe('function')
  expect(typeof toPng).toBe('function')
  expect(typeof toPngDataURL).toBe('function')
  expect(typeof toSVG).toBe('function')
  expect(typeof toTerminal).toBe('function')
})
