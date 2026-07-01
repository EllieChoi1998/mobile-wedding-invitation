<template>
  <div
    class="intro-splash-backdrop"
    :class="{ 'intro-splash-backdrop--leaving': leaving }"
    role="presentation"
  >
    <div class="intro-splash" @click="dismiss">
      <CoverSplashBlock variant="fullscreen" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import CoverSplashBlock from './CoverSplashBlock.vue'

const emit = defineEmits(['complete'])

const leaving = ref(false)
const DISPLAY_MS = 2500
const FADE_MS = 800

let displayTimer
let fadeTimer

function dismiss() {
  if (leaving.value) return
  leaving.value = true
  clearTimeout(displayTimer)
  fadeTimer = setTimeout(() => emit('complete'), FADE_MS)
}

onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  displayTimer = setTimeout(dismiss, DISPLAY_MS)
})

onUnmounted(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  clearTimeout(displayTimer)
  clearTimeout(fadeTimer)
})
</script>

<style scoped>
.intro-splash-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  justify-content: center;
  background: var(--color-bg);
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.8s ease;
}

.intro-splash-backdrop--leaving {
  opacity: 0;
  pointer-events: none;
}

.intro-splash {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  height: 100%;
  height: 100dvh;
  flex-shrink: 0;
  overflow: hidden;
  cursor: pointer;
}
</style>
