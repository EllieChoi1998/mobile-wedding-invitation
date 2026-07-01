<template>
  <div class="cover-splash" :class="`cover-splash--${variant}`">
    <div class="cover-splash__image-wrap">
      <img v-if="splashImage" :src="splashImage" alt="" class="cover-splash__image" />
      <div v-else class="cover-splash__image-placeholder" />
    </div>

    <div class="cover-splash__text">
      <p class="cover-splash__names">
        {{ couple.groom.fullName }}
        <span class="cover-splash__heart">♥</span>
        {{ couple.bride.fullName }}
      </p>
      <p class="cover-splash__datetime">
        {{ wedding.date }}({{ wedding.dayNote }}) {{ wedding.time }}
      </p>
      <p class="cover-splash__venue">{{ wedding.venue }}</p>
    </div>
  </div>
</template>

<script setup>
import { useInvitationContent } from '../composables/useInvitationContent'
import { useSplashImage } from '../composables/useSplashImage'

defineProps({
  variant: {
    type: String,
    default: 'section',
    validator: (value) => ['fullscreen', 'section'].includes(value),
  },
})

const splashImage = useSplashImage()
const { couple, wedding } = useInvitationContent()
</script>

<style scoped>
.cover-splash {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cover-splash--fullscreen {
  width: 100%;
  height: 100%;
}

.cover-splash--section {
  width: 100%;
}

.cover-splash__image-wrap {
  box-sizing: border-box;
  padding: 0 var(--splash-side-gap, 5%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  background: var(--color-accent);
  --splash-side-gap: 5%;
  --splash-image-height: 100%;
}

.cover-splash--fullscreen .cover-splash__image-wrap {
  flex: 0 0 82%;
  min-height: 0;
}

.cover-splash--section .cover-splash__image-wrap {
  width: 100%;
  aspect-ratio: 3 / 3.65;
  max-height: min(72vh, 520px);
}

.cover-splash__image {
  display: block;
  width: 100%;
  height: var(--splash-image-height);
  object-fit: cover;
  object-position: center bottom;
}

.cover-splash--section .cover-splash__image {
  height: 100%;
}

.cover-splash__image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, var(--color-accent) 0%, rgba(var(--color-primary-rgb), 0.3) 100%);
}

.cover-splash__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.35rem;
  padding: 0.625rem 1.25rem 0.875rem;
  background: #fff;
  text-align: center;
}

.cover-splash--fullscreen .cover-splash__text {
  flex: 1 1 0;
  min-height: 0;
}

.cover-splash__names {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.5;
  color: #333;
  letter-spacing: 0.02em;
}

.cover-splash__heart {
  margin: 0 0.35rem;
  font-size: 0.875rem;
  color: var(--color-primary);
}

.cover-splash__datetime {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-event-datetime);
  font-weight: 600;
  line-height: 1.5;
  color: var(--color-event-datetime);
  letter-spacing: 0.01em;
}

.cover-splash__venue {
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-event-venue);
  font-weight: 500;
  line-height: 1.5;
  color: var(--color-event-venue);
}
</style>
