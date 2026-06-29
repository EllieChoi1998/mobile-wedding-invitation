<template>
  <section class="account section section--white">
    <SectionHeader
      :eyebrow="t.account.eyebrow"
      :title="t.account.title"
      :desc="t.account.desc"
    />

    <div class="account__tabs">
      <button
        type="button"
        class="account__tab"
        :class="{ 'account__tab--active': activeTab === 'groom' }"
        @click="activeTab = 'groom'"
      >
        {{ t.account.groomTab }}
      </button>
      <button
        type="button"
        class="account__tab"
        :class="{ 'account__tab--active': activeTab === 'bride' }"
        @click="activeTab = 'bride'"
      >
        {{ t.account.brideTab }}
      </button>
    </div>

    <ul class="account__list">
      <li v-for="(item, index) in activeAccounts" :key="index" class="account__item">
        <div class="account__info">
          <span class="account__label">{{ item.label }}</span>
          <span class="account__name">{{ item.name }}</span>
          <span class="account__bank">{{ item.bank }} {{ item.accountNumber }}</span>
        </div>
        <button type="button" class="btn-outline account__copy" @click="copyAccount(item, index)">
          {{ copiedIndex === index ? t.account.copied : t.account.copy }}
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useInvitationContent } from '../composables/useInvitationContent'
import SectionHeader from './SectionHeader.vue'

const { accounts, side, t } = useInvitationContent()

const activeTab = ref('groom')
const copiedIndex = ref(-1)

watch(
  side,
  (newSide) => {
    activeTab.value = newSide
  },
  { immediate: true },
)

const activeAccounts = computed(() =>
  activeTab.value === 'groom' ? accounts.groomSide : accounts.brideSide,
)

async function copyAccount(item, index) {
  try {
    await navigator.clipboard.writeText(item.accountNumber)
    copiedIndex.value = index
    setTimeout(() => { copiedIndex.value = -1 }, 2000)
  } catch {
    copiedIndex.value = -1
  }
}
</script>

<style scoped>
.account__tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.account__tab {
  flex: 1;
  padding: 0.75rem;
  border: 1.5px solid rgba(244, 167, 185, 0.35);
  border-radius: 10px;
  background: var(--color-accent);
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.account__tab--active {
  border-color: var(--color-primary);
  background: #fff;
  color: var(--color-primary-dark);
  font-weight: 500;
}

.account__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.account__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.125rem;
  border-radius: 12px;
  background: var(--color-accent);
}

.account__info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.account__label {
  font-size: 0.6875rem;
  color: var(--color-primary);
}

.account__name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.account__bank {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  word-break: break-all;
}

.account__copy {
  flex-shrink: 0;
  padding: 0.5rem 0.875rem;
  font-size: 0.75rem;
}
</style>
