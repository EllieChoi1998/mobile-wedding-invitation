<template>
  <button
    type="button"
    class="rsvp-fab"
    :aria-label="t.rsvp.floatingOpen"
    @click="emit('open')"
  >
    {{ t.rsvp.floatingOpen }}
  </button>
</template>

<script setup>
import { useLocale } from '../composables/useLocale'

const emit = defineEmits(['open'])

const { t } = useLocale()
</script>

<style scoped>
.rsvp-fab {
  position: fixed;
  right: max(1rem, calc(50% - var(--section-max-width) / 2 + 1rem));
  bottom: 1.25rem;
  z-index: 900;
  padding: 0.75rem 1.125rem;
  border: none;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(var(--color-primary-rgb), 0.45);
  transition: background 0.2s, transform 0.2s;
}

.rsvp-fab:hover {
  background: var(--color-primary-dark);
}

.rsvp-fab:active {
  transform: scale(0.98);
}
</style>
