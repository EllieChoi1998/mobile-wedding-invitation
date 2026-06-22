<template>
  <section class="rsvp section section--accent">
    <div class="section__head">
      <div class="section__divider" />
      <h2 class="section__title">{{ t.rsvp.title }}</h2>
      <p class="section__desc">{{ t.rsvp.desc }}</p>
    </div>

    <form class="rsvp__form" @submit.prevent="onSubmit">
      <div class="rsvp__field">
        <label class="rsvp__label" for="guest-name">{{ t.rsvp.name }}</label>
        <input
          id="guest-name"
          v-model.trim="guestName"
          type="text"
          class="rsvp__input"
          :placeholder="t.rsvp.namePlaceholder"
          maxlength="50"
          required
        />
      </div>

      <fieldset class="rsvp__field">
        <legend class="rsvp__label">{{ t.rsvp.sideLegend }}</legend>
        <div class="rsvp__options">
          <label class="rsvp__option">
            <input v-model="rsvpSide" type="radio" name="rsvp-side" value="groom" required />
            <span>{{ t.side.groom }}</span>
          </label>
          <label class="rsvp__option">
            <input v-model="rsvpSide" type="radio" name="rsvp-side" value="bride" required />
            <span>{{ t.side.bride }}</span>
          </label>
        </div>
      </fieldset>

      <fieldset class="rsvp__field">
        <legend class="rsvp__label">{{ t.rsvp.attendingLegend }}</legend>
        <div class="rsvp__options">
          <label class="rsvp__option">
            <input v-model="attending" type="radio" name="rsvp-attending" value="yes" required />
            <span>{{ t.rsvp.attendingYes }}</span>
          </label>
          <label class="rsvp__option">
            <input v-model="attending" type="radio" name="rsvp-attending" value="no" required />
            <span>{{ t.rsvp.attendingNo }}</span>
          </label>
        </div>
      </fieldset>

      <button type="submit" class="rsvp__submit" :disabled="submitting">
        {{ submitting ? t.rsvp.submitting : t.rsvp.submit }}
      </button>

      <p v-if="error" class="rsvp__message rsvp__message--error">{{ error }}</p>
      <p v-if="success" class="rsvp__message rsvp__message--success">{{ t.rsvp.success }}</p>
    </form>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { submitRsvp } from '../api/rsvp'
import { useLocale } from '../composables/useLocale'
import { useSide } from '../composables/useSide'

const { t } = useLocale()
const { side: pageSide } = useSide()

const guestName = ref('')
const rsvpSide = ref('')
const attending = ref('')
const submitting = ref(false)
const error = ref('')
const success = ref(false)

watch(
  pageSide,
  (newSide) => {
    rsvpSide.value = newSide
  },
  { immediate: true },
)

async function onSubmit() {
  submitting.value = true
  error.value = ''
  success.value = false

  try {
    await submitRsvp({
      guestName: guestName.value,
      side: rsvpSide.value,
      attending: attending.value === 'yes',
    })
    success.value = true
    guestName.value = ''
    attending.value = ''
    rsvpSide.value = pageSide.value
  } catch (err) {
    error.value = err.message || t.value.rsvp.error
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.rsvp__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.rsvp__field {
  margin: 0;
  padding: 0;
  border: none;
}

.rsvp__label {
  display: block;
  margin-bottom: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text);
}

.rsvp__input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid rgba(244, 167, 185, 0.4);
  border-radius: 10px;
  font-size: 0.9375rem;
  background: #fff;
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s;
}

.rsvp__input:focus {
  border-color: var(--color-primary);
}

.rsvp__options {
  display: flex;
  gap: 0.625rem;
}

.rsvp__option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.75rem 0.5rem;
  border-radius: 10px;
  border: 1.5px solid rgba(244, 167, 185, 0.35);
  background: #fff;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.rsvp__option:has(input:checked) {
  border-color: var(--color-primary);
  background: var(--color-accent);
  color: var(--color-primary-dark);
}

.rsvp__option input {
  accent-color: var(--color-primary);
}

.rsvp__submit {
  margin-top: 0.5rem;
  padding: 0.875rem;
  border: none;
  border-radius: 10px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.rsvp__submit:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.rsvp__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rsvp__message {
  margin: 0;
  font-size: 0.8125rem;
  text-align: center;
}

.rsvp__message--error {
  color: #c0392b;
}

.rsvp__message--success {
  color: var(--color-primary-dark);
}
</style>
