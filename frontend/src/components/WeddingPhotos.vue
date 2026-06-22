<template>
  <section class="wedding-photos">
    <h2 class="wedding-photos__title">{{ t.weddingPhotos.title }}</h2>

    <div v-if="photos.length === 0" class="wedding-photos__empty">
      <div class="wedding-photos__placeholder">
        <span class="wedding-photos__placeholder-icon">♥</span>
        <p>{{ t.weddingPhotos.empty }}</p>
        <p v-if="t.weddingPhotos.emptyHint" class="wedding-photos__hint">
          <code>frontend/src/assets/wedding-photos/</code> 폴더에<br />
          이미지를 넣으면 자동으로 표시됩니다.
        </p>
      </div>
    </div>

    <div v-else class="wedding-photos__grid">
      <button
        v-for="(photo, index) in photos"
        :key="photo.name"
        type="button"
        class="wedding-photos__item"
        :class="{ 'wedding-photos__item--featured': index === 0 }"
        @click="openLightbox(index)"
      >
        <img :src="photo.url" :alt="photo.name" class="wedding-photos__image" loading="lazy" />
      </button>
    </div>

    <Teleport to="body">
      <div v-if="lightboxIndex !== null" class="lightbox" @click.self="closeLightbox">
        <button type="button" class="lightbox__close" :aria-label="t.weddingPhotos.close" @click="closeLightbox">
          ✕
        </button>
        <button
          v-if="photos.length > 1"
          type="button"
          class="lightbox__nav lightbox__nav--prev"
          :aria-label="t.weddingPhotos.prev"
          @click.stop="prevPhoto"
        >
          ‹
        </button>
        <img
          :src="photos[lightboxIndex].url"
          :alt="photos[lightboxIndex].name"
          class="lightbox__image"
        />
        <button
          v-if="photos.length > 1"
          type="button"
          class="lightbox__nav lightbox__nav--next"
          :aria-label="t.weddingPhotos.next"
          @click.stop="nextPhoto"
        >
          ›
        </button>
        <p class="lightbox__counter">{{ lightboxIndex + 1 }} / {{ photos.length }}</p>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useWeddingPhotos } from '../composables/useWeddingPhotos'
import { useLocale } from '../composables/useLocale'

const { photos } = useWeddingPhotos()
const { t } = useLocale()
const lightboxIndex = ref(null)

function openLightbox(index) {
  lightboxIndex.value = index
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
.wedding-photos {
  padding: 2.5rem 1.5rem;
  background: var(--color-accent);
}

.wedding-photos__title {
  margin: 0 0 1.25rem;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
  color: var(--color-primary-dark);
}

.wedding-photos__empty {
  display: flex;
  justify-content: center;
}

.wedding-photos__placeholder {
  width: 100%;
  max-width: 320px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  border-radius: 16px;
  background: #fff;
  border: 2px dashed rgba(244, 167, 185, 0.5);
}

.wedding-photos__placeholder-icon {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 2rem;
  color: var(--color-primary);
}

.wedding-photos__placeholder p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.wedding-photos__hint {
  margin-top: 0.75rem !important;
  font-size: 0.75rem !important;
  line-height: 1.6;
}

.wedding-photos__hint code {
  font-size: 0.7rem;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  background: var(--color-accent);
  color: var(--color-primary-dark);
}

.wedding-photos__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.wedding-photos__item {
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

.wedding-photos__item:active {
  transform: scale(0.98);
}

.wedding-photos__item--featured {
  grid-column: span 2;
  aspect-ratio: 4 / 3;
}

.wedding-photos__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.lightbox__nav--prev {
  left: 0.75rem;
}

.lightbox__nav--next {
  right: 0.75rem;
}

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
