<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ArrowRight } from '@lucide/vue'
import GithubIcon from '@/components/icons/GithubIcon.vue'
import QROptionsForm from '@/components/QROptionsForm.vue'
import QRPreview from '@/components/QRPreview.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { DEFAULT_QR_OPTIONS, type QRRenderOptions } from '@/lib/qr'

const text = ref('https://github.com/ZiuChen/qrcode-encoder')
const options = reactive<QRRenderOptions>({ ...DEFAULT_QR_OPTIONS })

const FEATURES = [
  {
    title: '零运行时依赖',
    description: '编码、SVG / Canvas / PNG 渲染全部纯算法实现，无任何 runtime 依赖，支持浏览器、Node.js、微信小程序等环境。',
  },
  {
    title: '四种渲染器',
    description: 'SVG（矢量）、Canvas（跨平台位图）、PNG（纯算法编码 Uint8Array）、Terminal（终端输出）开箱即用。',
  },
  {
    title: '可调纠错级别',
    description: '支持 L / M / Q / H 四级纠错，可指定最小版本，编码结果对相同参数完全确定，便于复现。',
  },
  {
    title: 'TypeScript 编写',
    description: '完整类型定义与子路径导出（encoder / renderers），tree-shaking 友好，IIFE 构建可直接用于 script 标签。',
  },
]

const SNIPPET = `import { encode, toSVG, toPngDataURL } from 'qrcode-encoder'

const modules = encode('https://example.com', {
  errorCorrection: 'H',
})

const svg = toSVG(modules, { moduleSize: 10, quietZone: 4 })
const dataUrl = toPngDataURL(modules, { moduleSize: 4 })`
</script>

<template>
  <div class="flex flex-col gap-16">
    <section class="flex flex-col items-center gap-6 pt-8 text-center">
      <Badge variant="outline" class="font-mono">v1.3.0 · zero-dependency</Badge>
      <h1 class="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        QR Code Encoder
      </h1>
      <p class="max-w-xl text-balance text-muted-foreground">
        零依赖的二维码编码器，内置 SVG / Canvas / PNG / Terminal 渲染器，
        也附带一个带历史记录的在线二维码工具。
      </p>
      <div class="flex gap-3">
        <Button as-child size="lg">
          <RouterLink to="/tool">
            打开二维码工具 <ArrowRight />
          </RouterLink>
        </Button>
        <Button as-child size="lg" variant="outline">
          <a href="https://github.com/ZiuChen/qrcode-encoder" target="_blank" rel="noreferrer">
            <GithubIcon /> GitHub
          </a>
        </Button>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Live Playground</CardTitle>
          <CardDescription>修改内容与参数，右侧即时渲染</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <Textarea v-model="text" class="min-h-20 font-mono text-sm" />
          <QROptionsForm v-model="options" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>SVG 输出</CardTitle>
          <CardDescription>toSVG(modules, options) 的渲染结果</CardDescription>
        </CardHeader>
        <CardContent>
          <QRPreview :text="text" :options="options" />
        </CardContent>
      </Card>
    </section>

    <section>
      <h2 class="mb-6 text-2xl font-semibold tracking-tight">特性</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <Card v-for="feature in FEATURES" :key="feature.title">
          <CardHeader>
            <CardTitle class="text-base">{{ feature.title }}</CardTitle>
          </CardHeader>
          <CardContent class="text-sm text-muted-foreground">
            {{ feature.description }}
          </CardContent>
        </Card>
      </div>
    </section>

    <section>
      <h2 class="mb-6 text-2xl font-semibold tracking-tight">快速上手</h2>
      <Card>
        <CardContent class="pt-6">
          <pre class="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed"><code>{{ SNIPPET }}</code></pre>
        </CardContent>
      </Card>
      <Separator class="my-8" />
      <p class="text-center text-sm text-muted-foreground">
        需要生成带历史记录的二维码？试试
        <RouterLink to="/tool" class="font-medium text-foreground underline underline-offset-4">
          二维码工具
        </RouterLink>
      </p>
    </section>
  </div>
</template>
