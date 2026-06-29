<template>
  <section class="dplus section section--white">
    <SectionHeader :eyebrow="t.dPlusDay.eyebrow" :title="t.dPlusDay.title" />

    <p class="dplus__start">{{ startDateLabel }}</p>
    <p class="dplus__today">{{ t.dPlusDay.today }}</p>

    <p class="dplus__counter">
      {{ elapsed.days }}일 {{ elapsed.hours }}시간 {{ elapsed.minutes }}분 {{ elapsed.seconds }}초
    </p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { relationship } from '../data/invitation'
import { useRelationshipCounter } from '../composables/useRelationshipCounter'
import { useInvitationContent } from '../composables/useInvitationContent'
import SectionHeader from './SectionHeader.vue'

const { t } = useInvitationContent()
const elapsed = useRelationshipCounter(relationship.startDateISO)

const startDateLabel = computed(() => {
  const d = new Date(relationship.startDateISO)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})
</script>

<style scoped>
.dplus {
  text-align: center;
}

.dplus__start {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.dplus__today {
  margin: 0 0 1rem;
  font-size: 0.8125rem;
  color: var(--color-primary);
}

.dplus__counter {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-primary-dark);
}
</style>
