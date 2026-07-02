<template>
  <div class="parents-line">
    <div class="parents-line__row hanji-card parents-line__row--groom">
      <span class="parents-line__name">{{ couple.groom.fullName }}</span>
      <span class="parents-line__parents">
        {{ parentsLine.groom.father }} · {{ parentsLine.groom.mother }}{{ t.parentsLine.groomPrefix }}
        {{ t.parentsLine.son }}
      </span>
    </div>
    <span class="parents-line__amp">&</span>
    <div class="parents-line__row hanji-card parents-line__row--bride">
      <span class="parents-line__name">{{ couple.bride.fullName }}</span>
      <span class="parents-line__parents">
        {{ parentsLine.bride.father }} · {{ parentsLine.bride.mother }}{{ t.parentsLine.bridePrefix }}
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
  width: calc(72% - 100px);
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
