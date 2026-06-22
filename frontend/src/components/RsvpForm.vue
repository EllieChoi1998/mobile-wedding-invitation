<template>
  <section class="rsvp">
    <h2 class="rsvp__title">참석 여부</h2>
    <p class="rsvp__desc">축하해 주실 하객분들의 참석 여부를 알려주세요.</p>

    <form class="rsvp__form" @submit.prevent="onSubmit">
      <div class="rsvp__field">
        <label class="rsvp__label" for="guest-name">성함</label>
        <input
          id="guest-name"
          v-model.trim="guestName"
          type="text"
          class="rsvp__input"
          placeholder="이름을 입력해 주세요"
          maxlength="50"
          required
        />
      </div>

      <fieldset class="rsvp__field">
        <legend class="rsvp__label">어느 측 하객이신가요?</legend>
        <div class="rsvp__options">
          <label class="rsvp__option">
            <input v-model="side" type="radio" name="rsvp-side" value="groom" required />
            <span>신랑 측</span>
          </label>
          <label class="rsvp__option">
            <input v-model="side" type="radio" name="rsvp-side" value="bride" required />
            <span>신부 측</span>
          </label>
        </div>
      </fieldset>

      <fieldset class="rsvp__field">
        <legend class="rsvp__label">참석 여부</legend>
        <div class="rsvp__options">
          <label class="rsvp__option">
            <input v-model="attending" type="radio" name="rsvp-attending" value="yes" required />
            <span>참석합니다</span>
          </label>
          <label class="rsvp__option">
            <input v-model="attending" type="radio" name="rsvp-attending" value="no" required />
            <span>참석하지 못합니다</span>
          </label>
        </div>
      </fieldset>

      <button type="submit" class="rsvp__submit" :disabled="submitting">
        {{ submitting ? '전송 중...' : '참석 여부 전달하기' }}
      </button>

      <p v-if="error" class="rsvp__message rsvp__message--error">{{ error }}</p>
      <p v-if="success" class="rsvp__message rsvp__message--success">참석 여부가 전달되었습니다. 감사합니다!</p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { submitRsvp } from '../api/rsvp'

const guestName = ref('')
const side = ref('')
const attending = ref('')
const submitting = ref(false)
const error = ref('')
const success = ref(false)

async function onSubmit() {
  submitting.value = true
  error.value = ''
  success.value = false

  try {
    await submitRsvp({
      guestName: guestName.value,
      side: side.value,
      attending: attending.value === 'yes',
    })
    success.value = true
    guestName.value = ''
    side.value = ''
    attending.value = ''
  } catch (err) {
    error.value = err.message || '전송에 실패했습니다. 다시 시도해 주세요.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.rsvp {
  padding: 2.5rem 1.5rem;
}

.rsvp__title {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
  color: var(--color-primary-dark);
}

.rsvp__desc {
  margin: 0 0 1.75rem;
  font-size: 0.8125rem;
  text-align: center;
  color: var(--color-text-muted);
}

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
