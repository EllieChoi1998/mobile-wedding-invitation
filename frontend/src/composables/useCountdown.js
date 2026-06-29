import { onMounted, onUnmounted, ref } from 'vue'

function computeRemaining(targetISO) {
  const target = new Date(targetISO).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  const isPast = diff === 0 && now >= target

  return { days, hours, minutes, seconds, isPast }
}

export function useCountdown(targetISO) {
  const remaining = ref(computeRemaining(targetISO))
  let timer

  onMounted(() => {
    timer = setInterval(() => {
      remaining.value = computeRemaining(targetISO)
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return remaining
}
