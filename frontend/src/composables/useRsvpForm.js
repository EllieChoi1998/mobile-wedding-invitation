import { ref, watch, onUnmounted } from 'vue'
import { submitRsvp } from '../api/rsvp'
import { useLocale } from './useLocale'
import { useSide } from './useSide'

export function useRsvpForm() {
  const { t } = useLocale()
  const { side: pageSide } = useSide()

  const guestName = ref('')
  const rsvpSide = ref('')
  const attending = ref('')
  const submitting = ref(false)
  const error = ref('')
  const success = ref(false)
  const validationMessage = ref('')

  let validationTimer

  watch(
    pageSide,
    (newSide) => {
      rsvpSide.value = newSide
    },
    { immediate: true },
  )

  function clearValidationTimer() {
    if (validationTimer) {
      clearTimeout(validationTimer)
      validationTimer = undefined
    }
  }

  function showValidation(message) {
    validationMessage.value = message
    clearValidationTimer()
    validationTimer = setTimeout(() => {
      validationMessage.value = ''
      validationTimer = undefined
    }, 3000)
  }

  function getValidationMessage() {
    if (!guestName.value.trim()) return t.value.rsvp.validationName
    if (!rsvpSide.value) return t.value.rsvp.validationSide
    if (!attending.value) return t.value.rsvp.validationAttending
    return ''
  }

  async function onSubmit() {
    const validation = getValidationMessage()
    if (validation) {
      showValidation(validation)
      return
    }

    submitting.value = true
    error.value = ''
    success.value = false
    validationMessage.value = ''
    clearValidationTimer()

    try {
      await submitRsvp({
        guestName: guestName.value,
        side: rsvpSide.value,
        attending: attending.value === 'yes',
      })
      success.value = true
      guestName.value = ''
      attending.value = ''
      rsvpSide.value = pageSide.value
    } catch (err) {
      error.value = err.message || t.value.rsvp.error
    } finally {
      submitting.value = false
    }
  }

  onUnmounted(clearValidationTimer)

  return {
    guestName,
    rsvpSide,
    attending,
    submitting,
    error,
    success,
    validationMessage,
    onSubmit,
    t,
  }
}
