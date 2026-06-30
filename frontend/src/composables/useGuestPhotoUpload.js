import { computed, onMounted, ref } from 'vue'
import { getPhotoUploadStatus } from '../api/photos'

export function useGuestPhotoUpload() {
  const photoUploadOpen = ref(false)
  const statusLoading = ref(true)
  const statusError = ref('')

  const isUploadOpen = computed(() => photoUploadOpen.value)

  async function refreshUploadStatus() {
    statusLoading.value = true
    statusError.value = ''
    try {
      const data = await getPhotoUploadStatus()
      photoUploadOpen.value = data.photoUploadOpen === true
    } catch (err) {
      statusError.value = err.message || 'Failed to load upload status'
      photoUploadOpen.value = false
    } finally {
      statusLoading.value = false
    }
  }

  onMounted(refreshUploadStatus)

  return { isUploadOpen, statusLoading, statusError, refreshUploadStatus }
}
