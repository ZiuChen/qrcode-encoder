/**
 * QR Code 编码测试向量
 *
 * 覆盖各种输入类型、版本边界和实际应用场景。
 * 每个向量将被编码后通过 jsqr 解码来验证正确性。
 */

export interface TestVector {
  name: string
  input: string
  /** 可选：期望解码出的内容（默认与 input 相同） */
  expected?: string
}

export const TEST_VECTORS: TestVector[] = [
  // === 基础 ASCII ===
  { name: 'single character', input: '0' },
  { name: 'single letter', input: 'A' },
  { name: 'short word', input: 'Hello' },
  { name: 'hello world', input: 'Hello, World!' },

  // === 数字 ===
  { name: 'digits', input: '0123456789' },
  { name: 'phone number', input: '+8613800138000' },

  // === URL ===
  { name: 'simple URL', input: 'https://example.com' },
  { name: 'URL with path', input: 'https://example.com/path/to/page?q=test&lang=en' },

  // === 中文 (UTF-8 多字节) ===
  { name: 'chinese text', input: '你好世界' },
  { name: 'chinese with punctuation', input: '你好，世界！' },

  // === 混合字符 ===
  { name: 'mixed ascii+chinese+digits', input: 'Hello 你好 123' },
  { name: 'mixed with symbols', input: 'Price: ¥99.9 / $12.5' },

  // === 特殊字符 ===
  { name: 'special characters', input: '!@#$%^&*()' },
  { name: 'brackets and quotes', input: '{[(<"hello">)]}' },

  // === 空白字符 ===
  { name: 'with newline', input: 'line1\nline2\nline3' },
  { name: 'with tab', input: 'col1\tcol2\tcol3' },
  { name: 'spaces only', input: '   ' },

  // === Emoji (4 字节 UTF-8) ===
  { name: 'emoji globe', input: 'Hello 🌍' },
  { name: 'multiple emoji', input: '😀🎉🚀✨' },

  // === 版本边界 ===
  // V1 ECC-M 最大 14 字节 → 刚好 14 个 ASCII 字符
  { name: 'V1 max (14 bytes)', input: 'ABCDEFGHIJKLMN' },
  // 15 字节 → 需要 V2
  { name: 'V2 min (15 bytes)', input: 'ABCDEFGHIJKLMNO' },
  // V2 最大 26 字节
  { name: 'V2 max (26 bytes)', input: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },

  // === 长文本 (强制高版本) ===
  {
    name: 'long text (~200 bytes)',
    input:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labor.'
  },

  // === 实际应用场景 ===
  { name: 'WiFi config', input: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword123;;' },
  { name: 'vCard', input: 'BEGIN:VCARD\nVERSION:3.0\nN:Doe;John\nTEL:+1234567890\nEND:VCARD' },
  { name: 'email mailto', input: 'mailto:test@example.com?subject=Hello&body=World' },
  { name: 'geo location', input: 'geo:40.7128,-74.0060' }
]

/**
 * 版本范围边界测试：生成刚好达到指定字节数的输入
 */
export function generateExactBytes(n: number): string {
  let result = ''
  for (let i = 0; i < n; i++) {
    result += String.fromCharCode(65 + (i % 26))
  }
  return result
}
