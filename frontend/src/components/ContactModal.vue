<template>
  <Teleport to="body">
    <div v-if="open" class="contact-modal" @click.self="emit('close')">
      <div class="contact-modal__panel" role="dialog" aria-modal="true" :aria-label="t.contactModal.title">
        <button type="button" class="contact-modal__close" :aria-label="t.contactModal.close" @click="emit('close')">
          ✕
        </button>
        <h3 class="contact-modal__title">{{ t.contactModal.title }}</h3>
        <ul class="contact-modal__list">
          <li v-for="contact in contacts" :key="contact.phone" class="contact-modal__item">
            <span class="contact-modal__role">{{ contact.role }}</span>
            <span class="contact-modal__name">{{ contact.name }}</span>
            <a :href="`tel:${contact.phone}`" class="contact-modal__phone">{{ contact.phone }}</a>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useInvitationContent } from '../composables/useInvitationContent'

defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const { contacts, t } = useInvitationContent()
</script>

<style scoped>
.contact-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.45);
}

.contact-modal__panel {
  position: relative;
  width: 100%;
  max-width: 340px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 2rem 1.5rem 1.5rem;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 32px rgba(244, 167, 185, 0.25);
}

.contact-modal__close {
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  cursor: pointer;
}

.contact-modal__title {
  margin: 0 0 1.25rem;
  font-family: var(--font-serif);
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
  color: #333;
}

.contact-modal__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.contact-modal__item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5rem 0.75rem;
  align-items: center;
  padding: 0.875rem 0;
  border-bottom: 1px solid rgba(244, 167, 185, 0.15);
}

.contact-modal__item:last-child {
  border-bottom: none;
}

.contact-modal__role {
  font-size: 0.75rem;
  color: var(--color-primary);
}

.contact-modal__name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.contact-modal__phone {
  font-size: 0.8125rem;
  color: var(--color-primary-dark);
  text-decoration: none;
}
</style>
