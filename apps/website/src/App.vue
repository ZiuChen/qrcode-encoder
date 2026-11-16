<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GithubIcon from '@/components/icons/GithubIcon.vue'
import LanguageDropdown from '@/components/LanguageDropdown.vue'
import { Toaster } from '@/components/ui/sonner'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-background font-sans text-foreground antialiased">
    <header class="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div class="flex items-center gap-6">
          <RouterLink to="/" class="flex items-center gap-2 font-semibold tracking-tight">
            <span class="inline-block size-5 rounded-[4px] bg-foreground" />
            QRCode Encoder
          </RouterLink>
          <nav class="flex items-center gap-1 text-sm">
            <RouterLink
              to="/"
              class="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              exact-active-class="!bg-accent !text-foreground"
            >
              {{ t('nav.demo') }}
            </RouterLink>
            <RouterLink
              to="/tool"
              class="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              active-class="!bg-accent !text-foreground"
            >
              {{ t('nav.tool') }}
            </RouterLink>
          </nav>
        </div>
        <div class="flex items-center gap-1">
          <LanguageDropdown />
          <a
          href="https://github.com/ZiuChen/qrcode-encoder"
          target="_blank"
          rel="noreferrer"
          class="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="GitHub"
        >
          <GithubIcon class="size-4" />
        </a>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8">
      <RouterView />
    </main>

    <footer class="mx-auto max-w-6xl px-4 pb-8 text-center text-xs text-muted-foreground">
      {{ t('footer.tagline') }} ·
      <a
        href="https://www.npmjs.com/package/qrcode-encoder"
        target="_blank"
        rel="noreferrer"
        class="underline underline-offset-2 hover:text-foreground"
      >
        npm
      </a>
      · {{ t('footer.license') }}
    </footer>

    <Toaster theme="system" />
  </div>
</template>
