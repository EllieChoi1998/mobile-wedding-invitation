import { computed, ref } from 'vue'

const MIN_SCALE = 1
const MAX_SCALE = 4

export function usePinchZoom() {
  const scale = ref(1)
  const translateX = ref(0)
  const translateY = ref(0)

  let pinchStartDistance = 0
  let pinchStartScale = 1
  let panStartX = 0
  let panStartY = 0
  let panOriginX = 0
  let panOriginY = 0
  let activeTouches = 0

  const isZoomed = computed(() => scale.value > 1.01)

  const transformStyle = computed(() => ({
    transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
    transition: activeTouches === 0 ? 'transform 0.2s ease' : 'none',
  }))

  function resetZoom() {
    scale.value = 1
    translateX.value = 0
    translateY.value = 0
  }

  function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.hypot(dx, dy)
  }

  function onTouchStart(event) {
    activeTouches = event.touches.length

    if (event.touches.length === 2) {
      pinchStartDistance = getDistance(event.touches)
      pinchStartScale = scale.value
    } else if (event.touches.length === 1 && isZoomed.value) {
      panStartX = event.touches[0].clientX
      panStartY = event.touches[0].clientY
      panOriginX = translateX.value
      panOriginY = translateY.value
    }
  }

  function onTouchMove(event) {
    if (event.touches.length === 2) {
      event.preventDefault()
      const distance = getDistance(event.touches)
      const next = pinchStartScale * (distance / pinchStartDistance)
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next))
      if (scale.value <= 1) {
        translateX.value = 0
        translateY.value = 0
      }
    } else if (event.touches.length === 1 && isZoomed.value) {
      event.preventDefault()
      translateX.value = panOriginX + (event.touches[0].clientX - panStartX)
      translateY.value = panOriginY + (event.touches[0].clientY - panStartY)
    }
  }

  function onTouchEnd(event) {
    activeTouches = event.touches.length
    if (scale.value < 1) resetZoom()
    if (scale.value === 1) {
      translateX.value = 0
      translateY.value = 0
    }
  }

  return {
    scale,
    isZoomed,
    transformStyle,
    resetZoom,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
