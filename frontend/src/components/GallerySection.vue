<template>
  <section class="gallery section section--white">
    <FloatingPetals section="gallery" />
    <SectionHeader :eyebrow="t.gallery.eyebrow" :title="t.gallery.title" />

    <div v-if="photos.length === 0" class="gallery__empty">
      <div class="image-placeholder">
        <span class="image-placeholder__icon">♥</span>
        <p class="image-placeholder__label">{{ t.gallery.empty }}</p>
        <p class="image-placeholder__label">{{ t.gallery.emptyHint }}</p>
      </div>
    </div>

    <div v-else class="gallery__album">
      <button
        type="button"
        class="gallery__cover"
        :aria-label="t.gallery.openPhoto"
        @click="openLightbox(selectedIndex)"
      >
        <img
          :src="photos[selectedIndex].thumbUrl"
          :alt="photos[selectedIndex].name"
          class="gallery__cover-image"
          loading="lazy"
        />
        <span class="gallery__cover-hint">{{ selectedIndex + 1 }} / {{ photos.length }}</span>
      </button>

      <div ref="stripRef" class="gallery__strip" role="list">
        <button
          v-for="(photo, index) in photos"
          :key="photo.name"
          type="button"
          role="listitem"
          class="gallery__thumb"
          :class="{ 'gallery__thumb--active': index === selectedIndex }"
          :aria-label="`${index + 1} / ${photos.length}`"
          :aria-current="index === selectedIndex ? 'true' : undefined"
          @click="selectPhoto(index)"
        >
          <img :src="photo.thumbUrl" :alt="photo.name" class="gallery__thumb-image" loading="lazy" />
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="lightboxIndex !== null"
        class="lightbox"
        @click.self="closeLightbox"
        @touchmove.passive="false"
      >
        <button type="button" class="lightbox__close" :aria-label="t.gallery.close" @click="closeLightbox">✕</button>

        <button
          v-if="photos.length > 1"
          type="button"
          class="lightbox__nav lightbox__nav--prev"
          :aria-label="t.gallery.prev"
          @click.stop="prevPhoto"
        >‹</button>

        <div
          class="lightbox__stage"
          @touchstart.passive="onLightboxTouchStart"
          @touchmove="onLightboxTouchMove"
          @touchend.passive="onLightboxTouchEnd"
        >
          <img
            :key="lightboxIndex"
            :src="photos[lightboxIndex].fullUrl"
            :alt="photos[lightboxIndex].name"
            class="lightbox__image"
            :style="transformStyle"
            draggable="false"
          />
        </div>

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
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useWeddingPhotos } from '../composables/useWeddingPhotos'
import { useInvitationContent } from '../composables/useInvitationContent'
import { usePinchZoom } from '../composables/usePinchZoom'
import FloatingPetals from './FloatingPetals.vue'
import SectionHeader from './SectionHeader.vue'

const { photos } = useWeddingPhotos()
const { t } = useInvitationContent()

const selectedIndex = ref(0)
const lightboxIndex = ref(null)
const stripRef = ref(null)

const {
  isZoomed,
  transformStyle,
  resetZoom,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
} = usePinchZoom()

let swipeStartX = 0
let swipeStartY = 0
let swipeTracking = false

function scrollThumbIntoView(index) {
  nextTick(() => {
    const strip = stripRef.value
    if (!strip) return
    const thumb = strip.children[index]
    if (!(thumb instanceof HTMLElement)) return

    const thumbLeft = thumb.offsetLeft
    const thumbWidth = thumb.offsetWidth
    const stripWidth = strip.clientWidth
    const maxScroll = strip.scrollWidth - stripWidth
    const targetScroll = thumbLeft - (stripWidth - thumbWidth) / 2

    strip.scrollTo({
      left: Math.min(maxScroll, Math.max(0, targetScroll)),
      behavior: 'smooth',
    })
  })
}

function selectPhoto(index) {
  selectedIndex.value = index
  scrollThumbIntoView(index)
}

