<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ErrorCorrectionLevel } from 'qrcode-encoder'
import { ChevronDown, Settings2 } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import type { QRRenderOptions } from '@/lib/qr'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

const { t } = useI18n()

const options = defineModel<QRRenderOptions>({ required: true })

/** 高级参数默认隐藏，点击按钮切换显隐 */
const expanded = ref(false)

const ECC_LEVELS = computed<Array<{ value: ErrorCorrectionLevel; key: 'l' | 'm' | 'q' | 'h' }>>(() => [
  { value: 'L', key: 'l' },
  { value: 'M', key: 'm' },
  { value: 'Q', key: 'q' },
  { value: 'H', key: 'h' },
])
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button
      variant="ghost"
      size="sm"
      class="h-7 w-fit gap-1.5 px-2 text-xs text-muted-foreground"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      <Settings2 class="size-3.5" />
      {{ t('tool.options.advanced') }}
      <ChevronDown class="size-3.5 transition-transform" :class="expanded ? 'rotate-180' : ''" />
    </Button>

    <div v-if="expanded" class="grid gap-4 sm:grid-cols-3">
    <div class="flex flex-col gap-2">
      <Label class="text-xs text-muted-foreground">{{ t('tool.options.ecc') }}</Label>
      <Select v-model="options.ecc">
        <SelectTrigger class="w-full">
          <SelectValue :placeholder="t('tool.options.ecc')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="level in ECC_LEVELS" :key="level.value" :value="level.value">
            {{ t(`tool.options.eccLevels.${level.key}`) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="flex flex-col gap-2">
      <Label class="flex justify-between text-xs text-muted-foreground">
        {{ t('tool.options.moduleSize') }}
        <span class="text-foreground">{{ options.moduleSize }}px</span>
      </Label>
      <Slider
        :model-value="[options.moduleSize]"
        :min="2"
        :max="16"
        :step="1"
        @update:model-value="options.moduleSize = $event?.[0] ?? options.moduleSize"
      />
    </div>

    <div class="flex flex-col gap-2">
      <Label class="flex justify-between text-xs text-muted-foreground">
        {{ t('tool.options.quietZone') }}
        <span class="text-foreground">{{ options.quietZone }} {{ t('tool.options.modules') }}</span>
      </Label>
      <Slider
        :model-value="[options.quietZone]"
        :min="0"
        :max="8"
        :step="1"
        @update:model-value="options.quietZone = $event?.[0] ?? options.quietZone"
      />
    </div>
    </div>
  </div>
</template>
