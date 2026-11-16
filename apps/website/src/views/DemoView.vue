<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ArrowRight } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

const text = ref('https://github.com/ZiuChen/qrcode-encoder')
const options = reactive<QRRenderOptions>({ ...DEFAULT_QR_OPTIONS })

const FEATURES = computed(() => [
  {
    key: 'zeroDep',
    title: t('demo.features.zeroDep.title'),
    description: t('demo.features.zeroDep.description'),
  },
  {
    key: 'renderers',
    title: t('demo.features.renderers.title'),
    description: t('demo.features.renderers.description'),
  },
  {
    key: 'ecc',
    title: t('demo.features.ecc.title'),
    description: t('demo.features.ecc.description'),
  },
  {
    key: 'typescript',
    title: t('demo.features.typescript.title'),
    description: t('demo.features.typescript.description'),
  },
])

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
      <Badge variant="outline" class="font-mono">{{ t('demo.badge') }}</Badge>
      <h1 class="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        QR Code Encoder
      </h1>
      <p class="max-w-xl text-balance text-muted-foreground">
        {{ t('demo.subtitle') }}
      </p>
      <div class="flex gap-3">
        <Button as-child size="lg">
          <RouterLink to="/tool">
            {{ t('demo.openTool') }} <ArrowRight />
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
          <CardTitle>{{ t('demo.playground.title') }}</CardTitle>
          <CardDescription>{{ t('demo.playground.description') }}</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <Textarea v-model="text" class="min-h-20 font-mono text-sm" />
          <QROptionsForm v-model="options" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{{ t('demo.svgOutput.title') }}</CardTitle>
          <CardDescription>{{ t('demo.svgOutput.description') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <QRPreview :text="text" :options="options" />
        </CardContent>
      </Card>
    </section>

    <section>
      <h2 class="mb-6 text-2xl font-semibold tracking-tight">{{ t('demo.featuresTitle') }}</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <Card v-for="feature in FEATURES" :key="feature.key">
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
      <h2 class="mb-6 text-2xl font-semibold tracking-tight">{{ t('demo.quickStart.title') }}</h2>
      <Card>
        <CardContent class="pt-6">
          <pre class="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed"><code>{{ SNIPPET }}</code></pre>
        </CardContent>
      </Card>
      <Separator class="my-8" />
      <p class="text-center text-sm text-muted-foreground">
        {{ t('demo.quickStart.tryTool') }}
        <RouterLink to="/tool" class="font-medium text-foreground underline underline-offset-4">
          {{ t('demo.quickStart.toolLink') }}
        </RouterLink>
      </p>
    </section>
  </div>
</template>
