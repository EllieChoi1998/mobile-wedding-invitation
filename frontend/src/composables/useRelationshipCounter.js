import { onMounted, onUnmounted, ref } from 'vue'

function computeElapsed(startISO) {
  const start = new Date(startISO).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - start)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds }
}

export function useRelationshipCounter(startISO) {
  const elapsed = ref(computeElapsed(startISO))
  let timer

  onMounted(() => {
    timer = setInterval(() => {
      elapsed.value = computeElapsed(startISO)
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return elapsed
}
