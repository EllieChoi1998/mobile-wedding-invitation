import { computed, onMounted, ref } from 'vue'
import { getAppStatus } from '../api/appStatus'

export function useAppStatus() {
  const photoUploadOpen = ref(false)
  const guestbookOpen = ref(true)
  const rsvpOpen = ref(true)
  const statusLoading = ref(true)
  const statusError = ref('')

  const isUploadOpen = computed(() => photoUploadOpen.value)
  const isGuestbookOpen = computed(() => guestbookOpen.value)
  const isRsvpOpen = computed(() => rsvpOpen.value)

  async function refreshAppStatus() {
    statusLoading.value = true
    statusError.value = ''
    try {
      const data = await getAppStatus()
      photoUploadOpen.value = data.photoUploadOpen === true
      guestbookOpen.value = data.guestbookOpen !== false
      rsvpOpen.value = data.rsvpOpen !== false
    } catch (err) {
      statusError.value = err.message || 'Failed to load app status'
      photoUploadOpen.value = false
      guestbookOpen.value = true
      rsvpOpen.value = true
    } finally {
      statusLoading.value = false
    }
  }

  onMounted(refreshAppStatus)

  return {
    isUploadOpen,
    isGuestbookOpen,
    isRsvpOpen,
    statusLoading,
    statusError,
    refreshAppStatus,
  }
}

/** @deprecated Use useAppStatus */
export function useGuestPhotoUpload() {
  const status = useAppStatus()
  return {
    isUploadOpen: status.isUploadOpen,
    statusLoading: status.statusLoading,
    statusError: status.statusError,
    refreshUploadStatus: status.refreshAppStatus,
  }
}
