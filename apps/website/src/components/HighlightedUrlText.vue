<script setup lang="ts">
import { computed } from 'vue'

type TokenKind = 'plain' | 'protocol' | 'host' | 'path' | 'query' | 'hash'

interface Token {
  kind: TokenKind
  value: string
}

const props = defineProps<{ text: string }>()

/** 匹配整段 URL：带协议或 www. 开头，排除空白、引号、尖括号与常见中文标点 */
const URL_PATTERN = /(?:[a-z][a-z0-9+.-]*:\/\/|www\.)[^\s"'<>，。；：！？、（）【】「」《》]+/gi

const TOKEN_CLASS: Record<TokenKind, string> = {
  plain: '',
  protocol: 'text-emerald-600 dark:text-emerald-400',
  host: 'text-pink-600 dark:text-pink-400',
  path: 'text-sky-600 dark:text-sky-400',
  query: 'text-amber-600 dark:text-amber-400',
  hash: 'text-violet-600 dark:text-violet-400',
}

const SEGMENTS: Array<[TokenKind, RegExp]> = [
  ['path', /^[^?#]+/],
  ['query', /^\?[^#]*/],
  ['hash', /^#.*/],
]

/** 把单个 URL 按 协议 / 域名 / path / query / hash 切开 */
function splitUrl(url: string): Token[] {
  const tokens: Token[] = []
  let rest = url

  const push = (kind: TokenKind, value: string): void => {
    if (value) tokens.push({ kind, value })
  }

  const protocol = rest.match(/^[a-z][a-z0-9+.-]*:\/\//i)
  if (protocol) {
    push('protocol', protocol[0])
    rest = rest.slice(protocol[0].length)
  }

  const host = rest.match(/^[^/?#]*/)
  if (host) {
    push('host', host[0])
    rest = rest.slice(host[0].length)
  }

  for (const [kind, pattern] of SEGMENTS) {
    const segment = rest.match(pattern)
    if (!segment) continue
    push(kind, segment[0])
    rest = rest.slice(segment[0].length)
  }

  push('plain', rest)
  return tokens
}

const tokens = computed<Token[]>(() => {
  const text = props.text
  const result: Token[] = []
  let lastIndex = 0

  for (const match of text.matchAll(URL_PATTERN)) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      result.push({ kind: 'plain', value: text.slice(lastIndex, index) })
    }
    result.push(...splitUrl(match[0]))
    lastIndex = index + match[0].length
  }

  if (lastIndex < text.length) {
    result.push({ kind: 'plain', value: text.slice(lastIndex) })
  }

  return result
})
</script>

<template>
  <span>
    <span v-for="(token, index) in tokens" :key="index" :class="TOKEN_CLASS[token.kind]">{{
      token.value
    }}</span>
  </span>
</template>
