<template>
  <div class="section__head">
    <div class="section__divider" />
    <p v-if="eyebrow" class="section__eyebrow">{{ eyebrow }}</p>
    <h2 class="section__title">{{ title }}</h2>
    <p v-if="desc" class="section__desc">{{ desc }}</p>
  </div>
</template>

<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
})
</script>
