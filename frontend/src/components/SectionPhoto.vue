<template>
  <div class="section-photo">
    <ImageWithPlaceholder
      :src="imageSrc"
      :alt="alt"
      :placeholder-label="placeholderLabel"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { resolveAssetImage } from '../composables/useAssetImage'
import ImageWithPlaceholder from './ImageWithPlaceholder.vue'

const props = defineProps({
  imagePath: { type: String, required: true },
  alt: { type: String, default: '' },
  placeholderLabel: { type: String, default: '' },
})

const imageSrc = computed(() => resolveAssetImage(props.imagePath))
</script>

<style scoped>
.section-photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}
</style>
