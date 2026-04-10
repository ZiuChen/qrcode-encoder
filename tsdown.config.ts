import { defineConfig } from 'tsdown'

export default defineConfig({
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
})
