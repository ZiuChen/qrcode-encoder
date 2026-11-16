<script setup lang="ts">
import { computed } from 'vue'
import type { QRRenderOptions } from '@/lib/qr'
import { buildSVG } from '@/lib/qr'

const props = defineProps<{
  text: string
  options: QRRenderOptions
}>()

const svg = computed(() => buildSVG(props.text, props.options))
</script>

<template>
  <div
    class="flex min-h-48 flex items-center justify-center rounded-lg border bg-white p-4 [&_svg]:h-auto [&_svg]:max-h-[420px] [&_svg]:w-full [&_svg]:max-w-[420px]"
  >
    <div v-if="svg" class="flex w-full justify-center" v-html="svg" />
    <p v-else class="text-sm text-neutral-400">输入内容后即时预览</p>
  </div>
</template>
