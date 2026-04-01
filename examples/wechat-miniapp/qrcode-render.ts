/**
 * 微信小程序 Canvas 2D 渲染适配器
 *
 * 基于 qrcode-encoder 的编码核心，在微信小程序 Canvas 2D 上渲染二维码。
 * 仅依赖 encode()，与编码核心完全解耦。
 *
 * 使用方式：
 * ```ts
 * import { drawQrcode } from './qrcode-render'
 *
 * drawQrcode({
 *   canvasId: 'qrcode',
 *   text: 'https://example.com',
 *   size: 200,
 *   onSuccess: (path) => console.log('临时图片路径:', path),
 * })
 * ```
 */

// 注意：实际使用时改为正确的包导入路径
// import { encode } from 'qrcode-encoder'
import { encode } from '../../src'

export interface DrawQrcodeOptions {
  /** canvas 组件的 id */
  canvasId: string
  /** 二维码内容 */
  text: string
  /** 画布像素尺寸 */
  size: number
  /** 边距（静默区），默认为画布尺寸的 10% */
  padding?: number
  /** 前景色，默认 '#000000' */
  foreground?: string
  /** 背景色，默认 '#ffffff' */
  background?: string
  /** 是否输出透明背景（忽略 background），默认 false */
  transparent?: boolean
  /** 中心 Logo 图片路径（本地路径或临时路径） */
  logo?: string
  /** Logo 显示尺寸（像素），默认为二维码内容区域的 25% */
  logoSize?: number
  /** 组件实例，用于在自定义组件内查找 canvas */
  component?: any
  /** 渲染成功回调，返回临时图片路径 */
  onSuccess?: (tempFilePath: string) => void
  /** 渲染失败回调 */
  onError?: (err: any) => void
}

/**
 * 在微信小程序 Canvas 2D 上渲染二维码
 */
export function drawQrcode(options: DrawQrcodeOptions): void {
  const {
    canvasId,
    text,
    size,
    foreground = '#000000',
    background = '#ffffff',
    transparent = false,
    logo,
    logoSize,
    component,
    onSuccess,
    onError
  } = options

  try {
    // 使用解耦的编码核心
    const modules = encode(text)
    const moduleCount = modules.length
    const padding = options.padding ?? Math.round(size * 0.1)
    const innerSize = size - padding * 2
    const cellSize = innerSize / moduleCount

    const query = wx.createSelectorQuery()
    if (component) {
      query.in(component.$scope || component)
    }
    query
      .select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res: any) => {
        if (!res?.[0]?.node) {
          onError?.(new Error('Canvas node not found'))
          return
        }

        try {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio

          canvas.width = size * dpr
          canvas.height = size * dpr
          ctx.scale(dpr, dpr)

          // 绘制背景
          if (transparent) {
            ctx.clearRect(0, 0, size, size)
          } else {
            ctx.fillStyle = background
            ctx.fillRect(0, 0, size, size)
          }

          // 绘制二维码模块
          ctx.fillStyle = foreground
          for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
              if (modules[row][col]) {
                const x = Math.round(padding + col * cellSize)
                const y = Math.round(padding + row * cellSize)
                const nextX = Math.round(padding + (col + 1) * cellSize)
                const nextY = Math.round(padding + (row + 1) * cellSize)
                ctx.fillRect(x, y, nextX - x, nextY - y)
              }
            }
          }

          const exportToImage = () => {
            wx.canvasToTempFilePath({
              canvas,
              x: 0,
              y: 0,
              width: size,
              height: size,
              destWidth: size * dpr,
              destHeight: size * dpr,
              fileType: 'png',
              success: (res: any) => onSuccess?.(res.tempFilePath),
              fail: (err: any) => onError?.(err)
            })
          }

          // 绘制中心 Logo
          if (logo) {
            const displaySize = logoSize || Math.round(innerSize * 0.25)
            const logoPad = Math.round(displaySize * 0.08)
            const totalArea = displaySize + logoPad * 2
            const cx = (size - totalArea) / 2
            const cy = (size - totalArea) / 2

            if (transparent) {
              ctx.clearRect(cx, cy, totalArea, totalArea)
            } else {
              ctx.fillStyle = background
              ctx.fillRect(cx, cy, totalArea, totalArea)
            }

            const img = canvas.createImage()
            img.onload = () => {
              ctx.drawImage(img, cx + logoPad, cy + logoPad, displaySize, displaySize)
              exportToImage()
            }
            img.onerror = () => {
              console.error('Logo image load error')
              exportToImage()
            }
            img.src = logo
          } else {
            exportToImage()
          }
        } catch (e) {
          onError?.(e)
        }
      })
  } catch (e) {
    onError?.(e)
  }
}
