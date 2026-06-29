<template>
  <section class="gallery section section--accent">
    <SectionHeader :eyebrow="t.gallery.eyebrow" :title="t.gallery.title" />

    <div v-if="photos.length === 0" class="gallery__empty">
      <div class="image-placeholder">
        <span class="image-placeholder__icon">♥</span>
        <p class="image-placeholder__label">{{ t.gallery.empty }}</p>
        <p class="image-placeholder__label">{{ t.gallery.emptyHint }}</p>
      </div>
    </div>

    <div v-else class="gallery__grid">
      <button
        v-for="(photo, index) in visiblePhotos"
        :key="photo.name"
        type="button"
        class="gallery__item"
        :class="{ 'gallery__item--featured': index === 0 && !showAll }"
        @click="openLightbox(photo)"
      >
        <img :src="photo.url" :alt="photo.name" class="gallery__image" loading="lazy" />
      </button>
    </div>

    <button
      v-if="photos.length > initialCount"
      type="button"
      class="btn-text gallery__more"
      @click="showAll = !showAll"
    >
      {{ showAll ? t.interview.showLess : t.gallery.showMore }}
    </button>

    <Teleport to="body">
      <div v-if="lightboxIndex !== null" class="lightbox" @click.self="closeLightbox">
        <button type="button" class="lightbox__close" :aria-label="t.gallery.close" @click="closeLightbox">✕</button>
        <button
          v-if="photos.length > 1"
          type="button"
          class="lightbox__nav lightbox__nav--prev"
          :aria-label="t.gallery.prev"
          @click.stop="prevPhoto"
        >‹</button>
        <img :src="photos[lightboxIndex].url" :alt="photos[lightboxIndex].name" class="lightbox__image" />
        <button
          v-if="photos.length > 1"
          type="button"
          class="lightbox__nav lightbox__nav--next"
          :aria-label="t.gallery.next"
          @click.stop="nextPhoto"
        >›</button>
        <p class="lightbox__counter">{{ lightboxIndex + 1 }} / {{ photos.length }}</p>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useWeddingPhotos } from '../composables/useWeddingPhotos'
import { useInvitationContent } from '../composables/useInvitationContent'
import SectionHeader from './SectionHeader.vue'

const { photos } = useWeddingPhotos()
const { t } = useInvitationContent()

const initialCount = 6
const showAll = ref(false)
const lightboxIndex = ref(null)

const visiblePhotos = computed(() =>
  showAll.value ? photos.value : photos.value.slice(0, initialCount),
)

function openLightbox(photo) {
  const index = photos.value.findIndex((p) => p.name === photo.name)
  lightboxIndex.value = index >= 0 ? index : 0
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxIndex.value = null
  document.body.style.overflow = ''
}

function prevPhoto() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value - 1 + photos.value.length) % photos.value.length
}

function nextPhoto() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % photos.value.length
}

function onKeydown(event) {
  if (lightboxIndex.value === null) return
  if (event.key === 'Escape') closeLightbox()
  if (event.key === 'ArrowLeft') prevPhoto()
  if (event.key === 'ArrowRight') nextPhoto()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.gallery__empty {
  border-radius: 12px;
  overflow: hidden;
}

.gallery__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.gallery__item {
  margin: 0;
  padding: 0;
  border: none;
  overflow: hidden;
  border-radius: 10px;
  aspect-ratio: 1;
  cursor: pointer;
  background: #fff;
  box-shadow: 0 2px 10px rgba(244, 167, 185, 0.15);
  transition: transform 0.2s;
}

.gallery__item:active {
  transform: scale(0.98);
}

.gallery__item--featured {
  grid-column: span 2;
  aspect-ratio: 4 / 3;
}

.gallery__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery__more {
  display: block;
  margin: 1.5rem auto 0;
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background: rgba(0, 0, 0, 0.88);
}

.lightbox__image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.lightbox__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
}

.lightbox__nav--prev { left: 0.75rem; }
.lightbox__nav--next { right: 0.75rem; }

.lightbox__counter {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.75);
}
</style>
