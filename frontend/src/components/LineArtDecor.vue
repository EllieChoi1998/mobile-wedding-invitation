<template>
  <img
    class="line-art-decor"
    :class="`line-art-decor--${variant}`"
    :src="lineArtSrc"
    alt=""
    aria-hidden="true"
  />
</template>

<script setup>
import lineArtSrc from '../assets/patterns/라인아트.svg'

defineProps({
  variant: {
    type: String,
    required: true,
    validator: (value) => ['cover-bottom-left', 'ending-center'].includes(value),
  },
})
</script>

<style scoped>
.line-art-decor {
  pointer-events: none;
}

.line-art-decor--cover-bottom-left {
  position: absolute;
  bottom: 0.5rem;
  left: calc(-123px * var(--inv-ratio));
  z-index: 10000;
  width: calc(49.5rem * var(--inv-ratio));
  max-width: 100%;
  transform: scale(1.1);
  transform-origin: bottom left;
  opacity: 0.85;
}

.line-art-decor--ending-center {
  position: absolute;
  bottom: calc(0.5rem - 50px * var(--inv-ratio));
  left: calc(50% - 20px * var(--inv-ratio));
  transform: translateX(-50%) scale(2.25);
  transform-origin: bottom center;
  width: calc(54rem * var(--inv-ratio));
  max-width: 90%;
  opacity: 0.85;
  z-index: 0;
}
</style>
