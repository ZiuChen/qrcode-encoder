import { defineConfig } from 'tsdown'

export default defineConfig([
  // ESM: 多入口，面向构建工具和 Node.js
  {
    entry: [
      'src/index.ts',
      'src/encoder/index.ts',
      'src/renderers/canvas.ts',
      'src/renderers/png.ts',
      'src/renderers/svg.ts',
      'src/renderers/terminal.ts'
    ],
    dts: {
      tsgo: true
    },
    sourcemap: true,
    exports: true
  },
  // IIFE: 单文件 bundle，面向 CDN / <script> 标签直接引用
  {
    entry: { 'qrcode-encoder': 'src/index.ts' },
    format: 'iife',
    globalName: 'QRCodeEncoder',
    outDir: 'dist/iife',
    platform: 'browser',
    dts: false,
    sourcemap: true,
    minify: true
  }
])
