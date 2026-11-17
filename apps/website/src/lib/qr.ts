import { encode, toCanvas, toSVG } from 'qrcode-encoder'
import type { ErrorCorrectionLevel } from 'qrcode-encoder'

export interface QRRenderOptions {
  /** 纠错级别 */
  ecc: ErrorCorrectionLevel
  /** 每模块像素大小 */
  moduleSize: number
  /** 静默区模块数 */
  quietZone: number
}

export const DEFAULT_QR_OPTIONS: QRRenderOptions = {
  ecc: 'M',
  moduleSize: 8,
  quietZone: 4,
}

/** 生成二维码 SVG 字符串，内容为空或编码失败时返回空字符串 */
export function buildSVG(text: string, options: QRRenderOptions): string {
  const trimmed = text.trim()
  if (!trimmed) return ''
  try {
    const modules = encode(trimmed, { errorCorrection: options.ecc })
    return toSVG(modules, {
      moduleSize: options.moduleSize,
      quietZone: options.quietZone,
    })
  } catch {
    return ''
  }
}

/** 将二维码编码为 PNG Blob（用于剪贴板复制与下载） */
export async function buildPngBlob(text: string, options: QRRenderOptions): Promise<Blob> {
  const trimmed = text.trim()
  if (!trimmed) throw new Error('内容为空')
  const modules = encode(trimmed, { errorCorrection: options.ecc })
  const canvas = document.createElement('canvas')
  toCanvas(modules, canvas, {
    moduleSize: options.moduleSize,
    quietZone: options.quietZone,
  })
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('生成 PNG 失败')
  return blob
}

export async function copyPngToClipboard(text: string, options: QRRenderOptions): Promise<boolean> {
  const blob = await buildPngBlob(text, options)
  if (!navigator.clipboard || typeof ClipboardItem === 'undefined') return false
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    return true
  } catch {
    return false
  }
}

export function downloadPng(text: string, options: QRRenderOptions): void {
  buildPngBlob(text, options).then((blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `qrcode-${Date.now()}.png`
    link.click()
    URL.revokeObjectURL(url)
  })
}
