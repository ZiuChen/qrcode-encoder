<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { QRRenderOptions } from '@/lib/qr'
import { buildSVG } from '@/lib/qr'

const props = defineProps<{
  text: string
  options: QRRenderOptions
}>()

const { t } = useI18n()

const svg = computed(() => buildSVG(props.text, props.options))
</script>

<template>
  <!--
    面板固定白底：二维码依赖前景/背景对比度，深色模式下不可跟随主题，
    否则浅色模块与深色画布会降低可扫性。
  -->
  <div
    class="flex min-h-48 flex items-center justify-center rounded-lg border border-border/60 bg-white p-4 shadow-sm [&_svg]:h-auto [&_svg]:max-h-[420px] [&_svg]:w-full [&_svg]:max-w-[420px]"
  >
    <div v-if="svg" class="flex w-full justify-center" v-html="svg" />
    <p v-else class="text-sm text-neutral-400">{{ t('tool.preview.empty') }}</p>
  </div>
</template>
