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
  illustrator,
  getInvitationBySide,
} from '../data/invitation'
import { useSide } from './useSide'
import { useLocale } from './useLocale'

const ACCOUNT_ROLE_KEYS = {
  groomSide: ['groom', 'groomFather', 'groomMother'],
  brideSide: ['bride', 'brideFather', 'brideMother'],
}

export function useInvitationContent() {
  const { side } = useSide()
  const { locale, t, isEnglish } = useLocale()

  const wedding = computed(() => ({
    ...weddingMeta,
    date: t.value.wedding.date,
    dayNote: t.value.wedding.dayNote,
    time: t.value.wedding.time,
    venue: weddingMeta.venue,
    hall: isEnglish.value ? t.value.venue?.hall ?? weddingMeta.hall : weddingMeta.hall,
    venueEnglish: isEnglish.value ? t.value.venue?.venueEn ?? '' : '',
    address: weddingMeta.address,
    addressEnglish: isEnglish.value ? t.value.venue?.addressEn ?? '' : '',
    addressCopy: weddingMeta.addressCopy,
    addressCopyEnglish: isEnglish.value ? t.value.venue?.addressCopyEn ?? '' : '',
    greeting: t.value.wedding.greeting,
    calendar: weddingMeta.calendar,
    dateISO: weddingMeta.dateISO,
    lat: weddingMeta.lat,
    lng: weddingMeta.lng,
    mapImagePath: weddingMeta.mapImagePath,
    transport: isEnglish.value ? t.value.wedding.transport : weddingMeta.transport,
    calendarYearSuffix: t.value.wedding.calendarYearSuffix,
    calendarMonthSuffix: t.value.wedding.calendarMonthSuffix,
  }))

  const localizedCouple = computed(() => ({
    groom: {
      ...couple.groom,
      englishName: isEnglish.value ? t.value.names?.groom ?? '' : '',
      birthDate:
        isEnglish.value && t.value.couple?.groom?.birthDate
          ? t.value.couple.groom.birthDate
          : couple.groom.birthDate,
      tags:
        isEnglish.value && t.value.couple?.groom?.tags
          ? t.value.couple.groom.tags
          : couple.groom.tags,
    },
    bride: {
      ...couple.bride,
      englishName: isEnglish.value ? t.value.names?.bride ?? '' : '',
      birthDate:
        isEnglish.value && t.value.couple?.bride?.birthDate
          ? t.value.couple.bride.birthDate
          : couple.bride.birthDate,
      tags:
        isEnglish.value && t.value.couple?.bride?.tags
          ? t.value.couple.bride.tags
          : couple.bride.tags,
    },
  }))

  const localizedParentsLine = computed(() => ({
    groom: {
      ...parentsLine.groom,
      fatherEnglish: isEnglish.value ? t.value.names?.groomFather ?? '' : '',
      motherEnglish: isEnglish.value ? t.value.names?.groomMother ?? '' : '',
    },
    bride: {
      ...parentsLine.bride,
      fatherEnglish: isEnglish.value ? t.value.names?.brideFather ?? '' : '',
      motherEnglish: isEnglish.value ? t.value.names?.brideMother ?? '' : '',
    },
  }))

  const localizedTimeline = computed(() =>
    isEnglish.value && t.value.timeline.items ? t.value.timeline.items : timeline,
  )

  const localizedAccounts = computed(() => ({
    groomSide: accounts.groomSide.map((item, index) => ({
      ...item,
      label: t.value.account.roleLabels?.[ACCOUNT_ROLE_KEYS.groomSide[index]] ?? item.label,
      englishName: isEnglish.value ? t.value.names?.[ACCOUNT_ROLE_KEYS.groomSide[index]] ?? '' : '',
    })),
    brideSide: accounts.brideSide.map((item, index) => ({
      ...item,
      label: t.value.account.roleLabels?.[ACCOUNT_ROLE_KEYS.brideSide[index]] ?? item.label,
      englishName: isEnglish.value ? t.value.names?.[ACCOUNT_ROLE_KEYS.brideSide[index]] ?? '' : '',
    })),
  }))

  const localizedShare = computed(() => ({
    ...share,
    defaultMessage: t.value.share?.defaultMessage ?? share.defaultMessage,
    kakaoButton: t.value.share?.kakaoButton ?? '청첩장 보기',
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
      englishName: isEnglish.value ? t.value.names?.[contact.roleKey] ?? '' : '',
    })),
  )

  return {
    couple: localizedCouple,
    parents,
    parentsLine: localizedParentsLine,
    contacts: localizedContacts,
    timeline: localizedTimeline,
    relationship,
    accounts: localizedAccounts,
    assets,
    cover,
    share: localizedShare,
    creator,
    illustrator,
    wedding,
    sideInfo,
    calendarLabel,
    weekdays: computed(() => t.value.weekdays),
    t,
    side,
    locale,
    isEnglish,
  }
}
