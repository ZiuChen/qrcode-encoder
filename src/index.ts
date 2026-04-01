// Encoder
export { encode } from './encoder'
export type { ErrorCorrectionLevel, QRCodeOptions } from './encoder'

// Renderers
export { toCanvas, toPng, toPngDataURL, toSVG, toTerminal } from './renderers'
export type {
  CanvasLike,
  CanvasOptions,
  CanvasRenderingContext2DLike,
  PngOptions,
  SVGOptions,
  TerminalOptions
} from './renderers'
