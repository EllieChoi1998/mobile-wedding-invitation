<template>
  <section class="parents section section--white">
    <div class="section__head">
      <div class="section__divider" />
      <h2 class="section__title">{{ t.parents.sectionTitle }}</h2>
      <p class="section__desc">{{ sideInfo.parentInfo.label }}</p>
    </div>

    <div class="parents__card">
      <p class="parents__row">
        <span class="parents__role">({{ t.parents.father }})</span>
        <button type="button" class="parents__name" @click="openAccount(sideInfo.parentInfo.father)">
          {{ sideInfo.parentInfo.father.name }}
        </button>
      </p>
      <p class="parents__row">
        <span class="parents__role">({{ t.parents.mother }})</span>
        <button type="button" class="parents__name" @click="openAccount(sideInfo.parentInfo.mother)">
          {{ sideInfo.parentInfo.mother.name }}
        </button>
      </p>
      <p class="parents__hint">{{ t.parents.hint }}</p>
    </div>

    <AccountModal :open="modalOpen" :account="selectedAccount" @close="modalOpen = false" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import AccountModal from './AccountModal.vue'
import { useLocale } from '../composables/useLocale'
import { useInvitationContent } from '../composables/useInvitationContent'

const { t } = useLocale()
const { sideInfo } = useInvitationContent()

const modalOpen = ref(false)
const selectedAccount = ref({ name: '', bank: '', accountNumber: '', holder: '' })

function openAccount(account) {
  selectedAccount.value = account
  modalOpen.value = true
}
</script>

<style scoped>
.parents__card {
  padding: 1.25rem 1.5rem;
  border-radius: 14px;
  background: var(--color-accent);
  border: 1px solid rgba(244, 167, 185, 0.22);
  text-align: center;
}

.parents__row {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 2;
  color: var(--color-text);
}

.parents__role {
  margin-right: 0.35rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.parents__name {
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-weight: 500;
  color: var(--color-primary-dark);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.parents__name:hover {
  color: var(--color-primary);
}

.parents__hint {
  margin: 0.875rem 0 0;
  padding-top: 0.875rem;
  border-top: 1px solid rgba(244, 167, 185, 0.2);
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}
</style>
