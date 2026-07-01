<template>
  <form
    class="rsvp-form"
    :class="{ 'rsvp-form--compact': compact }"
    novalidate
    @submit.prevent="onSubmit"
  >
    <div class="rsvp-form__field">
      <label class="rsvp-form__label" for="guest-name">{{ t.rsvp.name }}</label>
      <input
        :id="inputId"
        v-model.trim="guestName"
        type="text"
        class="rsvp-form__input"
        :placeholder="t.rsvp.namePlaceholder"
        maxlength="50"
      />
    </div>

    <fieldset class="rsvp-form__field">
      <legend class="rsvp-form__label">{{ t.rsvp.sideLegend }}</legend>
      <div class="rsvp-form__options">
        <label class="rsvp-form__option">
          <input v-model="rsvpSide" type="radio" :name="`${inputId}-side`" value="groom" />
          <span>{{ t.side.groom }}</span>
        </label>
        <label class="rsvp-form__option">
          <input v-model="rsvpSide" type="radio" :name="`${inputId}-side`" value="bride" />
          <span>{{ t.side.bride }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="rsvp-form__field">
      <legend class="rsvp-form__label">{{ t.rsvp.attendingLegend }}</legend>
      <div class="rsvp-form__options">
        <label class="rsvp-form__option">
          <input v-model="attending" type="radio" :name="`${inputId}-attending`" value="yes" />
          <span>{{ t.rsvp.attendingYes }}</span>
        </label>
        <label class="rsvp-form__option">
          <input v-model="attending" type="radio" :name="`${inputId}-attending`" value="no" />
          <span>{{ t.rsvp.attendingNo }}</span>
        </label>
      </div>
    </fieldset>

    <Transition name="rsvp-toast">
      <p
        v-if="validationMessage"
        class="rsvp-form__toast"
        role="alert"
        aria-live="polite"
      >
        {{ validationMessage }}
      </p>
    </Transition>

    <button type="submit" class="btn-primary rsvp-form__submit" :disabled="submitting">
      {{ submitting ? t.rsvp.submitting : t.rsvp.submit }}
    </button>

    <p v-if="error" class="rsvp-form__message rsvp-form__message--error">{{ error }}</p>
    <p v-if="success" class="rsvp-form__message rsvp-form__message--success">{{ t.rsvp.success }}</p>
  </form>
</template>

<script setup>
import { useId } from 'vue'
import { useRsvpForm } from '../composables/useRsvpForm'

defineProps({
  compact: { type: Boolean, default: false },
})

const inputId = useId()

const {
  guestName,
  rsvpSide,
  attending,
  submitting,
  error,
  success,
  validationMessage,
  onSubmit,
  t,
} = useRsvpForm()
</script>

<style scoped>
.rsvp-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.rsvp-form__field {
  margin: 0;
  padding: 0;
  border: none;
}

.rsvp-form__label {
  display: block;
  margin-bottom: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text);
}

.rsvp-form__input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid rgba(var(--color-primary-rgb), 0.4);
  border-radius: 10px;
  font-size: 0.9375rem;
  background: #fff;
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s;
}

.rsvp-form__input:focus {
  border-color: var(--color-primary);
}

.rsvp-form__options {
  display: flex;
  gap: 0.625rem;
}

.rsvp-form__option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.75rem 0.5rem;
  border-radius: 10px;
  border: 1.5px solid rgba(var(--color-primary-rgb), 0.35);
  background: #fff;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.rsvp-form__option:has(input:checked) {
  border-color: var(--color-primary);
  background: var(--color-accent);
  color: var(--color-primary-dark);
}

.rsvp-form__option input {
  accent-color: var(--color-primary);
}

.rsvp-form__submit {
  width: 100%;
  margin-top: 0.5rem;
}

.rsvp-form__toast {
  margin: 0;
  padding: 0.75rem 0.875rem;
  border-radius: 10px;
  border: 1px solid rgba(var(--color-primary-rgb), 0.45);
  background: #fff;
  box-shadow: 0 4px 14px rgba(var(--color-primary-rgb), 0.18);
  font-size: 0.8125rem;
  line-height: 1.5;
  text-align: center;
  color: var(--color-primary-dark);
}

.rsvp-toast-enter-active,
.rsvp-toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.rsvp-toast-enter-from,
.rsvp-toast-leave-to {
  opacity: 0;
  transform: translateY(0.35rem);
}

.rsvp-form__message {
  margin: 0;
  font-size: 0.8125rem;
  text-align: center;
}

.rsvp-form__message--error {
  color: #c0392b;
}

.rsvp-form__message--success {
  color: var(--color-primary-dark);
}

.rsvp-form--compact {
  gap: 0.75rem;
}

.rsvp-form--compact .rsvp-form__label {
  margin-bottom: 0.375rem;
  font-size: 0.75rem;
}

.rsvp-form--compact .rsvp-form__input {
  padding: 0.5625rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
}

.rsvp-form--compact .rsvp-form__options {
  gap: 0.5rem;
}

.rsvp-form--compact .rsvp-form__option {
  padding: 0.5625rem 0.375rem;
  border-radius: 8px;
  font-size: 0.75rem;
  gap: 0.25rem;
}

.rsvp-form--compact .rsvp-form__submit {
  margin-top: 0.25rem;
  padding: 0.6875rem 1rem;
  font-size: 0.8125rem;
}

.rsvp-form--compact .rsvp-form__message {
  font-size: 0.75rem;
}

.rsvp-form--compact .rsvp-form__toast {
  padding: 0.625rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 8px;
}
</style>
