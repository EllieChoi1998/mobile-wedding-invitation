<template>
  <div
    class="intro-splash-backdrop"
    :class="{ 'intro-splash-backdrop--leaving': leaving }"
    role="presentation"
  >
    <div class="intro-splash" @click="dismiss">
      <div class="intro-splash__image-wrap">
        <img v-if="splashImage" :src="splashImage" alt="" class="intro-splash__image" />
        <div v-else class="intro-splash__image-placeholder" />
      </div>

      <div class="intro-splash__text">
        <p class="intro-splash__names">
          {{ couple.groom.fullName }}
          <span class="intro-splash__heart">♥</span>
          {{ couple.bride.fullName }}
        </p>
        <p class="intro-splash__datetime">
          {{ wedding.date }}({{ wedding.dayNote }}) {{ wedding.time }}
        </p>
        <p class="intro-splash__venue">{{ wedding.venue }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { couple, wedding } from '../data/invitation'

const splashModules = import.meta.glob('../assets/splash/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
})

const splashImage = Object.values(splashModules)[0] ?? null

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

.intro-splash__image-wrap {
  flex: 7;
  min-height: 0;
  overflow: hidden;
  background: var(--color-accent);
}

.intro-splash__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.intro-splash__image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, var(--color-accent) 0%, rgba(244, 167, 185, 0.3) 100%);
}

.intro-splash__text {
  flex: 3;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.35rem;
  padding: 0.875rem 1.25rem 1.25rem;
  background: #fff;
  text-align: center;
}

.intro-splash__names {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.5;
  color: #333;
  letter-spacing: 0.02em;
}

.intro-splash__heart {
  margin: 0 0.35rem;
  font-size: 0.875rem;
  color: var(--color-primary);
}

.intro-splash__datetime {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-text);
}

.intro-splash__venue {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-text-muted);
}
</style>
