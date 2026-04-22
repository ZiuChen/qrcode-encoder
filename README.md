# qrcode-encoder

Zero-dependency QR Code encoder — pure algorithm implementation (ISO/IEC 18004), supporting V1–V40, ECC-M, and Byte mode.

Built-in SVG, PNG, Canvas, and terminal renderers. Works in any JavaScript environment: Node.js, browser, WeChat Mini Program, React Native, and more.

[中文文档](README.zh-CN.md)

## Installation

```bash
pnpm add qrcode-encoder
```

## Core API

```ts
import { encode, toCanvas, toPng, toPngDataURL, toSVG, toTerminal } from 'qrcode-encoder'

// Encode to a boolean[][] matrix (true = dark module)
const modules = encode('https://example.com')

// Render to SVG string
const svg = toSVG(modules, { moduleSize: 10, quietZone: 4 })

// Render to PNG Uint8Array (zero dependencies, pure algorithm)
const pngBytes = toPng(modules)

// Render to PNG data URL (usable as <img> src directly)
const dataUrl = toPngDataURL(modules)

// Draw onto a Canvas (accepts an external canvas, compatible with any platform)
toCanvas(modules, document.getElementById('qr-canvas'))

// Render to terminal Unicode string
console.log(toTerminal(modules))
```

### `encode(text, options?)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | `string` | QR Code content |
| `options.errorCorrection` | `'L' \| 'M' \| 'Q' \| 'H'` | Error correction level (currently only `'M'` is supported) |
| `options.minVersion` | `number` | Minimum version 1–40; auto-selected by default |

### `toSVG(modules, options?)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `moduleSize` | `number` | `10` | Pixel size per module |
| `quietZone` | `number` | `4` | Quiet zone width in modules |
| `foreground` | `string` | `'#000000'` | Foreground color |
| `background` | `string` | `'#ffffff'` | Background color |
| `transparent` | `boolean` | `false` | Transparent background |

### `toCanvas(modules, canvas, options?)`

Draws the matrix onto a Canvas. Accepts any external Canvas object — compatible with browser, WeChat Mini Program, node-canvas, etc.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `canvas` | `CanvasLike` | — | Any object implementing `getContext('2d')` |
| `moduleSize` | `number` | `10` | Pixel size per module |
| `quietZone` | `number` | `4` | Quiet zone width in modules |
| `foreground` | `string` | `'#000000'` | Foreground color |
| `background` | `string` | `'#ffffff'` | Background color |
| `transparent` | `boolean` | `false` | Transparent background |

### `toPng(modules, options?)`

Pure-algorithm PNG encoding with zero runtime dependencies. Returns a `Uint8Array`.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `moduleSize` | `number` | `4` | Pixel size per module |
| `quietZone` | `number` | `4` | Quiet zone width in modules |
| `foreground` | `[R, G, B]` | `[0,0,0]` | Foreground RGB color |
| `background` | `[R, G, B]` | `[255,255,255]` | Background RGB color |

### `toPngDataURL(modules, options?)`

Same options as `toPng`. Returns a `data:image/png;base64,...` string.

### `toTerminal(modules, options?)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `quietZone` | `number` | `2` | Quiet zone width in modules |
| `invert` | `boolean` | `false` | Invert colors (for light-background terminals) |

## Examples

### Node.js CLI

```bash
npx tsx examples/node-cli/index.ts "https://example.com"
npx tsx examples/node-cli/index.ts --svg "Hello" > qrcode.svg
```

### Browser HTML Canvas

See [examples/html/index.html](examples/html/index.html)

```js
import { encode, toSVG } from 'qrcode-encoder'

const modules = encode('https://example.com')

// Option 1: Inject SVG
document.body.innerHTML = toSVG(modules)

// Option 2: Canvas rendering
const canvas = document.getElementById('qr')
const ctx = canvas.getContext('2d')
const size = 8
modules.forEach((row, y) =>
  row.forEach((cell, x) => {
    if (cell) ctx.fillRect(x * size, y * size, size, size)
  })
)
```

### WeChat Mini Program

See [examples/wechat-miniapp/](examples/wechat-miniapp/)

```vue
<template>
  <QRCode text="https://example.com" :size="200" />
</template>

<script setup>
import QRCode from './QRCode.vue'
</script>
```

## Compatibility

The library is distributed as native ESM (`.mjs`) with no transpilation of modern syntax, so the minimum supported runtimes are determined by `??` / `?.` operator support.

| Runtime | Minimum Version |
|---|---|
| Node.js | **≥ 14.0** |
| Chrome / Edge | **≥ 80** |
| Firefox | **≥ 72** |
| Safari | **≥ 13.1** |

> **`toCanvas`** requires an external Canvas object (e.g. `HTMLCanvasElement`, `OffscreenCanvas`, WeChat Mini Program canvas, `node-canvas`) — the browser Canvas API itself is not bundled.

## Architecture

```
src/
├── index.ts              # Main entry
├── encoder/              # Encoding core (pure algorithm, zero dependencies)
│   ├── matrix.ts         # Entry: encode()
│   ├── galois-field.ts   # GF(256) finite field
│   ├── reed-solomon.ts   # Reed-Solomon error correction
│   ├── data-encoder.ts   # Data encoding + interleaving
│   ├── bch.ts            # BCH encoding
│   ├── mask.ts           # Masking + penalty evaluation
│   ├── patterns.ts       # Function pattern placement
│   ├── utf8.ts           # UTF-8 encoding
│   ├── constants.ts      # Version configuration tables
│   └── types.ts          # Type definitions
└── renderers/            # Renderers (zero dependencies)
    ├── canvas.ts         # Canvas 2D rendering
    ├── png.ts            # PNG binary encoding
    ├── svg.ts            # SVG string rendering
    └── terminal.ts       # Terminal Unicode rendering
```

## Development

```bash
pnpm install
pnpm run test     # Run tests (70 cases)
pnpm run build    # Build
pnpm run dev      # Dev mode
```

## License

MIT
