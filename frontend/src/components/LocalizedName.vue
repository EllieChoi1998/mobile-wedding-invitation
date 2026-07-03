<template>
  <span class="localized-name" :class="{ 'localized-name--block': block }">
    <span class="localized-name__ko">{{ korean }}</span>
    <template v-if="english">
      <span class="localized-name__sep" aria-hidden="true">·</span>
      <span class="localized-name__en">{{ english }}</span>
    </template>
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

.localized-name__ko,
.localized-name__en,
.localized-name__sep {
  display: inline;
}

.localized-name__sep {
  margin: 0 0.3em;
  font-weight: 400;
  color: var(--color-text-muted);
}

.localized-name__en {
  font-size: 0.8125em;
  font-weight: 400;
  line-height: inherit;
  color: var(--color-text-muted);
}
</style>
