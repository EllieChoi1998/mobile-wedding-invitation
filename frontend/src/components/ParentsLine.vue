<template>
  <div class="parents-line">
    <div class="parents-line__row hanji-card parents-line__row--groom">
      <LocalizedName
        class="parents-line__name"
        block
        :korean="couple.groom.fullName"
        :english="couple.groom.englishName"
      />
      <span class="parents-line__parents">
        <LocalizedName :korean="parentsLine.groom.father" :english="parentsLine.groom.fatherEnglish" />
        ·
        <LocalizedName :korean="parentsLine.groom.mother" :english="parentsLine.groom.motherEnglish" />{{ t.parentsLine.groomPrefix }}
        {{ t.parentsLine.son }}
      </span>
    </div>
    <span class="parents-line__amp">&</span>
    <div class="parents-line__row hanji-card parents-line__row--bride">
      <LocalizedName
        class="parents-line__name"
        block
        :korean="couple.bride.fullName"
        :english="couple.bride.englishName"
      />
      <span class="parents-line__parents">
        <LocalizedName :korean="parentsLine.bride.father" :english="parentsLine.bride.fatherEnglish" />
        ·
        <LocalizedName :korean="parentsLine.bride.mother" :english="parentsLine.bride.motherEnglish" />{{ t.parentsLine.bridePrefix }}
        {{ t.parentsLine.daughter }}
      </span>
    </div>
    <button type="button" class="btn-outline parents-line__contact" @click="emit('contact')">
      {{ t.cover.contact }}
    </button>
  </div>
</template>

<script setup>
import { useInvitationContent } from '../composables/useInvitationContent'
import LocalizedName from './LocalizedName.vue'

const emit = defineEmits(['contact'])

const { couple, parentsLine, t } = useInvitationContent()
</script>

<style scoped>
.parents-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
  text-align: center;
}

.parents-line__row {
  width: calc(76% - 85px * var(--inv-ratio));
  padding: 0.75rem 1rem;
  background: #fff;
  box-shadow: 0 2px 12px rgba(var(--color-primary-rgb), 0.12);
}

.parents-line__row--groom {
  align-self: flex-start;
  text-align: left;
}

.parents-line__row--bride {
  align-self: flex-end;
  text-align: right;
}

.parents-line__name {
  display: block;
  margin-bottom: 0.25rem;
  font-family: var(--font-serif);
  font-size: 1.0625rem;
  font-weight: 600;
  color: #333;
}

.parents-line__name :deep(.localized-name__ko) {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
}

.parents-line__name :deep(.localized-name__en) {
  font-family: var(--font-body);
  font-size: 0.75rem;
}

.parents-line__parents {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.parents-line__amp {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--color-primary);
}

.parents-line__contact {
  margin-top: 0.5rem;
}
</style>
