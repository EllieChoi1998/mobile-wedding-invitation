import { ref } from 'vue'

const visible = ref(false)
const message = ref('')

let dismissTimer

function clearDismissTimer() {
  if (dismissTimer) {
    clearTimeout(dismissTimer)
    dismissTimer = undefined
  }
}

export function useSubmissionClosedToast() {
  function show(nextMessage) {
    message.value = nextMessage
    visible.value = true
    clearDismissTimer()
    dismissTimer = setTimeout(() => {
      visible.value = false
      dismissTimer = undefined
    }, 3000)
  }

  function dismiss() {
    visible.value = false
    clearDismissTimer()
  }

  return {
    visible,
    message,
    show,
    dismiss,
  }
}
