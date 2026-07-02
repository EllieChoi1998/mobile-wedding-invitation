<template>
  <Teleport to="body">
    <div v-if="open" class="guestbook-modal" @click.self="emit('close')">
      <div
        class="guestbook-modal__panel hanji-texture"
        role="dialog"
        aria-modal="true"
        :aria-label="t.guestbook.title"
      >
        <button
          type="button"
          class="guestbook-modal__close"
          :aria-label="t.guestbook.close"
          @click="emit('close')"
        >
          ✕
        </button>

        <div class="guestbook-modal__head">
          <SectionHeader :eyebrow="t.guestbook.eyebrow" :title="t.guestbook.title" />
        </div>

        <div class="guestbook-modal__body">
          <p v-if="loading" class="guestbook-modal__placeholder">{{ t.guestbook.loading }}</p>
          <p v-else-if="loadError" class="guestbook-modal__placeholder guestbook-modal__placeholder--error">
            {{ loadError }}
          </p>
          <p v-else-if="messages.length === 0" class="guestbook-modal__placeholder">
            {{ t.guestbook.emptyModal }}
          </p>

          <ul v-else class="guestbook-modal__list">
            <li v-for="entry in messages" :key="entry.messageId" class="guestbook-modal__entry">
              <p class="guestbook-modal__from">{{ t.guestbook.from }}</p>
              <p class="guestbook-modal__author">{{ entry.authorName }}</p>
              <p class="guestbook-modal__text">
                <template v-if="isExpanded(entry.messageId) || !isLongMessage(entry.message)">
                  {{ entry.message }}
                </template>
                <template v-else>
                  {{ previewMessage(entry.message) }}
                </template>
              </p>
              <button
                v-if="isLongMessage(entry.message)"
                type="button"
                class="btn-text guestbook-modal__toggle"
                @click="toggleExpanded(entry.messageId)"
              >
                {{ isExpanded(entry.messageId) ? t.guestbook.showLess : t.guestbook.showMore }}
              </button>
              <time class="guestbook-modal__date">{{ formatDate(entry.createdAt) }}</time>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useLocale } from '../composables/useLocale'
import SectionHeader from './SectionHeader.vue'

const PREVIEW_MAX_CHARS = 80

const props = defineProps({
  open: { type: Boolean, default: false },
  messages: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  loadError: { type: String, default: '' },
})

const emit = defineEmits(['close'])

const { t } = useLocale()
const expandedIds = ref(new Set())

watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    if (!isOpen) {
      expandedIds.value = new Set()
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  document.body.style.overflow = ''
})

function isLongMessage(message) {
  return message.length > PREVIEW_MAX_CHARS
}

function previewMessage(message) {
  return `${message.slice(0, PREVIEW_MAX_CHARS)}…`
}

function isExpanded(messageId) {
  return expandedIds.value.has(messageId)
}

function toggleExpanded(messageId) {
  const next = new Set(expandedIds.value)
  if (next.has(messageId)) {
    next.delete(messageId)
  } else {
    next.add(messageId)
  }
  expandedIds.value = next
}

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.guestbook-modal {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.45);
}

.guestbook-modal__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 340px;
  min-height: 28.5rem;
  max-height: 86vh;
  padding: 1.375rem 1rem 1.125rem;
  padding-top: 1.625rem;
  border-radius: 16px;
  background: var(--color-accent);
  box-shadow: 0 8px 28px rgba(var(--color-primary-rgb), 0.28);
}

.guestbook-modal__close {
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

.guestbook-modal__head {
  flex-shrink: 0;
}

.guestbook-modal__head :deep(.section__head) {
  margin-bottom: 1rem;
}

.guestbook-modal__head :deep(.section__divider) {
  margin-bottom: 0.5rem;
}

.guestbook-modal__head :deep(.section__eyebrow) {
  margin-bottom: 0.3rem;
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
}

.guestbook-modal__head :deep(.section__title) {
  margin-bottom: 0;
  font-size: 1.0625rem;
}

.guestbook-modal__body {
  flex: 1;
  min-height: 22rem;
  height: 22rem;
}

.guestbook-modal__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 0;
  padding: 0 1rem;
  text-align: center;
  font-family: var(--font-serif);
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--color-text-muted);
}

.guestbook-modal__placeholder--error {
  color: #c0392b;
}

.guestbook-modal__list {
  list-style: none;
  margin: 0;
  height: 100%;
  padding: 0.25rem 0.125rem 0.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.guestbook-modal__entry {
  flex-shrink: 0;
  min-height: 4.75rem;
  padding: 1rem 1.0625rem;
  border-radius: 12px;
  background: #fff;
}

.guestbook-modal__from {
  margin: 0 0 0.125rem;
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}

.guestbook-modal__author {
  margin: 0 0 0.375rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text);
}

.guestbook-modal__text {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--color-text-muted);
  white-space: pre-line;
}

.guestbook-modal__toggle {
  margin-top: 0.375rem;
  padding: 0;
  font-size: 0.75rem;
}

.guestbook-modal__date {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}
</style>
