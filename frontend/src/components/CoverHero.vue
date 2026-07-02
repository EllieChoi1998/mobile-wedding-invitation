<template>
  <header class="cover-hero section section--accent">
    <SectionCornerPatterns />
    <LineArtDecor variant="cover-bottom-left" />
    <CoverSplashBlock variant="section" />

    <div class="cover-hero__content">
      <p class="cover-hero__eyebrow">{{ t.cover.eyebrow }}</p>
      <h1 class="cover-hero__title">{{ t.cover.title }}</h1>
      <p class="cover-hero__greeting">{{ wedding.greeting }}</p>
      <ParentsLine @contact="contactOpen = true" />
    </div>

    <ContactModal :open="contactOpen" @close="contactOpen = false" />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useInvitationContent } from '../composables/useInvitationContent'
import CoverSplashBlock from './CoverSplashBlock.vue'
import LineArtDecor from './LineArtDecor.vue'
import ParentsLine from './ParentsLine.vue'
import ContactModal from './ContactModal.vue'
import SectionCornerPatterns from './SectionCornerPatterns.vue'

const { wedding, t } = useInvitationContent()
const contactOpen = ref(false)
</script>

<style scoped>
.cover-hero {
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 2.5rem;
}

.cover-hero :deep(.section-corner-patterns__bl) {
  left: calc(-0.5rem * var(--inv-ratio) + 30px * var(--inv-ratio));
  bottom: calc(-0.5rem * var(--inv-ratio) + 20px * var(--inv-ratio));
  transform: scale(0.5) rotate(-18deg);
  transform-origin: bottom left;
}

.cover-hero__content {
  padding: 2rem var(--section-pad-x) 0;
  text-align: center;
}

.cover-hero__eyebrow {
  margin: 0 0 0.75rem;
  font-family: var(--font-serif);
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-primary-dark);
}

.cover-hero__title {
  margin: 0 0 1.25rem;
  font-family: var(--font-serif);
  font-size: 1.375rem;
  font-weight: 600;
  color: #333;
}

.cover-hero__greeting {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 2;
  white-space: pre-line;
  color: var(--color-text-muted);
}
</style>
