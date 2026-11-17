<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Copy, Download, Link2, Trash2 } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useHistory } from '@/composables/useHistory'
import type { QRRecord } from '@/lib/history'
import { DEFAULT_QR_OPTIONS, copyPngToClipboard, copyTextToClipboard, downloadPng, type QRRenderOptions } from '@/lib/qr'

const { records, refresh, upsert, remove, clear } = useHistory()
const { t } = useI18n()

const text = ref('')
const options = reactive<QRRenderOptions>({ ...DEFAULT_QR_OPTIONS })
const activeId = ref<string | null>(null)

onMounted(refresh)

const save = useDebounceFn(async () => {
  if (!text.value.trim()) return
  await upsert(text.value, { ...options })
  activeId.value = null
}, 1200)

watch([text, () => ({ ...options })], () => save())

const historyCount = computed(() => records.value.length)

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  const hm = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  if (sameDay) return hm
  const md = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  if (date.getFullYear() === now.getFullYear()) return `${md} ${hm}`
  return `${date.getFullYear()}-${md}`
}

function applyRecord(record: QRRecord): void {
  text.value = record.text
  Object.assign(options, record.options)
  activeId.value = record.id
}

async function onCopyImage(): Promise<void> {
  if (!text.value.trim()) return
  const copied = await copyPngToClipboard(text.value, { ...options })
  if (copied) {
    toast.success(t('tool.toast.imageCopied'))
  } else {
    downloadPng(text.value, { ...options })
    toast.warning(t('tool.toast.copyFallback'))
  }
}

function onDownload(): void {
  if (!text.value.trim()) return
  downloadPng(text.value, { ...options })
}

async function onCopyText(): Promise<void> {
  if (!text.value.trim()) return
  if (await copyTextToClipboard(text.value)) toast.success(t('tool.toast.textCopied'))
}

async function onClear(): Promise<void> {
  if (!historyCount.value) return
  if (!window.confirm(t('tool.history.clearConfirm'))) return
  await clear()
  toast.success(t('tool.toast.cleared'))
}
</script>

<template>
  <div class="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_440px]">
    <div class="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{{ t('tool.preview.title') }}</CardTitle>
          <CardDescription>{{ t('tool.preview.description') }}</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <QRPreview :text="text" :options="options" />
          <div class="flex flex-wrap gap-2">
            <Button @click="onCopyImage">
              <Copy /> {{ t('tool.actions.copyImage') }}
            </Button>
            <Button variant="outline" @click="onDownload">
              <Download /> {{ t('tool.actions.download') }}
            </Button>
            <Button variant="outline" @click="onCopyText">
              <Link2 /> {{ t('tool.actions.copyText') }}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{{ t('tool.editor.title') }}</CardTitle>
          <CardDescription>{{ t('tool.editor.description') }}</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <Textarea
            v-model="text"
            :placeholder="t('tool.editor.placeholder')"
            class="min-h-24 wrap-anywhere font-mono text-sm"
          />
          <QROptionsForm v-model="options" />
        </CardContent>
      </Card>
    </div>

    <Card class="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          {{ t('tool.history.title') }}
          <Badge variant="secondary">{{ historyCount }}</Badge>
        </CardTitle>
        <CardDescription class="flex items-center justify-between">
          <span>{{ t('tool.history.description') }}</span>
          <Button
            variant="ghost"
            size="sm"
            class="h-7 gap-1 px-2 text-muted-foreground"
            :disabled="!historyCount"
            @click="onClear"
          >
            <Trash2 class="size-3.5" /> {{ t('tool.history.clear') }}
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator class="mb-2" />
        <ScrollArea class="h-[min(560px,60vh)] lg:h-[560px] pr-3">
          <TooltipProvider>
            <div v-if="!historyCount" class="flex h-32 items-center justify-center text-sm text-muted-foreground">
              {{ t('tool.history.empty') }}
            </div>
            <ul v-else class="flex flex-col gap-2">
            <Tooltip v-for="record in records" :key="record.id">
              <TooltipTrigger as-child>
                <li
                  class="group flex cursor-pointer flex-col gap-1.5 rounded-lg border p-3 transition-colors hover:bg-accent data-[active=true]:border-primary"
                  :data-active="record.id === activeId"
                  @click="applyRecord(record)"
                >
                  <p class="line-clamp-3 overflow-hidden break-all font-mono text-xs">
                    {{ record.text }}
                  </p>
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] text-muted-foreground">
                      {{ formatTime(record.updatedAt) }}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="size-7 p-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      :aria-label="t('tool.history.deleteRecord')"
                      @click.stop="remove(record.id)"
                    >
                      <Trash2 class="size-3.5" />
                    </Button>
                  </div>
                </li>
              </TooltipTrigger>
              <!-- break-all 在 popper shrink-to-fit 上下文里会产生行尾大片空白，改用 wrap-anywhere -->
              <TooltipContent class="max-w-72 wrap-anywhere font-mono text-xs">
                {{ record.text }}
              </TooltipContent>
            </Tooltip>
          </ul>
          </TooltipProvider>
        </ScrollArea>
      </CardContent>
    </Card>
  </div>
</template>
