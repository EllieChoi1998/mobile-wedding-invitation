<template>
  <Teleport to="body">
    <div v-if="open" class="rsvp-modal" @click.self="emit('close')">
      <div
        class="rsvp-modal__panel hanji-texture"
        role="dialog"
        aria-modal="true"
        :aria-label="t.rsvp.title"
      >
        <button
          type="button"
          class="rsvp-modal__close"
          :aria-label="t.rsvp.close"
          @click="emit('close')"
        >
          ✕
        </button>

        <div class="rsvp-modal__body">
          <div class="rsvp-modal__head">
            <SectionHeader
              :eyebrow="t.rsvp.eyebrow"
              :title="t.rsvp.title"
              :desc="t.rsvp.desc"
            />
          </div>

          <RsvpFormContent compact />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useLocale } from '../composables/useLocale'
import { watch, onUnmounted } from 'vue'
import RsvpFormContent from './RsvpFormContent.vue'
import SectionHeader from './SectionHeader.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const { t } = useLocale()

watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
  { immediate: true },
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.rsvp-modal {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.45);
}

.rsvp-modal__panel {
  position: relative;
  width: 100%;
  max-width: 340px;
  max-height: 86vh;
  border-radius: 16px;
  background: var(--color-accent);
  box-shadow: 0 8px 28px rgba(var(--color-primary-rgb), 0.28);
}

.rsvp-modal__body {
  max-height: 86vh;
  padding: 1.375rem 1rem 1.125rem;
  padding-top: 1.625rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.rsvp-modal__body::-webkit-scrollbar {
  display: none;
}

.rsvp-modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 3;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: var(--color-text-muted);
  font-size: 0.75rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 1px 5px rgba(var(--color-primary-rgb), 0.18);
}

.rsvp-modal__head :deep(.section__head) {
  margin-bottom: 0.875rem;
}

.rsvp-modal__head :deep(.section__divider) {
  margin-bottom: 0.5rem;
}

.rsvp-modal__head :deep(.section__eyebrow) {
  margin-bottom: 0.3rem;
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
}

.rsvp-modal__head :deep(.section__title) {
  margin-bottom: 0.35rem;
  font-size: 1.0625rem;
}

.rsvp-modal__head :deep(.section__desc) {
  font-size: 0.75rem;
  line-height: 1.55;
}
</style>
