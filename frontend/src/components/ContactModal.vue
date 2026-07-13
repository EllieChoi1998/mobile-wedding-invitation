<template>
  <Teleport to="body">
    <div v-if="open" class="contact-modal" @click.self="emit('close')">
      <div class="contact-modal__panel" role="dialog" aria-modal="true" :aria-label="t.contactModal.title">
        <button type="button" class="contact-modal__close" :aria-label="t.contactModal.close" @click="emit('close')">
          ✕
        </button>
        <h3 class="contact-modal__title">{{ t.contactModal.title }}</h3>

        <div class="contact-modal__tabs" role="tablist">
          <button
            v-for="tab in tabOrder"
            :key="tab"
            type="button"
            role="tab"
            class="contact-modal__tab"
            :class="{ 'contact-modal__tab--active': activeTab === tab }"
            :aria-selected="activeTab === tab"
            @click="activeTab = tab"
          >
            {{ tab === 'groom' ? t.contactModal.groomTab : t.contactModal.brideTab }}
          </button>
        </div>

        <template v-if="isEnglish">
          <button
            v-if="selectedContact"
            type="button"
            class="contact-modal__back"
            @click="goBack"
          >
            ‹ {{ t.contactModal.back }}
          </button>

          <ul v-if="!selectedContact" class="contact-modal__name-list">
            <li v-for="contact in activeContacts" :key="contact.roleKey">
              <button
                type="button"
                class="contact-modal__name-btn"
                @click="selectContact(contact.roleKey)"
              >
                <LocalizedName
                  :korean="contact.name"
                  :english="contact.englishName"
                />
              </button>
            </li>
          </ul>

          <div v-else class="contact-modal__detail">
            <LocalizedName
              class="contact-modal__detail-name"
              :korean="selectedContact.name"
              :english="selectedContact.englishName"
            />
            <div class="contact-modal__phone-group contact-modal__phone-group--detail">
              <span class="contact-modal__phone">{{ selectedContact.phone }}</span>
              <a
                :href="telHref(selectedContact.phone)"
                class="contact-modal__action contact-modal__action--call"
              >
                {{ t.contactModal.call }}
              </a>
              <button
                type="button"
                class="contact-modal__action contact-modal__action--copy"
                @click="copyPhone(selectedContact.phone, selectedContact.roleKey)"
              >
                {{ copiedRoleKey === selectedContact.roleKey ? t.contactModal.copied : t.contactModal.copy }}
              </button>
            </div>
          </div>
        </template>

        <ul v-else class="contact-modal__list">
          <li v-for="contact in activeContacts" :key="contact.phone" class="contact-modal__item">
            <div class="contact-modal__person">
              <span class="contact-modal__role">{{ contact.role }}</span>
              <span class="contact-modal__name">{{ contact.name }}</span>
            </div>
            <div class="contact-modal__phone-group">
              <span class="contact-modal__phone">{{ contact.phone }}</span>
              <a :href="telHref(contact.phone)" class="contact-modal__action contact-modal__action--call">
                {{ t.contactModal.call }}
              </a>
              <button
                type="button"
                class="contact-modal__action contact-modal__action--copy"
                @click="copyPhone(contact.phone, contact.roleKey)"
              >
                {{ copiedRoleKey === contact.roleKey ? t.contactModal.copied : t.contactModal.copy }}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useInvitationContent } from '../composables/useInvitationContent'
import LocalizedName from './LocalizedName.vue'

const GROOM_ROLE_KEYS = new Set(['groom', 'groomFather', 'groomMother'])
const BRIDE_ROLE_KEYS = new Set(['bride', 'brideFather', 'brideMother'])

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const { contacts, t, isEnglish, side } = useInvitationContent()
const activeTab = ref(side.value)
const copiedRoleKey = ref(null)
const selectedRoleKey = ref(null)

const tabOrder = computed(() =>
  side.value === 'bride' ? ['bride', 'groom'] : ['groom', 'bride'],
)

const activeContacts = computed(() => {
  const roleKeys = activeTab.value === 'groom' ? GROOM_ROLE_KEYS : BRIDE_ROLE_KEYS
  return contacts.value.filter((contact) => roleKeys.has(contact.roleKey))
})

const selectedContact = computed(() =>
  contacts.value.find((contact) => contact.roleKey === selectedRoleKey.value) ?? null,
)

function syncTabToSide() {
  activeTab.value = side.value
}

watch(side, syncTabToSide, { immediate: true })

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      selectedRoleKey.value = null
      copiedRoleKey.value = null
      return
    }
    syncTabToSide()
  },
)

watch(activeTab, () => {
  selectedRoleKey.value = null
  copiedRoleKey.value = null
})

function selectContact(roleKey) {
  selectedRoleKey.value = roleKey
  copiedRoleKey.value = null
}

function goBack() {
  selectedRoleKey.value = null
  copiedRoleKey.value = null
}

function telHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

