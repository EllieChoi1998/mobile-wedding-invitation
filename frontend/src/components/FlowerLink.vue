<template>
  <section class="flower section section--white">
    <h3 class="flower__title">{{ t.flower.title }}</h3>
    <p class="flower__desc">{{ t.flower.desc }}</p>
    <a
      v-if="flowerDeliveryUrl"
      :href="flowerDeliveryUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="btn-outline flower__link"
    >
      {{ t.flower.button }}
    </a>
  </section>
</template>

<script setup>
import { useInvitationContent } from '../composables/useInvitationContent'

const { flowerDeliveryUrl, t } = useInvitationContent()
</script>

<style scoped>
.flower {
  text-align: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.flower__title {
  margin: 0 0 0.5rem;
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.flower__desc {
  margin: 0 0 1rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.flower__link {
  text-decoration: none;
}
</style>
