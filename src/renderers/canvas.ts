/**
 * Canvas 2D 渲染器
 *
 * 将 boolean[][] 矩阵绘制到 Canvas 上。
 * 接收外部 Canvas 对象，兼容浏览器 HTMLCanvasElement、OffscreenCanvas、
 * 微信小程序 Canvas、node-canvas 等任意实现了 Canvas 2D API 的对象。
 */

export interface CanvasOptions {
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

/**
 * 兼容各平台的最小 Canvas 接口
 * 仅要求 getContext('2d') 和可写的 width/height
 */
export interface CanvasLike {
  width: number
  height: number
  getContext(type: '2d'): CanvasRenderingContext2DLike | null
}

export interface CanvasRenderingContext2DLike {
  fillStyle: string | CanvasGradient | CanvasPattern
  fillRect(x: number, y: number, w: number, h: number): void
  clearRect(x: number, y: number, w: number, h: number): void
}

/**
 * 将 QR 码矩阵绘制到 Canvas 上
 *
 * @returns 绘制后的画布像素尺寸
 */
export function toCanvas(
  modules: boolean[][],
  canvas: CanvasLike,
  options?: CanvasOptions
): { size: number } {
  const {
    moduleSize = 10,
    quietZone = 4,
    foreground = '#000000',
    background = '#ffffff',
    transparent = false
  } = options ?? {}

  const count = modules.length
  const totalSize = (count + quietZone * 2) * moduleSize

  canvas.width = totalSize
  canvas.height = totalSize

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get 2d context from canvas')
  }

  // 绘制背景
  if (transparent) {
    ctx.clearRect(0, 0, totalSize, totalSize)
  } else {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, totalSize, totalSize)
  }

  // 绘制二维码模块
  ctx.fillStyle = foreground
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (modules[row][col]) {
        ctx.fillRect(
          (col + quietZone) * moduleSize,
          (row + quietZone) * moduleSize,
          moduleSize,
          moduleSize
        )
      }
    }
  }

  return { size: totalSize }
}
