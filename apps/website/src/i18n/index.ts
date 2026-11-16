import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import zhCN from '@/locales/zh-CN.json'

export const LOCALE_STORAGE_KEY = 'qrcode-encoder-locale'
export type AppLocale = 'en' | 'zh-CN'

export const SUPPORTED_LOCALES: Array<{ value: AppLocale; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'zh-CN', label: '简体中文' },
]

/** 默认英语；仅当用户手动切换过（localStorage 有记录）才使用其选择 */
function detectLocale(): AppLocale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored === 'en' || stored === 'zh-CN') return stored
  return 'en'
}

const initialLocale = detectLocale()
document.documentElement.lang = initialLocale

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN,
  },
})

export function setLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  document.documentElement.lang = locale
}
