<template>
  <Teleport to="body">
    <Transition name="submission-closed">
      <div
        v-if="visible"
        class="submission-closed"
        role="presentation"
        @click.self="dismiss"
      >
        <p class="submission-closed__panel" role="alert" aria-live="polite">
          {{ message }}
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useSubmissionClosedToast } from '../composables/useSubmissionClosedToast'

const { visible, message, dismiss } = useSubmissionClosedToast()
</script>

<style scoped>
.submission-closed {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.35);
}

.submission-closed__panel {
  max-width: 18rem;
  margin: 0;
  padding: 1.125rem 1.25rem;
  border-radius: 14px;
  border: 1px solid rgba(var(--color-primary-rgb), 0.45);
  background: #fff;
  box-shadow: 0 8px 24px rgba(var(--color-primary-rgb), 0.22);
  font-family: var(--font-serif);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.75;
  text-align: center;
  color: var(--color-primary-dark);
}

.submission-closed-enter-active,
.submission-closed-leave-active {
  transition: opacity 0.25s ease;
}

.submission-closed-enter-active .submission-closed__panel,
.submission-closed-leave-active .submission-closed__panel {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.submission-closed-enter-from,
.submission-closed-leave-to {
  opacity: 0;
}

.submission-closed-enter-from .submission-closed__panel,
.submission-closed-leave-to .submission-closed__panel {
  opacity: 0;
  transform: translateY(0.5rem) scale(0.98);
}
</style>
