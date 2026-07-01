import { computed } from 'vue'
import {
  couple,
  parents,
  parentsLine,
  contacts,
  timeline,
  relationship,
  accounts,
  assets,
  cover,
  wedding as weddingMeta,
  share,
  creator,
  getInvitationBySide,
} from '../data/invitation'
import { useSide } from './useSide'
import { useLocale } from './useLocale'

export function useInvitationContent() {
  const { side } = useSide()
  const { locale, t } = useLocale()

  const wedding = computed(() => ({
    ...weddingMeta,
    date: t.value.wedding.date,
    dayNote: t.value.wedding.dayNote,
    time: t.value.wedding.time,
    venue: t.value.wedding.venue,
    hall: weddingMeta.hall,
    address: weddingMeta.address,
    greeting: t.value.wedding.greeting,
    calendar: weddingMeta.calendar,
    dateISO: weddingMeta.dateISO,
    lat: weddingMeta.lat,
    lng: weddingMeta.lng,
    mapImagePath: weddingMeta.mapImagePath,
    transport: weddingMeta.transport,
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

  const localizedContacts = computed(() =>
    contacts.map((contact) => ({
      ...contact,
      role: t.value.contactRoles[contact.roleKey],
    })),
  )

  return {
    couple,
    parents,
    parentsLine,
    contacts: localizedContacts,
    timeline,
    relationship,
    accounts,
    assets,
    cover,
    share,
    creator,
    wedding,
    sideInfo,
    calendarLabel,
    weekdays: computed(() => t.value.weekdays),
    t,
    side,
  }
}
