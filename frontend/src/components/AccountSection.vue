<template>
  <section ref="sectionEl" class="account section section--accent" :style="flowerAnchorStyle">
    <SectionCornerPatterns />
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
      <li
        v-for="(item, index) in activeAccounts"
        :key="`${activeTab}-${index}`"
        :ref="(el) => setMotherRef('card', index, el)"
        class="account__item"
      >
        <div class="account__info">
          <span class="account__label">{{ item.label }}</span>
          <span class="account__name">{{ item.name }}</span>
          <span
            :ref="(el) => setMotherRef('account', index, el)"
            class="account__bank"
          >{{ item.bank }} {{ item.accountNumber }}</span>
        </div>
        <button
          :ref="(el) => setMotherRef('copy', index, el)"
          type="button"
          class="btn-outline account__copy"
          @click="copyAccount(item, index)"
        >
          {{ copiedIndex === index ? t.account.copied : t.account.copy }}
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useInvitationContent } from '../composables/useInvitationContent'
import SectionCornerPatterns from './SectionCornerPatterns.vue'
import SectionHeader from './SectionHeader.vue'

const MOTHER_INDEX = 2
/** 480px 기준 미세 조정 — inv-ratio로 스케일 */
const FLOWER_OFFSET_RIGHT = 84
const FLOWER_OFFSET_DOWN = 36

const { accounts, side, t } = useInvitationContent()

const activeTab = ref('groom')
const copiedIndex = ref(-1)
const sectionEl = ref(null)
const motherCardEl = ref(null)
const motherAccountEl = ref(null)
const motherCopyEl = ref(null)
const flowerAnchorStyle = ref({})

watch(
  side,
  (newSide) => {
    activeTab.value = newSide
  },
  { immediate: true },
)

const activeAccounts = computed(() => {
  const list = accounts.value
  return activeTab.value === 'groom' ? list.groomSide : list.brideSide
})

function setMotherRef(kind, index, el) {
  if (index !== MOTHER_INDEX) return
  if (kind === 'card') motherCardEl.value = el
  else if (kind === 'account') motherAccountEl.value = el
  else if (kind === 'copy') motherCopyEl.value = el
}

function updateFlowerAnchor() {
  const section = sectionEl.value
  const card = motherCardEl.value
  const account = motherAccountEl.value
  const copy = motherCopyEl.value

  if (!section || !card || !account || !copy) {
    flowerAnchorStyle.value = {}
    return
  }

  const sectionRect = section.getBoundingClientRect()
  const cardRect = card.getBoundingClientRect()
  const accountRect = account.getBoundingClientRect()
  const copyRect = copy.getBoundingClientRect()

  const invRatio = Math.min(window.innerWidth, 480) / 480
  const offsetRight = FLOWER_OFFSET_RIGHT * invRatio
  const offsetDown = FLOWER_OFFSET_DOWN * invRatio

  const anchorX = (accountRect.right + copyRect.left) / 2
  const anchorY = cardRect.bottom

  flowerAnchorStyle.value = {
    '--account-flower-bottom': `${sectionRect.bottom - anchorY - offsetDown}px`,
    '--account-flower-right': `${sectionRect.right - anchorX - offsetRight}px`,
  }
}

let resizeObserver

watch([activeTab, copiedIndex], async () => {
  await nextTick()
  updateFlowerAnchor()
})

onMounted(async () => {
  await nextTick()
  updateFlowerAnchor()

  resizeObserver = new ResizeObserver(() => updateFlowerAnchor())
  if (sectionEl.value) resizeObserver.observe(sectionEl.value)

  window.addEventListener('resize', updateFlowerAnchor, { passive: true })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updateFlowerAnchor)
})

async function copyAccount(item, index) {
  try {
    await navigator.clipboard.writeText(item.accountNumber)
    copiedIndex.value = index
    setTimeout(() => { copiedIndex.value = -1 }, 2000)
    await nextTick()
    updateFlowerAnchor()
  } catch {
    copiedIndex.value = -1
  }
}
</script>

<style scoped>
.account :deep(.section-corner-patterns) {
  z-index: 10;
}

.account :deep(.section-corner-patterns__tr) {
  right: calc(-0.5rem * var(--inv-ratio) + 150px * var(--inv-ratio));
}

.account :deep(.section-corner-patterns__bl) {
  left: auto;
  bottom: var(--account-flower-bottom, calc(-0.25rem * var(--inv-ratio)));
  right: var(--account-flower-right, calc(-0.5rem * var(--inv-ratio)));
  width: calc(12.75rem * var(--inv-ratio) * 0.7);
  max-width: 90%;
  z-index: 2;
  transform: none;
  transform-origin: bottom right;
}

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
  background: #fff;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.account__tab--active {
  border-color: var(--color-primary);
  background: var(--color-accent);
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
  background: #fff;
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
