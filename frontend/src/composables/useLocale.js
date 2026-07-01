import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSide } from './useSide'
import ko from '../data/locales/ko'
import en from '../data/locales/en'

const LOCALES = { ko, en }

function normalizeLang(rawLang) {
  if (typeof rawLang === 'string' && rawLang.toLowerCase().startsWith('en')) {
    return 'en'
  }
  return 'ko'
}

export function useLocale() {
  const route = useRoute()
  const { side } = useSide()

  const locale = computed(() => normalizeLang(route.query.lang))

  const t = computed(() => LOCALES[locale.value])
  const isEnglish = computed(() => locale.value === 'en')

  function queryForLocale(targetLocale) {
    const query = { side: side.value }
    if (targetLocale === 'en') {
      query.lang = 'en'
    }
    return query
  }

  watch(
    locale,
    (value) => {
      document.documentElement.lang = value
      document.title = LOCALES[value].pageTitle
    },
    { immediate: true },
  )

  return {
    locale,
    t,
    isEnglish,
    queryForLocale,
  }
}
