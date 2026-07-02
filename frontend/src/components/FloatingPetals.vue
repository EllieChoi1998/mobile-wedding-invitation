<template>
  <div class="floating-petals" aria-hidden="true">
    <img
      v-for="(petal, index) in layout"
      :key="index"
      class="floating-petals__item"
      :src="petalSrc"
      alt=""
      :style="petalStyle(petal)"
    />
  </div>
</template>

<script setup>
import petalSrc from '../assets/patterns/꽃잎1.png'
import { rpx } from '../utils/responsiveLayout'

const props = defineProps({
  section: {
    type: String,
    required: true,
  },
})

const PETAL_SCALE = 2

const PETAL_LAYOUTS = {
  'wedding-day': [
    { top: 'calc(14% - 100px)', left: '5%', width: '2.25rem', rotate: -18, opacity: 0.55 },
    { top: 'calc(42% - 250px)', right: '3%', width: '1.875rem', rotate: 32, opacity: 0.48 },
    { top: 'calc(68% - 350px)', left: '10%', width: '2rem', rotate: 14, opacity: 0.52 },
    { top: 'calc(88% - 400px)', right: '8%', width: '1.625rem', rotate: -24, opacity: 0.42 },
  ],
  gallery: [
    { top: 'calc(5.25rem - 60px)', left: '6%', width: '2rem', rotate: 0, flipY: true, opacity: 0.55 },
    { top: '4.75rem', left: '50%', width: '2rem', rotate: 0, flipY: true, sizeScale: 2, centerX: true, opacity: 0.55 },
    { top: 'calc(5.25rem - 70px)', left: 'calc(72% + 20px)', width: '2rem', rotate: 0, opacity: 0.55 },
  ],
  information: [
    { top: 'calc(16% - 40px)', left: 'calc(7% + 20px)', width: '1.875rem', rotate: 28, opacity: 0.48 },
    { top: 'calc(38% + 30px)', right: 'calc(6% - 30px)', width: '2.25rem', rotate: -16, opacity: 0.52 },
    { top: '64%', left: '4%', width: '1.625rem', rotate: -22, opacity: 0.44 },
    { top: '90%', right: '9%', width: '2rem', rotate: 10, opacity: 0.5 },
  ],
  'guest-gallery': [
    { top: '12%', right: '4%', width: '2.125rem', rotate: -14, opacity: 0.5 },
    { top: '45%', left: '6%', width: '1.75rem', rotate: 26, opacity: 0.46 },
    { top: '70%', right: '7%', width: '2rem', rotate: -28, opacity: 0.52 },
    { top: '92%', left: '11%', width: '1.5rem', rotate: 8, opacity: 0.42 },
  ],
  ending: [
    { top: '8%', left: '5%', width: '1.875rem', rotate: 20, opacity: 0.45 },
    { top: '28%', right: '4%', width: '2rem', rotate: -18, opacity: 0.5 },
    { top: '55%', left: '9%', width: '1.625rem', rotate: -26, opacity: 0.42 },
    { top: '78%', right: '6%', width: '2.125rem', rotate: 15, opacity: 0.48 },
  ],
}

const layout = PETAL_LAYOUTS[props.section] ?? PETAL_LAYOUTS['wedding-day']

function petalStyle(petal) {
  const widthValue = parseFloat(petal.width)
  const unit = petal.width.slice(String(widthValue).length)
  const transforms = []

  if (petal.centerX) transforms.unshift('translateX(-50%)')
  if (petal.flipY) transforms.push('scaleX(-1)')
  transforms.push(`rotate(${petal.rotate ?? 0}deg)`)

  const sizeScale = petal.sizeScale ?? 1

  return {
    top: rpx(petal.top),
    left: rpx(petal.left),
    right: rpx(petal.right),
    width: `calc(${widthValue * PETAL_SCALE * sizeScale}rem * var(--inv-ratio))`,
    transform: transforms.join(' '),
    opacity: petal.opacity,
  }
}
</script>

<style scoped>
.floating-petals {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-petals__item {
  position: absolute;
}
</style>
