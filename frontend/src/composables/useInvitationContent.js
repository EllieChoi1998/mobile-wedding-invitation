import { computed } from 'vue'
import { couple, parents, wedding as weddingMeta, getInvitationBySide } from '../data/invitation'
import { useSide } from './useSide'
import { useLocale } from './useLocale'

export function useInvitationContent() {
  const { side } = useSide()
  const { locale, t } = useLocale()

  const wedding = computed(() => ({
    ...weddingMeta.calendar,
    date: t.value.wedding.date,
    dayNote: t.value.wedding.dayNote,
    time: t.value.wedding.time,
    venue: t.value.wedding.venue,
    greeting: t.value.wedding.greeting,
    calendar: weddingMeta.calendar,
    calendarYearSuffix: t.value.wedding.calendarYearSuffix,
    calendarMonthSuffix: t.value.wedding.calendarMonthSuffix,
  }))

  const sideInfo = computed(() => {
    const base = getInvitationBySide(side.value)
    return {
      ...base,
      label: t.value.side[side.value],
      greeting: t.value.wedding.greeting,
      parentInfo: {
        ...base.parentInfo,
        label: t.value.parents[side.value],
      },
    }
  })

  const calendarLabel = computed(() => {
    const { year, month } = weddingMeta.calendar
    if (locale.value === 'en') {
      return new Date(year, month - 1, 1).toLocaleString('en', { month: 'long', year: 'numeric' })
    }
    return `${year}${t.value.wedding.calendarYearSuffix} ${month}${t.value.wedding.calendarMonthSuffix}`
  })

  return {
    couple,
    parents,
    wedding,
    sideInfo,
    calendarLabel,
    weekdays: computed(() => t.value.weekdays),
    t,
  }
}
