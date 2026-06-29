<template>
  <section class="timeline section section--white">
    <SectionHeader
      :eyebrow="t.timeline.eyebrow"
      :title="t.timeline.title"
      :desc="t.timeline.desc"
    />

    <ol class="timeline__list">
      <li v-for="(item, index) in timeline" :key="index" class="timeline__item">
        <div class="timeline__dot" />
        <div class="timeline__card">
          <p class="timeline__date">{{ item.date }}</p>
          <p v-if="item.emoji" class="timeline__emoji">{{ item.emoji }}</p>
          <h3 class="timeline__title">{{ item.title }}</h3>
          <p class="timeline__desc">{{ item.description }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { useInvitationContent } from '../composables/useInvitationContent'
import SectionHeader from './SectionHeader.vue'

const { timeline, t } = useInvitationContent()
</script>

<style scoped>
.timeline__list {
  list-style: none;
  margin: 0;
  padding: 0 0 0 1.25rem;
  border-left: 2px solid rgba(244, 167, 185, 0.35);
}

.timeline__item {
  position: relative;
  padding-bottom: 1.75rem;
}

.timeline__item:last-child {
  padding-bottom: 0;
}

.timeline__dot {
  position: absolute;
  left: -1.375rem;
  top: 0.375rem;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(244, 167, 185, 0.25);
}

.timeline__card {
  padding: 1rem 1.125rem;
  border-radius: 12px;
  background: var(--color-accent);
}

.timeline__date {
  margin: 0 0 0.375rem;
  font-size: 0.75rem;
  color: var(--color-primary-dark);
}

.timeline__emoji {
  margin: 0 0 0.375rem;
  font-size: 1.125rem;
}

.timeline__title {
  margin: 0 0 0.5rem;
  font-family: var(--font-serif);
  font-size: 0.9375rem;
  font-weight: 600;
  color: #333;
}

.timeline__desc {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  white-space: pre-line;
  color: var(--color-text-muted);
}
</style>
