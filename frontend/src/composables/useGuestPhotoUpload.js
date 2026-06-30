import { computed } from 'vue'
import { guestPhotoUpload, wedding } from '../data/invitation'

function getWeddingDayOpenTime() {
  const [datePart] = wedding.dateISO.split('T')
  return new Date(`${datePart}T00:00:00+09:00`)
}

export function useGuestPhotoUpload() {
  const isTestMode = computed(() => guestPhotoUpload.allowBeforeWeddingDay)

  const isUploadOpen = computed(() => {
    if (guestPhotoUpload.allowBeforeWeddingDay) return true
    return Date.now() >= getWeddingDayOpenTime().getTime()
  })

  return { isUploadOpen, isTestMode }
}
