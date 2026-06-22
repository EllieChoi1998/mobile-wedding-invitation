<template>
  <header class="invitation-hero section section--hero">
    <p class="invitation-hero__eyebrow">Wedding Invitation</p>
    <h1 class="invitation-hero__names">
      {{ couple.groom.fullName }}
      <span class="invitation-hero__amp">&amp;</span>
      {{ couple.bride.fullName }}
    </h1>
    <p class="invitation-hero__datetime">
      {{ wedding.date }} · {{ wedding.time }}
    </p>
    <p class="invitation-hero__greeting">{{ wedding.greeting }}</p>
  </header>
</template>

<script setup>
import { useInvitationContent } from '../composables/useInvitationContent'

const { couple, wedding } = useInvitationContent()
</script>

<style scoped>
.invitation-hero {
  text-align: center;
}

.invitation-hero__eyebrow {
  margin: 0 0 1.25rem;
  font-size: 0.6875rem;
  letter-spacing: 0.22em;
  color: var(--color-primary-dark);
  text-transform: uppercase;
}

.invitation-hero__names {
  margin: 0 0 0.875rem;
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.45;
  color: #333;
}

.invitation-hero__amp {
  display: inline-block;
  margin: 0 0.4rem;
  font-weight: 400;
  color: var(--color-primary);
}

.invitation-hero__datetime {
  margin: 0 0 1.5rem;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  color: var(--color-primary-dark);
}

.invitation-hero__greeting {
  margin: 0;
  padding: 0 0.25rem;
  font-size: 0.9rem;
  line-height: 1.9;
  white-space: pre-line;
  color: var(--color-text-muted);
}
</style>
