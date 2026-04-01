/**
 * Node.js CLI 示例：在终端生成并显示二维码
 *
 * 使用方式：
 *   npx tsx examples/node-cli/index.ts "https://example.com"
 *   npx tsx examples/node-cli/index.ts --svg "Hello World" > qrcode.svg
 *
 * 参数：
 *   --svg     输出 SVG 到 stdout（可重定向到文件）
 *   --quiet N 设置静默区大小（默认 2）
 *   --invert  反转终端颜色（适合浅色背景终端）
 */

import process from 'node:process'
import { encode, toSVG, toTerminal } from '../../src'

function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help')) {
    console.log(`Usage: npx tsx examples/node-cli/index.ts [options] <text>

Options:
  --svg      Output SVG to stdout
  --quiet N  Quiet zone size (default: 2)
  --invert   Invert colors for light terminal backgrounds
  --help     Show this help message

Examples:
  npx tsx examples/node-cli/index.ts "https://example.com"
  npx tsx examples/node-cli/index.ts --svg "Hello" > qrcode.svg`)
    process.exit(0)
  }

  const svgMode = args.includes('--svg')
  const invert = args.includes('--invert')
  let quietZone = 2

  const quietIdx = args.indexOf('--quiet')
  if (quietIdx !== -1 && args[quietIdx + 1]) {
    quietZone = Number.parseInt(args[quietIdx + 1], 10)
  }

  // 提取文本（最后一个非选项参数）
  const text = args
    .filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1] === '--quiet'))
    .pop()

  if (!text) {
    console.error('Error: No text provided')
    process.exit(1)
  }

  const modules = encode(text)

  if (svgMode) {
    console.log(toSVG(modules, { quietZone }))
  } else {
    console.log(toTerminal(modules, { quietZone, invert }))
    console.log(`\nContent: ${text}`)
    console.log(`Version: ${(modules.length - 17) / 4}, Size: ${modules.length}x${modules.length}`)
  }
}

main()
