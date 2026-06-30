<template>
  <section class="interview section section--accent">
    <SectionHeader :eyebrow="t.interview.eyebrow" :title="t.interview.title" />

    <div class="interview__list">
      <article
        v-for="(item, index) in visibleItems"
        :key="index"
        class="interview__item"
      >
        <p class="interview__q">Q{{ index + 1 }}.</p>
        <h3 class="interview__question">{{ item.question }}</h3>
        <div class="interview__answer">
          <p class="interview__who">🤵🏻 {{ t.interview.groomLabel }} {{ couple.groom.fullName }}</p>
          <p class="interview__text">{{ item.groomAnswer }}</p>
        </div>
        <div class="interview__answer">
          <p class="interview__who">👰🏻‍♀️ {{ t.interview.brideLabel }} {{ couple.bride.fullName }}</p>
          <p class="interview__text">{{ item.brideAnswer }}</p>
        </div>
      </article>
    </div>

    <button
      v-if="interview.length > initialCount"
      type="button"
      class="btn-text interview__toggle"
      @click="expanded = !expanded"
    >
      {{ expanded ? t.interview.showLess : t.interview.showMore }}
    </button>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useInvitationContent } from '../composables/useInvitationContent'
import SectionHeader from './SectionHeader.vue'

const { interview, couple, t } = useInvitationContent()

const initialCount = 1
const expanded = ref(false)

const visibleItems = computed(() =>
  expanded.value ? interview : interview.slice(0, initialCount),
)
</script>

<style scoped>
.interview__list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.interview__item {
  padding: 1.25rem;
  border-radius: 14px;
  background: #fff;
}

.interview__q {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  color: var(--color-primary);
}

.interview__question {
  margin: 0 0 1rem;
  font-family: var(--font-serif);
  font-size: 0.9375rem;
  font-weight: 600;
  color: #333;
}

.interview__answer {
  margin-bottom: 1rem;
}

.interview__answer:last-child {
  margin-bottom: 0;
}

.interview__who {
  margin: 0 0 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text);
}

.interview__text {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  white-space: pre-line;
  color: var(--color-text-muted);
}

.interview__toggle {
  display: block;
  margin: 1.5rem auto 0;
}
</style>
