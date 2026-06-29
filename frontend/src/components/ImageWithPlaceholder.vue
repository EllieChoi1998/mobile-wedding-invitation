<template>
  <div class="image-with-placeholder" :class="wrapperClass">
    <img v-if="src" :src="src" :alt="alt" class="image-with-placeholder__img" :loading="loading" />
    <div v-else class="image-placeholder">
      <span class="image-placeholder__icon">📷</span>
      <p class="image-placeholder__label">{{ placeholderLabel }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  src: { type: String, default: null },
  alt: { type: String, default: '' },
  placeholderLabel: { type: String, default: '이미지를 추가해 주세요' },
  loading: { type: String, default: 'lazy' },
  wrapperClass: { type: String, default: '' },
})
</script>

<style scoped>
.image-with-placeholder {
  width: 100%;
  overflow: hidden;
}

.image-with-placeholder__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
