<template>
  <section class="guestbook section section--accent">
    <SectionHeader :eyebrow="t.guestbook.eyebrow" :title="t.guestbook.title" />

    <form class="guestbook__form" @submit.prevent="onSubmit">
      <div class="guestbook__field">
        <label class="guestbook__label" for="gb-name">{{ t.guestbook.name }}</label>
        <input
          id="gb-name"
          v-model.trim="authorName"
          type="text"
          class="guestbook__input"
          :placeholder="t.guestbook.namePlaceholder"
          maxlength="50"
          required
        />
      </div>
      <div class="guestbook__field">
        <label class="guestbook__label" for="gb-message">{{ t.guestbook.message }}</label>
        <textarea
          id="gb-message"
          v-model.trim="message"
          class="guestbook__textarea"
          :placeholder="t.guestbook.messagePlaceholder"
          maxlength="500"
          rows="4"
          required
        />
      </div>
      <fieldset class="guestbook__field">
        <legend class="guestbook__label">{{ t.guestbook.sideLegend }}</legend>
        <div class="guestbook__options">
          <label class="guestbook__option">
            <input v-model="gbSide" type="radio" name="gb-side" value="" />
            <span>{{ t.guestbook.sideOptional }}</span>
          </label>
          <label class="guestbook__option">
            <input v-model="gbSide" type="radio" name="gb-side" value="groom" />
            <span>{{ t.side.groom }}</span>
          </label>
          <label class="guestbook__option">
            <input v-model="gbSide" type="radio" name="gb-side" value="bride" />
            <span>{{ t.side.bride }}</span>
          </label>
        </div>
      </fieldset>
      <button type="submit" class="btn-primary guestbook__submit" :disabled="submitting">
        {{ submitting ? t.guestbook.submitting : t.guestbook.submit }}
      </button>
      <p v-if="error" class="guestbook__msg guestbook__msg--error">{{ error }}</p>
      <p v-if="success" class="guestbook__msg guestbook__msg--success">{{ t.guestbook.success }}</p>
    </form>

    <div v-if="loading" class="guestbook__status">{{ t.guestbook.loading }}</div>
    <div v-else-if="loadError" class="guestbook__msg guestbook__msg--error">{{ loadError }}</div>
    <ul v-else class="guestbook__list">
      <li v-for="entry in visibleMessages" :key="entry.messageId" class="guestbook__entry">
        <p class="guestbook__from">{{ t.guestbook.from }}</p>
        <p class="guestbook__author">{{ entry.authorName }}</p>
        <p class="guestbook__text">{{ entry.message }}</p>
        <time class="guestbook__date">{{ formatDate(entry.createdAt) }}</time>
      </li>
    </ul>
    <p v-if="!loading && !loadError && messages.length === 0" class="guestbook__status">
      {{ t.guestbook.empty }}
    </p>
    <button
      v-if="messages.length > initialCount"
      type="button"
      class="btn-text guestbook__more"
      @click="showAll = !showAll"
    >
      {{ showAll ? t.interview.showLess : t.guestbook.showMore }}
    </button>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { listGuestbook, submitGuestbook } from '../api/guestbook'
import { useInvitationContent } from '../composables/useInvitationContent'
import SectionHeader from './SectionHeader.vue'

const { t } = useInvitationContent()

const authorName = ref('')
const message = ref('')
const gbSide = ref('')
const submitting = ref(false)
const error = ref('')
const success = ref(false)

const messages = ref([])
const loading = ref(false)
const loadError = ref('')
const showAll = ref(false)
const initialCount = 3

const visibleMessages = computed(() =>
  showAll.value ? messages.value : messages.value.slice(0, initialCount),
)

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

async function fetchMessages() {
  loading.value = true
  loadError.value = ''
  try {
    const data = await listGuestbook({ limit: 50 })
    messages.value = data.messages ?? []
  } catch (err) {
    loadError.value = err.message || t.value.guestbook.loadError
    messages.value = []
  } finally {
    loading.value = false
  }
}

async function onSubmit() {
  submitting.value = true
  error.value = ''
  success.value = false
  try {
    await submitGuestbook({
      authorName: authorName.value,
      message: message.value,
      side: gbSide.value || undefined,
    })
    success.value = true
    authorName.value = ''
    message.value = ''
    gbSide.value = ''
    await fetchMessages()
  } catch (err) {
    error.value = err.message || t.value.guestbook.error
  } finally {
    submitting.value = false
  }
}

onMounted(fetchMessages)
</script>

<style scoped>
.guestbook__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.25rem;
  border-radius: 14px;
  background: #fff;
}

.guestbook__field {
  margin: 0;
  padding: 0;
  border: none;
}

.guestbook__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text);
}

.guestbook__input,
.guestbook__textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid rgba(244, 167, 185, 0.4);
  border-radius: 10px;
  font-size: 0.9375rem;
  background: #fff;
  color: var(--color-text);
  outline: none;
  resize: vertical;
}

.guestbook__input:focus,
.guestbook__textarea:focus {
  border-color: var(--color-primary);
}

.guestbook__options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.guestbook__option {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  border: 1.5px solid rgba(244, 167, 185, 0.35);
  background: var(--color-accent);
  font-size: 0.75rem;
  cursor: pointer;
}

.guestbook__option:has(input:checked) {
  border-color: var(--color-primary);
  background: #fff;
  color: var(--color-primary-dark);
}

.guestbook__submit {
  width: 100%;
}

.guestbook__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guestbook__entry {
  padding: 1.125rem 1.25rem;
  border-radius: 12px;
  background: #fff;
}

.guestbook__from {
  margin: 0 0 0.125rem;
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}

.guestbook__author {
  margin: 0 0 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text);
}

.guestbook__text {
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--color-text-muted);
}

.guestbook__date {
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}

.guestbook__status {
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.guestbook__msg {
  margin: 0;
  text-align: center;
  font-size: 0.8125rem;
}

.guestbook__msg--error { color: #c0392b; }
.guestbook__msg--success { color: var(--color-primary-dark); }

.guestbook__more {
  display: block;
  margin: 1.25rem auto 0;
}
</style>
