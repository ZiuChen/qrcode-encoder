<script setup lang="ts">
import { Check, Languages } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { setLocale, SUPPORTED_LOCALES, type AppLocale } from '@/i18n/index.ts'

const { locale, t } = useI18n()

function onSelect(value: AppLocale): void {
  setLocale(value)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="sm"
        class="gap-1.5 px-2 text-muted-foreground"
        :aria-label="t('language.label')"
      >
        <Languages class="size-4" />
        <span class="text-xs font-medium uppercase">
          {{ locale === 'zh-CN' ? '中' : 'EN' }}
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="item in SUPPORTED_LOCALES"
        :key="item.value"
        class="gap-2"
        @click="onSelect(item.value)"
      >
        <Check v-if="locale === item.value" class="size-4" />
        <span v-else class="size-4" />
        {{ item.label }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
