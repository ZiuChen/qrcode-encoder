/**
 * SVG 渲染器
 *
 * 将 boolean[][] 矩阵转为 SVG 字符串。
 * 零运行时依赖，可在任意 JS 环境使用（浏览器、Node.js、小程序等）。
 */

export interface SVGOptions {
  /** 每个模块的像素大小，默认 10 */
  moduleSize?: number
  /** 静默区模块数，默认 4 */
  quietZone?: number
  /** 前景色，默认 '#000000' */
  foreground?: string
  /** 背景色，默认 '#ffffff' */
  background?: string
  /** 是否透明背景（忽略 background），默认 false */
  transparent?: boolean
}

/** 将 QR 码矩阵转为 SVG 字符串 */
export function toSVG(modules: boolean[][], options?: SVGOptions): string {
  const {
    moduleSize = 10,
    quietZone = 4,
    foreground = '#000000',
    background = '#ffffff',
    transparent = false
  } = options ?? {}

  const count = modules.length
  const totalSize = (count + quietZone * 2) * moduleSize

  const parts: string[] = []
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}" shape-rendering="crispEdges">`
  )

  if (!transparent) {
    parts.push(`<rect width="${totalSize}" height="${totalSize}" fill="${background}"/>`)
  }

  // 使用单条 path 优化 SVG 大小
  let pathData = ''
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (modules[row][col]) {
        const x = (col + quietZone) * moduleSize
        const y = (row + quietZone) * moduleSize
        pathData += `M${x},${y}h${moduleSize}v${moduleSize}h-${moduleSize}z`
      }
    }
  }

  if (pathData) {
    parts.push(`<path d="${pathData}" fill="${foreground}"/>`)
  }

  parts.push('</svg>')
  return parts.join('')
}
