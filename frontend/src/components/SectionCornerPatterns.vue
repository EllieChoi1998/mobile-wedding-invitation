<template>
  <div class="section-corner-patterns" aria-hidden="true">
    <img
      v-if="showTopRight"
      class="section-corner-patterns__tr"
      :class="{ 'section-corner-patterns__tr--header': topRightPlacement === 'header' }"
      :src="topRightSrc"
      alt=""
    />
    <img v-if="showBottomLeft" class="section-corner-patterns__bl" :src="flowerBottomLeft" alt="" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import flower2 from '../assets/patterns/꽃2.svg'
import flower1 from '../assets/patterns/꽃1.svg'

const props = defineProps({
  showTopRight: { type: Boolean, default: true },
  showBottomLeft: { type: Boolean, default: true },
  topRightPlacement: {
    type: String,
    default: 'corner',
    validator: (value) => ['corner', 'header'].includes(value),
  },
  topRightFlower: {
    type: String,
    default: '2',
    validator: (value) => ['1', '2'].includes(value),
  },
})

const topRightSrc = computed(() => (props.topRightFlower === '1' ? flower1 : flower2))
const flowerBottomLeft = flower1
</script>

<style scoped>
.section-corner-patterns {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.section-corner-patterns__tr {
  position: absolute;
  top: calc(-0.25rem * var(--inv-ratio));
  right: calc(-0.5rem * var(--inv-ratio));
  width: calc(14.25rem * var(--inv-ratio));
  max-width: 96%;
  opacity: 0.9;
}

.section-corner-patterns__tr--header {
  top: calc(4.75rem * var(--inv-ratio));
}

.section-corner-patterns__bl {
  position: absolute;
  bottom: calc(-0.25rem * var(--inv-ratio));
  left: calc(-0.5rem * var(--inv-ratio));
  width: calc(12.75rem * var(--inv-ratio));
  max-width: 90%;
  opacity: 0.9;
}
</style>