function openLightbox(index) {
  lightboxIndex.value = index
  selectedIndex.value = index
  document.body.style.overflow = 'hidden'
  scrollThumbIntoView(index)
}

function closeLightbox() {
  lightboxIndex.value = null
  resetZoom()
  document.body.style.overflow = ''
}

function prevPhoto() {
  if (lightboxIndex.value === null) return
  resetZoom()
  const next = (lightboxIndex.value - 1 + photos.value.length) % photos.value.length
  lightboxIndex.value = next
  selectedIndex.value = next
  scrollThumbIntoView(next)
}

function nextPhoto() {
  if (lightboxIndex.value === null) return
  resetZoom()
  const next = (lightboxIndex.value + 1) % photos.value.length
  lightboxIndex.value = next
  selectedIndex.value = next
  scrollThumbIntoView(next)
}

function onLightboxTouchStart(event) {
  onTouchStart(event)
  if (event.touches.length === 1 && !isZoomed.value) {
    swipeStartX = event.touches[0].clientX
    swipeStartY = event.touches[0].clientY
    swipeTracking = true
  } else {
    swipeTracking = false
  }
}

function onLightboxTouchMove(event) {
  onTouchMove(event)
  if (swipeTracking && event.touches.length === 1 && !isZoomed.value) {
    const dx = Math.abs(event.touches[0].clientX - swipeStartX)
    const dy = Math.abs(event.touches[0].clientY - swipeStartY)
    if (dx > dy && dx > 10) event.preventDefault()
  }
}

function onLightboxTouchEnd(event) {
  onTouchEnd(event)
  if (swipeTracking && !isZoomed.value && event.changedTouches.length === 1) {
    const dx = event.changedTouches[0].clientX - swipeStartX
    const dy = event.changedTouches[0].clientY - swipeStartY
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) nextPhoto()
      else prevPhoto()
    }
  }
  swipeTracking = false
}

function onKeydown(event) {
  if (lightboxIndex.value === null) return
  if (event.key === 'Escape') closeLightbox()
  if (event.key === 'ArrowLeft') prevPhoto()
  if (event.key === 'ArrowRight') nextPhoto()
}

watch(lightboxIndex, (index) => {
  if (index !== null) resetZoom()
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.gallery {
  overflow-x: clip;
}

.gallery :deep(.section__head) {
  position: relative;
  z-index: 1;
}

.gallery__empty {
  border-radius: 12px;
  overflow: hidden;
}

.gallery__album {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gallery__cover {
  position: relative;
  margin: 0;
  padding: 0;
  border: none;
  overflow: hidden;
  border-radius: 12px;
  aspect-ratio: 4 / 3;
  cursor: pointer;
  background: #fff;
  box-shadow: 0 4px 20px rgba(244, 167, 185, 0.2);
  transition: transform 0.2s;
}

.gallery__cover:active {
  transform: scale(0.99);
}

.gallery__cover-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery__cover-hint {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
}

.gallery__strip {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  max-width: 100%;
  padding: 0.25rem 0.125rem 0.5rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.gallery__strip::-webkit-scrollbar {
  display: none;
}

.gallery__thumb {
  flex: 0 0 auto;
  width: 4.5rem;
  height: 4.5rem;
  margin: 0;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  scroll-snap-align: center;
  transition: border-color 0.2s, transform 0.2s, opacity 0.2s;
  opacity: 0.7;
}

.gallery__thumb--active {
  border-color: var(--color-primary, #f4a7b9);
  opacity: 1;
  transform: scale(1.04);
}

.gallery__thumb-image {
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
  padding: 3rem 0.5rem;
  background: rgba(0, 0, 0, 0.92);
  touch-action: none;
  overscroll-behavior: contain;
}

.lightbox__stage {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.lightbox__image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
  transform-origin: center center;
  user-select: none;
  -webkit-user-drag: none;
}

.lightbox__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
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
  z-index: 2;
  transform: translateY(-50%);
  width: 2.75rem;
  height: 2.75rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
}

.lightbox__nav--prev { left: 0.5rem; }
.lightbox__nav--next { right: 0.5rem; }

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
