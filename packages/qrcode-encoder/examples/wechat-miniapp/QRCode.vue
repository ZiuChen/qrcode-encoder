<!--
  微信小程序 QR Code Vue 组件

  用法：
  ```vue
  <QRCode text="https://example.com" :size="200" />
  ```

  注意：实际使用时需将 import 路径改为正确的包路径。
-->
<template>
  <div class="qrcode-view" @tap="onTap">
    <image
      v-if="imageUrl"
      class="qrcode-image"
      :src="imageUrl"
      mode="aspectFit"
      :show-menu-by-longpress="showMenuByLongpress"
      @load="emit('load')"
      @error="onImageError"
    />

    <canvas
      v-if="canvasVisible"
      type="2d"
      :id="canvasId"
      class="offscreen-canvas"
      :style="{ width: size + 'px', height: size + 'px' }"
    />
  </div>
</template>

<script lang="ts">
export default {
  options: {
    virtualHost: true
  }
}
</script>

<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'
import { drawQrcode } from './qrcode-render'

let uid = 0

const props = withDefaults(
  defineProps<{
    /** 二维码内容 */
    text: string
    /** Canvas 像素尺寸 */
    size?: number
    /** 边距（静默区） */
    padding?: number
    /** 前景色 */
    foreground?: string
    /** 背景色 */
    background?: string
    /** 是否输出透明背景 */
    transparent?: boolean
    /** 中心 Logo 图片路径 */
    logo?: string
    /** Logo 显示尺寸 */
    logoSize?: number
    /** 长按是否显示菜单 */
    showMenuByLongpress?: boolean
  }>(),
  {
    size: 200,
    foreground: '#000000',
    background: '#ffffff',
    transparent: false,
    logo: '',
    showMenuByLongpress: false
  }
)

const emit = defineEmits<{
  (e: 'success', tempFilePath: string): void
  (e: 'error', err: any): void
  (e: 'tap', imageUrl: string): void
  (e: 'load'): void
  (e: 'image-error'): void
}>()

const imageUrl = ref('')
const canvasVisible = ref(false)
const canvasId = `qrcode-${++uid}`
const instance = getCurrentInstance()

const render = () => {
  if (!props.text) return

  canvasVisible.value = true

  setTimeout(() => {
    drawQrcode({
      canvasId,
      text: props.text,
      size: props.size,
      padding: props.padding,
      foreground: props.foreground,
      background: props.background,
      transparent: props.transparent,
      logo: props.logo || undefined,
      logoSize: props.logoSize,
      component: instance?.proxy,
      onSuccess: (tempFilePath) => {
        imageUrl.value = tempFilePath
        canvasVisible.value = false
        emit('success', tempFilePath)
      },
      onError: (err) => {
        canvasVisible.value = false
        emit('error', err)
      }
    })
  }, 100)
}

const onTap = () => {
  if (imageUrl.value) {
    emit('tap', imageUrl.value)
  }
}

const onImageError = () => {
  emit('image-error')
}

watch(
  () => [
    props.text,
    props.foreground,
    props.background,
    props.transparent,
    props.logo,
    props.logoSize
  ],
  () => {
    if (props.text) render()
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.qrcode-view {
  width: 100%;
  height: 100%;
}

.qrcode-image {
  width: 100%;
  height: 100%;
}

.offscreen-canvas {
  position: fixed;
  left: -9999px;
  top: -9999px;
}
</style>
