<template>
  <section class="information section section--white">
    <SectionHeader :eyebrow="t.information.eyebrow" :title="t.information.title" />

    <div class="information__notice hanji-card">
      <p class="information__notice-text">{{ t.information.flowerNotice }}</p>
    </div>
  </section>
</template>

<script setup>
import { useLocale } from '../composables/useLocale'
import SectionHeader from './SectionHeader.vue'

const { t } = useLocale()
</script>

<style scoped>
.information__notice {
  max-width: 17.5rem;
  margin: 0 auto;
  padding: 1.5rem 1.375rem;
  background: var(--color-accent);
  text-align: center;
}

.information__notice-text {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 2;
  white-space: pre-line;
  color: var(--color-text);
  letter-spacing: 0.01em;
}
</style>
