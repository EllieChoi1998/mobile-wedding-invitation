<template>
  <header class="hero">
    <p class="hero__eyebrow">Wedding Invitation</p>
    <h1 class="hero__names">{{ couple.groom.fullName }}<span class="hero__amp">&amp;</span>{{ couple.bride.fullName }}</h1>
    <p class="hero__greeting">{{ wedding.greeting }}</p>

    <nav class="hero__nav">
      <RouterLink
        :to="{ path: '/', query: { side: 'groom' } }"
        class="hero__link"
        :class="{ 'hero__link--active': side === 'groom' }"
      >
        신랑 측
      </RouterLink>
      <RouterLink
        :to="{ path: '/', query: { side: 'bride' } }"
        class="hero__link"
        :class="{ 'hero__link--active': side === 'bride' }"
      >
        신부 측
      </RouterLink>
    </nav>

    <div class="hero__parents">
      <p class="hero__parents-label">{{ sideInfo.parentInfo.label }}</p>
      <p class="hero__parents-names">
        (부)
        <button type="button" class="hero__parent-btn" @click="openAccount(sideInfo.parentInfo.father)">
          {{ sideInfo.parentInfo.father.name }}
        </button>
        · (모)
        <button type="button" class="hero__parent-btn" @click="openAccount(sideInfo.parentInfo.mother)">
          {{ sideInfo.parentInfo.mother.name }}
        </button>
      </p>
      <p class="hero__parents-hint">성함을 누르면 계좌번호를 확인할 수 있습니다</p>
    </div>

    <AccountModal :open="modalOpen" :account="selectedAccount" @close="modalOpen = false" />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AccountModal from './AccountModal.vue'
import { useSide } from '../composables/useSide'
import { couple, wedding } from '../data/invitation'

const { side, sideInfo } = useSide()

const modalOpen = ref(false)
const selectedAccount = ref({ name: '', bank: '', accountNumber: '', holder: '' })

function openAccount(account) {
  selectedAccount.value = account
  modalOpen.value = true
}
</script>

<style scoped>
.hero {
  padding: 3rem 1.5rem 2.5rem;
  text-align: center;
  background: linear-gradient(180deg, var(--color-accent) 0%, #fff 100%);
  border-bottom: 1px solid rgba(244, 167, 185, 0.3);
}

.hero__eyebrow {
  margin: 0 0 1rem;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--color-primary-dark);
  text-transform: uppercase;
}

.hero__names {
  margin: 0 0 1.25rem;
  font-size: 1.65rem;
  font-weight: 600;
  line-height: 1.5;
  color: #333;
}

.hero__amp {
  display: inline-block;
  margin: 0 0.5rem;
  font-weight: 400;
  color: var(--color-primary);
}

.hero__greeting {
  margin: 0 0 1.75rem;
  font-size: 0.9rem;
  line-height: 1.85;
  white-space: pre-line;
  color: var(--color-text-muted);
}

.hero__nav {
  display: flex;
  justify-content: center;
  gap: 0.625rem;
  margin-bottom: 1.75rem;
}

.hero__link {
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  text-decoration: none;
  color: var(--color-primary-dark);
  border: 1.5px solid var(--color-primary);
  transition: background 0.2s, color 0.2s;
}

.hero__link--active,
.hero__link:hover {
  background: var(--color-primary);
  color: #fff;
}

.hero__parents {
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: rgba(255, 240, 243, 0.7);
  border: 1px solid rgba(244, 167, 185, 0.25);
}

.hero__parents-label {
  margin: 0 0 0.375rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--color-primary-dark);
}

.hero__parents-names {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text);
}

.hero__parent-btn {
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: var(--color-primary-dark);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.hero__parent-btn:hover {
  color: var(--color-primary);
}

.hero__parents-hint {
  margin: 0.625rem 0 0;
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}
</style>
