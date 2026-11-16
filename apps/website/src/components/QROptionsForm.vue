<script setup lang="ts">
import type { ErrorCorrectionLevel } from 'qrcode-encoder'
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

const options = defineModel<QRRenderOptions>({ required: true })

const ECC_LEVELS: Array<{ value: ErrorCorrectionLevel; label: string; hint: string }> = [
  { value: 'L', label: 'L', hint: '容量最大' },
  { value: 'M', label: 'M', hint: '均衡' },
  { value: 'Q', label: 'Q', hint: '纠错 25%' },
  { value: 'H', label: 'H', hint: '纠错 30%' },
]
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <div class="flex flex-col gap-2">
      <Label class="text-xs text-muted-foreground">纠错级别</Label>
      <Select v-model="options.ecc">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="纠错级别" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="level in ECC_LEVELS" :key="level.value" :value="level.value">
            {{ level.label }} · {{ level.hint }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="flex flex-col gap-2">
      <Label class="flex justify-between text-xs text-muted-foreground">
        模块大小 <span class="text-foreground">{{ options.moduleSize }}px</span>
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
        静默区 <span class="text-foreground">{{ options.quietZone }} 模块</span>
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
