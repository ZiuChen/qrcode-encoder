/**
 * PNG 渲染器
 *
 * 将 boolean[][] 矩阵编码为 PNG 格式的 Uint8Array。
 * 纯算法实现，零运行时依赖，可在任意 JS 环境使用。
 *
 * 使用 uncompressed DEFLATE blocks 以避免引入压缩算法，
 * 输出文件略大（~1.5x），但生成速度极快，对 QR 码小图完全可接受。
 */

export interface PngOptions {
  /** 每个模块的像素大小，默认 4 */
  moduleSize?: number
  /** 静默区模块数，默认 4 */
  quietZone?: number
  /** 前景色 RGB，默认 [0, 0, 0]（黑色） */
  foreground?: [number, number, number]
  /** 背景色 RGB，默认 [255, 255, 255]（白色） */
  background?: [number, number, number]
}

// ===== CRC32 =====

const CRC_TABLE = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  CRC_TABLE[n] = c
}

function crc32(data: Uint8Array, start: number, length: number): number {
  let crc = 0xffffffff
  for (let i = start; i < start + length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

// ===== Adler32 =====

function adler32(data: Uint8Array): number {
  let a = 1
  let b = 0
  for (let i = 0; i < data.length; i++) {
    a = (a + data[i]) % 65521
    b = (b + a) % 65521
  }
  return ((b << 16) | a) >>> 0
}

// ===== Helper: write big-endian uint32 =====

function writeU32BE(buf: Uint8Array, offset: number, value: number): void {
  buf[offset] = (value >>> 24) & 0xff
  buf[offset + 1] = (value >>> 16) & 0xff
  buf[offset + 2] = (value >>> 8) & 0xff
  buf[offset + 3] = value & 0xff
}

function writeU16BE(buf: Uint8Array, offset: number, value: number): void {
  buf[offset] = (value >>> 8) & 0xff
  buf[offset + 1] = value & 0xff
}

function writeU16LE(buf: Uint8Array, offset: number, value: number): void {
  buf[offset] = value & 0xff
  buf[offset + 1] = (value >>> 8) & 0xff
}

// ===== PNG Chunk =====

function createChunk(type: string, data: Uint8Array): Uint8Array {
  const chunk = new Uint8Array(4 + 4 + data.length + 4)
  // Length
  writeU32BE(chunk, 0, data.length)
  // Type
  for (let i = 0; i < 4; i++) chunk[4 + i] = type.charCodeAt(i)
  // Data
  chunk.set(data, 8)
  // CRC (over type + data)
  const crc = crc32(chunk, 4, 4 + data.length)
  writeU32BE(chunk, 8 + data.length, crc)
  return chunk
}

// ===== Uncompressed DEFLATE =====

/**
 * Wrap raw data in uncompressed DEFLATE format (zlib stream).
 * Max block size = 65535 bytes, split into multiple stored blocks if needed.
 */
function deflateUncompressed(raw: Uint8Array): Uint8Array {
  const MAX_BLOCK = 65535

  // Calculate number of blocks
  const numBlocks = Math.ceil(raw.length / MAX_BLOCK) || 1

  // zlib header (2 bytes) + blocks (5 bytes header each + data) + adler32 (4 bytes)
  const totalBlockHeaders = numBlocks * 5
  const outputSize = 2 + totalBlockHeaders + raw.length + 4
  const out = new Uint8Array(outputSize)
  let pos = 0

  // Zlib header: CM=8 (deflate), CINFO=7 (32K window), FCHECK
  out[pos++] = 0x78
  out[pos++] = 0x01 // minimal compression

  let remaining = raw.length
  let offset = 0

  while (remaining > 0 || offset === 0) {
    const blockSize = Math.min(remaining, MAX_BLOCK)
    const isLast = remaining <= MAX_BLOCK

    // BFINAL (1 if last) | BTYPE=00 (stored)
    out[pos++] = isLast ? 0x01 : 0x00
    // LEN (little-endian 16-bit)
    writeU16LE(out, pos, blockSize)
    pos += 2
    // NLEN (one's complement of LEN)
    writeU16LE(out, pos, blockSize ^ 0xffff)
    pos += 2
    // Raw data
    out.set(raw.subarray(offset, offset + blockSize), pos)
    pos += blockSize

    offset += blockSize
    remaining -= blockSize

    if (remaining <= 0) break
  }

  // Adler-32 checksum (big-endian)
  const checksum = adler32(raw)
  writeU32BE(out, pos, checksum)

  return out
}

// ===== Main API =====

/** 将 QR 码矩阵编码为 PNG 格式的 Uint8Array */
export function toPng(modules: boolean[][], options?: PngOptions): Uint8Array {
  const {
    moduleSize = 4,
    quietZone = 4,
    foreground = [0, 0, 0],
    background = [255, 255, 255]
  } = options ?? {}

  const count = modules.length
  const width = (count + quietZone * 2) * moduleSize
  const height = width

  // Build raw pixel data (RGB, no alpha for smaller size)
  // Each row: 1 filter byte + width * 3 RGB bytes
  const rowBytes = 1 + width * 3
  const rawData = new Uint8Array(rowBytes * height)

  for (let py = 0; py < height; py++) {
    const rowOffset = py * rowBytes
    rawData[rowOffset] = 0 // Filter: None

    for (let px = 0; px < width; px++) {
      const moduleRow = Math.floor(py / moduleSize) - quietZone
      const moduleCol = Math.floor(px / moduleSize) - quietZone

      const isDark =
        moduleRow >= 0 &&
        moduleRow < count &&
        moduleCol >= 0 &&
        moduleCol < count &&
        modules[moduleRow][moduleCol]

      const color = isDark ? foreground : background
      const idx = rowOffset + 1 + px * 3
      rawData[idx] = color[0]
      rawData[idx + 1] = color[1]
      rawData[idx + 2] = color[2]
    }
  }

  // Compress with uncompressed DEFLATE
  const compressed = deflateUncompressed(rawData)

  // Build PNG file
  const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdrData = new Uint8Array(13)
  writeU32BE(ihdrData, 0, width)
  writeU32BE(ihdrData, 4, height)
  ihdrData[8] = 8 // bit depth
  ihdrData[9] = 2 // color type: RGB
  ihdrData[10] = 0 // compression
  ihdrData[11] = 0 // filter
  ihdrData[12] = 0 // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData)

  // IDAT
  const idatChunk = createChunk('IDAT', compressed)

  // IEND
  const iendChunk = createChunk('IEND', new Uint8Array(0))

  // Concatenate
  const png = new Uint8Array(
    PNG_SIGNATURE.length + ihdrChunk.length + idatChunk.length + iendChunk.length
  )
  let offset = 0
  png.set(PNG_SIGNATURE, offset)
  offset += PNG_SIGNATURE.length
  png.set(ihdrChunk, offset)
  offset += ihdrChunk.length
  png.set(idatChunk, offset)
  offset += idatChunk.length
  png.set(iendChunk, offset)

  return png
}

/** 将 QR 码矩阵编码为 PNG data URL */
export function toPngDataURL(modules: boolean[][], options?: PngOptions): string {
  const pngBytes = toPng(modules, options)
  const base64 = uint8ArrayToBase64(pngBytes)
  return `data:image/png;base64,${base64}`
}

/** 跨平台 Uint8Array → base64 */
function uint8ArrayToBase64(bytes: Uint8Array): string {
  // Node.js Buffer
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  }
  // Browser
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}
