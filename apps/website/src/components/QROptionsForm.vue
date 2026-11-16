<script setup lang="ts">
import { computed } from 'vue'
import type { ErrorCorrectionLevel } from 'qrcode-encoder'
import { useI18n } from 'vue-i18n'
import type { QRRenderOptions } from '@/lib/qr'
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

const ECC_LEVELS = computed<Array<{ value: ErrorCorrectionLevel; key: 'l' | 'm' | 'q' | 'h' }>>(() => [
  { value: 'L', key: 'l' },
  { value: 'M', key: 'm' },
  { value: 'Q', key: 'q' },
  { value: 'H', key: 'h' },
])
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3">
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
</template>
