import { describe, expect, it } from 'vitest'
import jsQR from 'jsqr'
import { encode } from '../src/encoder'
import { toCanvas } from '../src/renderers/canvas'
import { toPng, toPngDataURL } from '../src/renderers/png'
import { toSVG } from '../src/renderers/svg'
import { toTerminal } from '../src/renderers/terminal'
import { generateExactBytes, TEST_VECTORS } from './test-vectors'

/**
 * 将 boolean[][] 矩阵转为 jsQR 可识别的 RGBA ImageData
 * 添加静默区并放大像素以确保 jsQR 能正确识别
 */
function modulesToImageData(
  modules: boolean[][],
  quietZone: number = 4,
  scale: number = 4
): { data: Uint8ClampedArray; width: number; height: number } {
  const count = modules.length
  const size = (count + quietZone * 2) * scale
  const data = new Uint8ClampedArray(size * size * 4)

  // 默认白色背景
  data.fill(255)

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (modules[row][col]) {
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const x = (col + quietZone) * scale + sx
            const y = (row + quietZone) * scale + sy
            const idx = (y * size + x) * 4
            data[idx] = 0 // R
            data[idx + 1] = 0 // G
            data[idx + 2] = 0 // B
            // A stays 255
          }
        }
      }
    }
  }

  return { data, width: size, height: size }
}

/** 编码并解码验证 */
function encodeAndDecode(text: string): string | null {
  const modules = encode(text)
  const { data, width, height } = modulesToImageData(modules)
  const result = jsQR(data, width, height)
  return result?.data ?? null
}

// ========== 编码核心集成测试 ==========

describe('QR Code encoder - integration (encode + jsQR decode)', () => {
  for (const vector of TEST_VECTORS) {
    it(`should encode/decode: ${vector.name}`, () => {
      const decoded = encodeAndDecode(vector.input)
      expect(decoded).toBe(vector.expected ?? vector.input)
    })
  }
})

// ========== 矩阵结构测试 ==========

describe('QR Code encoder - matrix structure', () => {
  it('should return a square boolean matrix', () => {
    const modules = encode('test')
    expect(modules.length).toBeGreaterThan(0)
    expect(modules[0].length).toBe(modules.length)
    for (const row of modules) {
      for (const cell of row) {
        expect(typeof cell).toBe('boolean')
      }
    }
  })

  it('should produce V1 (21x21) for short input', () => {
    // "A" = 1 byte, fits V1 (max 14 bytes for ECC-M)
    const modules = encode('A')
    expect(modules.length).toBe(21)
  })

  it('should produce V2 (25x25) for 15-byte input', () => {
    const input = generateExactBytes(15)
    const modules = encode(input)
    expect(modules.length).toBe(25)
  })

  it('should respect minVersion option', () => {
    // "A" fits in V1, but force V5
    const modules = encode('A', { minVersion: 5 })
    const expectedSize = 5 * 4 + 17 // V5 → 37x37
    expect(modules.length).toBe(expectedSize)
  })

  it('should throw for data that exceeds V40 capacity', () => {
    // V40 ECC-M max = 2331 bytes. Create larger input.
    const input = generateExactBytes(2400)
    expect(() => encode(input)).toThrow()
  })
})

// ========== 版本边界测试 ==========

describe('QR Code encoder - version boundaries', () => {
  const versionTests = [
    { bytes: 14, expectedVersion: 1, expectedSize: 21 },
    { bytes: 15, expectedVersion: 2, expectedSize: 25 },
    { bytes: 26, expectedVersion: 2, expectedSize: 25 },
    { bytes: 27, expectedVersion: 3, expectedSize: 29 },
    { bytes: 42, expectedVersion: 3, expectedSize: 29 },
    { bytes: 43, expectedVersion: 4, expectedSize: 33 }
  ]

  for (const { bytes, expectedVersion, expectedSize } of versionTests) {
    it(`${bytes} bytes → V${expectedVersion} (${expectedSize}x${expectedSize})`, () => {
      const input = generateExactBytes(bytes)
      const modules = encode(input)
      expect(modules.length).toBe(expectedSize)
      // Also verify it decodes correctly
      const decoded = encodeAndDecode(input)
      expect(decoded).toBe(input)
    })
  }
})

// ========== SVG 渲染器测试 ==========

describe('SVG renderer', () => {
  it('should produce valid SVG string', () => {
    const modules = encode('test')
    const svg = toSVG(modules)
    expect(svg).toContain('<svg')
    expect(svg).toContain('</svg>')
    expect(svg).toContain('<path')
  })

  it('should respect custom options', () => {
    const modules = encode('test')
    const svg = toSVG(modules, {
      moduleSize: 5,
      quietZone: 2,
      foreground: '#ff0000',
      background: '#00ff00'
    })
    expect(svg).toContain('fill="#ff0000"')
    expect(svg).toContain('fill="#00ff00"')
  })

  it('should support transparent background', () => {
    const modules = encode('test')
    const svg = toSVG(modules, { transparent: true })
    // Should NOT contain a background rect
    expect(svg).not.toContain('<rect')
  })
})

