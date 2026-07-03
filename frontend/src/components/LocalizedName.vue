<template>
  <span class="localized-name" :class="{ 'localized-name--block': block }">
    <span class="localized-name__ko">{{ korean }}</span>
    <span v-if="english" class="localized-name__en">{{ english }}</span>
  </span>
</template>

<script setup>
defineProps({
  korean: { type: String, required: true },
  english: { type: String, default: '' },
  block: { type: Boolean, default: false },
})
</script>

<style scoped>
.localized-name {
  display: inline;
}

.localized-name--block {
  display: block;
}

.localized-name__ko {
  display: inline;
}

.localized-name__en {
  display: block;
  margin-top: 0.125rem;
  font-size: 0.8125em;
  font-weight: 400;
  line-height: 1.45;
  color: var(--color-text-muted);
}

.localized-name--block .localized-name__ko {
  display: block;
}
</style>
