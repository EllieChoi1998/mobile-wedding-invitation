<template>
  <section class="timeline section section--white">
    <SectionHeader
      :eyebrow="t.timeline.eyebrow"
      :title="t.timeline.title"
      :desc="t.timeline.desc"
    />

    <ol class="timeline__list">
      <li v-for="(item, index) in visibleItems" :key="index" class="timeline__item">
        <div class="timeline__dot" />
        <div
          class="timeline__card hanji-card"
          :class="{ 'timeline__card--with-counter': item.showRelationshipCounter }"
        >
          <div class="timeline__card-main">
            <p class="timeline__date">{{ item.date }}</p>
            <p v-if="item.emoji" class="timeline__emoji">{{ item.emoji }}</p>
            <h3 class="timeline__title">{{ item.title }}</h3>
            <p class="timeline__desc">{{ item.description }}</p>
          </div>
          <div v-if="item.showRelationshipCounter" class="timeline__counter" aria-live="polite">
            <p class="timeline__counter-days">
              {{ elapsed.days }}<span class="timeline__counter-unit">{{ t.timeline.counterDayUnit }}</span>
            </p>
            <p class="timeline__counter-time">{{ elapsedTime }}</p>
          </div>
        </div>
      </li>
    </ol>

    <button
      v-if="timeline.length > initialCount"
      type="button"
      class="btn-text timeline__toggle"
      @click="expanded = !expanded"
    >
      {{ expanded ? t.timeline.showLess : t.timeline.showMore }}
    </button>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { relationship } from '../data/invitation'
import { useRelationshipCounter } from '../composables/useRelationshipCounter'
import { useInvitationContent } from '../composables/useInvitationContent'
import SectionHeader from './SectionHeader.vue'

const { timeline, t } = useInvitationContent()
const elapsed = useRelationshipCounter(relationship.startDateISO)

const initialCount = 1
const expanded = ref(false)

const visibleItems = computed(() =>
  expanded.value ? timeline : timeline.slice(0, initialCount),
)

const elapsedTime = computed(() => {
  const pad = (n) => String(n).padStart(2, '0')
  const { hours, minutes, seconds } = elapsed.value
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
})
</script>

<style scoped>
.timeline__list {
  list-style: none;
  margin: 0;
  padding: 0 0 0 1.25rem;
  border-left: 2px solid rgba(var(--color-primary-rgb), 0.35);
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
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.25);
}

.timeline__card {
  padding: 1rem 1.125rem;
  background: var(--color-accent);
}

.timeline__card--with-counter {
  display: flex;
  align-items: stretch;
  gap: 0.75rem;
}

.timeline__card-main {
  flex: 1;
  min-width: 0;
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

.timeline__counter {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: center;
  min-width: 3.75rem;
  padding: 0.5rem 0.625rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.72);
  text-align: center;
}

.timeline__counter-days {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.15;
  color: var(--color-primary-dark);
}

.timeline__counter-unit {
  margin-left: 0.0625rem;
  font-size: 0.625rem;
  font-weight: 500;
  color: var(--color-primary);
}

.timeline__counter-time {
  margin: 0.3125rem 0 0;
  font-size: 0.625rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  color: var(--color-text-muted);
}

.timeline__toggle {
  display: block;
  margin: 1.5rem auto 0;
}
</style>
