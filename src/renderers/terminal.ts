/**
 * 终端渲染器
 *
 * 将 boolean[][] 矩阵转为 Unicode 块字符串，可在终端直接显示。
 * 使用 ▀ ▄ █ 和空格实现 2 行合 1 行的紧凑显示。
 */

export interface TerminalOptions {
  /** 静默区模块数，默认 2（终端空间有限，默认较小） */
  quietZone?: number
  /** 是否反转颜色（适配浅色终端背景），默认 false */
  invert?: boolean
}

/** 将 QR 码矩阵转为终端可显示的字符串 */
export function toTerminal(modules: boolean[][], options?: TerminalOptions): string {
  const { quietZone = 2, invert = false } = options ?? {}
  const count = modules.length

  // 添加静默区的辅助函数
  const get = (row: number, col: number): boolean => {
    const r = row - quietZone
    const c = col - quietZone
    if (r < 0 || r >= count || c < 0 || c >= count) return false
    return invert ? !modules[r][c] : modules[r][c]
  }

  const totalRows = count + quietZone * 2
  const totalCols = count + quietZone * 2
  const lines: string[] = []

  // 每两行合并为一行，使用 Unicode 半块字符
  for (let row = 0; row < totalRows; row += 2) {
    let line = ''
    for (let col = 0; col < totalCols; col++) {
      const top = get(row, col)
      const bottom = row + 1 < totalRows ? get(row + 1, col) : false

      if (top && bottom) {
        line += '█'
      } else if (top && !bottom) {
        line += '▀'
      } else if (!top && bottom) {
        line += '▄'
      } else {
        line += ' '
      }
    }
    lines.push(line)
  }

  return lines.join('\n')
}