async function copyPhone(phone, roleKey) {
  const didCopy = await writeClipboard(phone)
  if (!didCopy) return

  copiedRoleKey.value = roleKey
  setTimeout(() => {
    copiedRoleKey.value = null
  }, 2000)
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      return ok
    } catch {
      return false
    }
  }
}
</script>

<style scoped>
.contact-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.45);
}

.contact-modal__panel {
  position: relative;
  width: 100%;
  max-width: min(340px, 92vw);
  max-height: 80vh;
  overflow-y: auto;
  padding: calc(2rem * var(--inv-ratio)) calc(1.5rem * var(--inv-ratio)) calc(1.5rem * var(--inv-ratio));
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 32px rgba(244, 167, 185, 0.25);
}

.contact-modal__close {
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

.contact-modal__title {
  margin: 0 0 0.875rem;
  font-family: var(--font-serif);
  font-size: clamp(1rem, calc(1.125rem * var(--inv-ratio)), 1.125rem);
  font-weight: 600;
  text-align: center;
  color: #333;
}

.contact-modal__tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.contact-modal__tab {
  flex: 1;
  padding: 0.625rem 0.5rem;
  border: 1.5px solid rgba(var(--color-primary-rgb), 0.35);
  border-radius: 10px;
  background: #fff;
  font-size: clamp(0.75rem, calc(0.8125rem * var(--inv-ratio)), 0.8125rem);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.contact-modal__tab--active {
  border-color: var(--color-primary);
  background: var(--color-accent);
  color: var(--color-primary-dark);
  font-weight: 500;
}

.contact-modal__back {
  display: block;
  margin: -0.5rem 0 0.75rem;
  padding: 0;
  border: none;
  background: none;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-primary-dark);
  cursor: pointer;
}

.contact-modal__name-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-modal__name-btn {
  width: 100%;
  padding: calc(0.875rem * var(--inv-ratio)) calc(1rem * var(--inv-ratio));
  border: 1.5px solid rgba(var(--color-primary-rgb), 0.25);
  border-radius: 10px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.contact-modal__name-btn:active {
  background: var(--color-accent);
  border-color: var(--color-primary);
}

.contact-modal__name-btn :deep(.localized-name) {
  line-height: 1.45;
}

.contact-modal__name-btn :deep(.localized-name__ko) {
  font-size: clamp(0.75rem, calc(0.875rem * var(--inv-ratio)), 0.875rem);
  font-weight: 500;
  color: var(--color-text);
}

.contact-modal__name-btn :deep(.localized-name__en) {
  font-size: clamp(0.6875rem, calc(0.75rem * var(--inv-ratio)), 0.75rem);
}

.contact-modal__detail-name {
  font-size: 1rem;
  line-height: 1.5;
}

.contact-modal__detail-name :deep(.localized-name__ko) {
  font-weight: 600;
  color: #333;
}

.contact-modal__detail-name :deep(.localized-name__en) {
  font-size: 0.875rem;
}

.contact-modal__detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0 0.25rem;
  text-align: center;
}

.contact-modal__phone-group--detail {
  width: 100%;
  max-width: 100%;
}

.contact-modal__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.contact-modal__item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: calc(0.75rem * var(--inv-ratio)) 0;
  border-bottom: 1px solid rgba(244, 167, 185, 0.15);
}

.contact-modal__item:last-child {
  border-bottom: none;
}

.contact-modal__person {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  min-width: 0;
}

.contact-modal__role {
  flex-shrink: 0;
  font-size: clamp(0.6875rem, calc(0.75rem * var(--inv-ratio)), 0.75rem);
  color: var(--color-primary);
  white-space: nowrap;
}

.contact-modal__name {
  font-size: clamp(0.8125rem, calc(0.9375rem * var(--inv-ratio)), 0.9375rem);
  font-weight: 500;
  color: var(--color-text);
  min-width: 0;
  line-height: 1.35;
  word-break: keep-all;
}

.contact-modal__phone-group {
  display: flex;
  align-items: stretch;
  width: 100%;
  border: 1px solid rgba(var(--color-primary-rgb), 0.35);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.contact-modal__phone {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  padding: calc(0.3125rem * var(--inv-ratio)) calc(0.4375rem * var(--inv-ratio));
  font-size: clamp(0.625rem, calc(0.6875rem * var(--inv-ratio)), 0.6875rem);
  font-weight: 500;
  color: var(--color-primary-dark);
  background: var(--color-accent);
  white-space: nowrap;
}

.contact-modal__action {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(0.3125rem * var(--inv-ratio)) calc(0.4375rem * var(--inv-ratio));
  border: none;
  border-left: 1px solid rgba(var(--color-primary-rgb), 0.35);
  background: #fff;
  font-size: clamp(0.625rem, calc(0.6875rem * var(--inv-ratio)), 0.6875rem);
  font-weight: 500;
  color: var(--color-primary-dark);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s;
}

.contact-modal__action:active {
  background: var(--color-accent);
}
</style>
