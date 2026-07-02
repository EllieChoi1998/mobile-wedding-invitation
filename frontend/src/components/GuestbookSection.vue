<template>
  <section class="guestbook section section--accent">
    <SectionCornerPatterns
      :show-bottom-left="false"
      top-right-placement="header"
      top-right-flower="1"
    />
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
      <button type="button" class="btn-outline guestbook__view" @click="openViewModal">
        {{ t.guestbook.viewOpen }}
      </button>
      <p v-if="error" class="guestbook__msg guestbook__msg--error">{{ error }}</p>
      <p v-if="success" class="guestbook__msg guestbook__msg--success">{{ t.guestbook.success }}</p>
    </form>

    <GuestbookViewModal
      :open="viewModalOpen"
      :messages="messages"
      :loading="loading"
      :load-error="loadError"
      @close="viewModalOpen = false"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { listGuestbook, submitGuestbook } from '../api/guestbook'
import { useAppStatus } from '../composables/useAppStatus'
import { useInvitationContent } from '../composables/useInvitationContent'
import { useSubmissionClosedToast } from '../composables/useSubmissionClosedToast'
import GuestbookViewModal from './GuestbookViewModal.vue'
import SectionCornerPatterns from './SectionCornerPatterns.vue'
import SectionHeader from './SectionHeader.vue'

const { t } = useInvitationContent()
const { isGuestbookOpen } = useAppStatus()
const { show: showClosedToast } = useSubmissionClosedToast()

const authorName = ref('')
const message = ref('')
const gbSide = ref('')
const submitting = ref(false)
const error = ref('')
const success = ref(false)

const messages = ref([])
const loading = ref(false)
const loadError = ref('')
const viewModalOpen = ref(false)

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

function openViewModal() {
  viewModalOpen.value = true
  fetchMessages()
}

async function onSubmit() {
  if (!isGuestbookOpen.value) {
    showClosedToast(t.value.common.submissionClosed)
    return
  }

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
</script>

<style scoped>
.guestbook :deep(.section-corner-patterns__tr) {
  top: calc(4.75rem - 80px);
  right: calc(-0.5rem + 300px);
  transform: scale(0.8);
  transform-origin: top right;
}

.guestbook__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.guestbook__view {
  width: 100%;
}

.guestbook__msg {
  margin: 0;
  text-align: center;
  font-size: 0.8125rem;
}

.guestbook__msg--error { color: #c0392b; }
.guestbook__msg--success { color: var(--color-primary-dark); }
</style>
