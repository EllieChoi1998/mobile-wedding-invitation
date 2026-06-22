<template>
  <Teleport to="body">
    <div v-if="open" class="account-modal" @click.self="emit('close')">
      <div class="account-modal__panel" role="dialog" aria-modal="true" :aria-label="`${account.name} 계좌 정보`">
        <button type="button" class="account-modal__close" aria-label="닫기" @click="emit('close')">
          ✕
        </button>
        <p class="account-modal__label">마음 전하실 곳</p>
        <h3 class="account-modal__name">{{ account.name }}</h3>
        <dl class="account-modal__info">
          <div class="account-modal__row">
            <dt>은행</dt>
            <dd>{{ account.bank }}</dd>
          </div>
          <div class="account-modal__row">
            <dt>계좌번호</dt>
            <dd class="account-modal__account">{{ account.accountNumber }}</dd>
          </div>
          <div class="account-modal__row">
            <dt>예금주</dt>
            <dd>{{ account.holder }}</dd>
          </div>
        </dl>
        <button type="button" class="account-modal__copy" @click="copyAccount">
          {{ copied ? '복사 완료!' : '계좌번호 복사' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  account: {
    type: Object,
    default: () => ({ name: '', bank: '', accountNumber: '', holder: '' }),
  },
})

const emit = defineEmits(['close'])

const copied = ref(false)

async function copyAccount() {
  try {
    await navigator.clipboard.writeText(props.account.accountNumber)
    copied.value = true
  } catch {
    copied.value = false
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) copied.value = false
  },
)
</script>

<style scoped>
.account-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.45);
}

.account-modal__panel {
  position: relative;
  width: 100%;
  max-width: 320px;
  padding: 2rem 1.5rem 1.5rem;
  border-radius: 16px;
  background: #fff;
  text-align: center;
  box-shadow: 0 8px 32px rgba(244, 167, 185, 0.25);
}

.account-modal__close {
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

.account-modal__label {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--color-primary);
}

.account-modal__name {
  margin: 0 0 1.25rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
}

.account-modal__info {
  margin: 0 0 1.25rem;
  text-align: left;
}

.account-modal__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(244, 167, 185, 0.2);
}

.account-modal__row:last-child {
  border-bottom: none;
}

.account-modal__row dt {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.account-modal__row dd {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text);
}

.account-modal__account {
  font-weight: 600;
  color: var(--color-primary-dark) !important;
}

.account-modal__copy {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 10px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
}

.account-modal__copy:hover {
  background: var(--color-primary-dark);
}
</style>