// ========== Terminal 渲染器测试 ==========

describe('Terminal renderer', () => {
  it('should produce non-empty string', () => {
    const modules = encode('test')
    const output = toTerminal(modules)
    expect(output.length).toBeGreaterThan(0)
    expect(output).toContain('\n')
  })

  it('should support invert option', () => {
    const modules = encode('test')
    const normal = toTerminal(modules)
    const inverted = toTerminal(modules, { invert: true })
    expect(normal).not.toBe(inverted)
  })
})

// ========== Canvas 渲染器测试 ==========

/** 简单的 mock Canvas 实现 */
function createMockCanvas() {
  const pixels: Array<{ x: number; y: number; w: number; h: number; color: string }> = []
  let currentFillStyle = ''
  let w = 0
  let h = 0

  return {
    get width() {
      return w
    },
    set width(v: number) {
      w = v
    },
    get height() {
      return h
    },
    set height(v: number) {
      h = v
    },
    getContext(_type: '2d') {
      return {
        get fillStyle() {
          return currentFillStyle
        },
        set fillStyle(v: string) {
          currentFillStyle = v as string
        },
        fillRect(x: number, y: number, width: number, height: number) {
          pixels.push({ x, y, w: width, h: height, color: currentFillStyle })
        },
        clearRect() {
          /* noop */
        }
      }
    },
    pixels
  }
}

describe('Canvas renderer', () => {
  it('should set canvas dimensions', () => {
    const modules = encode('test')
    const canvas = createMockCanvas()
    const { size } = toCanvas(modules, canvas)
    expect(canvas.width).toBe(size)
    expect(canvas.height).toBe(size)
    expect(size).toBeGreaterThan(0)
  })

  it('should draw modules on canvas', () => {
    const modules = encode('A')
    const canvas = createMockCanvas()
    toCanvas(modules, canvas, { moduleSize: 1, quietZone: 0 })
    // Should have at least background + some dark modules
    expect(canvas.pixels.length).toBeGreaterThan(1)
  })

  it('should respect custom options', () => {
    const modules = encode('test')
    const canvas = createMockCanvas()
    toCanvas(modules, canvas, {
      moduleSize: 5,
      quietZone: 2,
      foreground: '#ff0000',
      background: '#00ff00'
    })
    // Background should be first draw
    expect(canvas.pixels[0].color).toBe('#00ff00')
    // Dark modules should use foreground
    const darkPixels = canvas.pixels.filter((p) => p.color === '#ff0000')
    expect(darkPixels.length).toBeGreaterThan(0)
  })
})

// ========== PNG 渲染器测试 ==========

describe('PNG renderer', () => {
  it('should produce valid PNG header', () => {
    const modules = encode('test')
    const png = toPng(modules)
    // PNG signature: 137 80 78 71 13 10 26 10
    expect(png[0]).toBe(137)
    expect(png[1]).toBe(80) // P
    expect(png[2]).toBe(78) // N
    expect(png[3]).toBe(71) // G
    expect(png[4]).toBe(13)
    expect(png[5]).toBe(10)
    expect(png[6]).toBe(26)
    expect(png[7]).toBe(10)
  })

  it('should produce a Uint8Array with reasonable size', () => {
    const modules = encode('test')
    const png = toPng(modules, { moduleSize: 1 })
    // V1 (21x21) + quietZone 4 = 29x29, RGB = ~2.5KB raw + overhead
    expect(png.length).toBeGreaterThan(100)
    expect(png instanceof Uint8Array).toBe(true)
  })

  it('should respect custom module size', () => {
    const modules = encode('A')
    const small = toPng(modules, { moduleSize: 1 })
    const large = toPng(modules, { moduleSize: 4 })
    expect(large.length).toBeGreaterThan(small.length)
  })

  it('should contain IHDR, IDAT, IEND chunks', () => {
    const modules = encode('test')
    const png = toPng(modules)
    const str = Array.from(png)
      .map((b) => String.fromCharCode(b))
      .join('')
    expect(str).toContain('IHDR')
    expect(str).toContain('IDAT')
    expect(str).toContain('IEND')
  })
})

describe('PNG Data URL', () => {
  it('should produce a valid data URL', () => {
    const modules = encode('test')
    const url = toPngDataURL(modules)
    expect(url).toMatch(/^data:image\/png;base64,[A-Za-z0-9+/=]+$/)
  })

  it('should start with correct PNG base64 prefix', () => {
    const modules = encode('test')
    const url = toPngDataURL(modules)
    // PNG base64 always starts with iVBOR
    expect(url).toContain('iVBOR')
  })
})
