<template>
  <section class="information section section--white">
    <SectionHeader :eyebrow="t.information.eyebrow" :title="t.information.title" />

    <div class="information__list">
      <article v-for="(item, index) in information" :key="index" class="information__item hanji-card">
        <h3 class="information__item-title">{{ item.title }}</h3>
        <p class="information__item-body">{{ item.body }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useInvitationContent } from '../composables/useInvitationContent'
import SectionHeader from './SectionHeader.vue'

const { information, t } = useInvitationContent()
</script>

<style scoped>
.information__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.information__item {
  padding: 1.125rem 1.25rem;
  border-radius: 12px;
  background: var(--color-accent);
  text-align: center;
}

.information__item-title {
  margin: 0 0 0.5rem;
  font-family: var(--font-serif);
  font-size: 0.9375rem;
  font-weight: 600;
  color: #333;
}

.information__item-body {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  white-space: pre-line;
  color: var(--color-text-muted);
}
</style>
