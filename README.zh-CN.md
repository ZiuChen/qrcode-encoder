# qrcode-encoder

零依赖的 QR Code 编码器，纯算法实现（ISO/IEC 18004），支持 V1-V40、ECC-M、Byte 模式。

内置 SVG、PNG、Canvas 和终端渲染器，可在任意 JavaScript 环境中使用（Node.js、浏览器、微信小程序、React Native 等）。

## 安装

```bash
pnpm add qrcode-encoder
```

## 核心 API

```ts
import { encode, toCanvas, toPng, toPngDataURL, toSVG, toTerminal } from 'qrcode-encoder'

// 编码为 boolean[][] 矩阵（true = 黑色模块）
const modules = encode('https://example.com')

// 渲染为 SVG 字符串
const svg = toSVG(modules, { moduleSize: 10, quietZone: 4 })

// 渲染为 PNG Uint8Array（零依赖，纯算法）
const pngBytes = toPng(modules)

// 渲染为 PNG data URL（可直接用于 <img> src）
const dataUrl = toPngDataURL(modules)

// 绘制到 Canvas（接收外部 canvas，兼容任意平台）
toCanvas(modules, document.getElementById('qr-canvas'))

// 渲染为终端 Unicode 字符串
console.log(toTerminal(modules))
```

### `encode(text, options?)`

| 参数 | 类型 | 说明 |
|------|------|------|
| `text` | `string` | 二维码内容 |
| `options.errorCorrection` | `'L' \| 'M' \| 'Q' \| 'H'` | 纠错级别（当前仅支持 `'M'`） |
| `options.minVersion` | `number` | 最小版本号 1-40，默认自动选择 |

### `toSVG(modules, options?)`

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `moduleSize` | `number` | `10` | 每个模块的像素大小 |
| `quietZone` | `number` | `4` | 静默区模块数 |
| `foreground` | `string` | `'#000000'` | 前景色 |
| `background` | `string` | `'#ffffff'` | 背景色 |
| `transparent` | `boolean` | `false` | 是否透明背景 |

### `toCanvas(modules, canvas, options?)`

将矩阵绘制到 Canvas 上。接收外部 Canvas 对象，兼容浏览器、微信小程序、node-canvas 等。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `canvas` | `CanvasLike` | — | 任何实现了 `getContext('2d')` 的对象 |
| `moduleSize` | `number` | `10` | 每个模块的像素大小 |
| `quietZone` | `number` | `4` | 静默区模块数 |
| `foreground` | `string` | `'#000000'` | 前景色 |
| `background` | `string` | `'#ffffff'` | 背景色 |
| `transparent` | `boolean` | `false` | 是否透明背景 |

### `toPng(modules, options?)`

纯算法 PNG 编码，零运行时依赖。返回 `Uint8Array`。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `moduleSize` | `number` | `4` | 每个模块的像素大小 |
| `quietZone` | `number` | `4` | 静默区模块数 |
| `foreground` | `[R, G, B]` | `[0,0,0]` | 前景色 RGB |
| `background` | `[R, G, B]` | `[255,255,255]` | 背景色 RGB |

### `toPngDataURL(modules, options?)`

与 `toPng` 相同的参数，返回 `data:image/png;base64,...` 字符串。

### `toTerminal(modules, options?)`

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `quietZone` | `number` | `2` | 静默区模块数 |
| `invert` | `boolean` | `false` | 反转颜色（适合浅色终端） |

## 使用示例

### Node.js CLI

```bash
npx tsx examples/node-cli/index.ts "https://example.com"
npx tsx examples/node-cli/index.ts --svg "Hello" > qrcode.svg
```

### 浏览器 HTML Canvas

参见 [examples/html/index.html](examples/html/index.html)

```js
import { encode, toSVG } from 'qrcode-encoder'

const modules = encode('https://example.com')

// 方式 1: 插入 SVG
document.body.innerHTML = toSVG(modules)

// 方式 2: Canvas 渲染
const canvas = document.getElementById('qr')
const ctx = canvas.getContext('2d')
const size = 8
modules.forEach((row, y) =>
  row.forEach((cell, x) => {
    if (cell) ctx.fillRect(x * size, y * size, size, size)
  })
)
```

### 微信小程序

参见 [examples/wechat-miniapp/](examples/wechat-miniapp/)

```vue
<template>
  <QRCode text="https://example.com" :size="200" />
</template>

<script setup>
import QRCode from './QRCode.vue'
</script>
```

## 架构

```
src/
├── index.ts              # 主入口
├── encoder/              # 编码核心（纯算法，零依赖）
│   ├── matrix.ts         # 入口：encode()
│   ├── galois-field.ts   # GF(256) 有限域
│   ├── reed-solomon.ts   # Reed-Solomon 纠错
│   ├── data-encoder.ts   # 数据编码 + 交织
│   ├── bch.ts            # BCH 编码
│   ├── mask.ts           # 掩码 + 惩罚评估
│   ├── patterns.ts       # 功能图案放置
│   ├── utf8.ts           # UTF-8 编码
│   ├── constants.ts      # 版本配置表
│   └── types.ts          # 类型定义
└── renderers/            # 渲染器（零依赖）
    ├── canvas.ts         # Canvas 2D 渲染
    ├── png.ts            # PNG 二进制编码
    ├── svg.ts            # SVG 字符串渲染
    └── terminal.ts       # 终端 Unicode 渲染
```

## 开发

```bash
pnpm install
pnpm run test     # 运行测试（70 个用例）
pnpm run build    # 构建
pnpm run dev      # 开发模式
```

## License

MIT
