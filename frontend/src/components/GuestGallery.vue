<template>
  <section class="guest-gallery section section--white">
    <SectionHeader
      :eyebrow="t.guestGallery.eyebrow"
      :title="t.guestGallery.title"
      :desc="t.guestGallery.desc"
    />

    <div class="guest-gallery__upload">
      <label class="guest-gallery__upload-label btn-outline">
        <input
          type="file"
          accept="image/*"
          class="guest-gallery__file-input"
          :disabled="uploading"
          @change="onFileSelected"
        />
        {{ uploading ? t.guestGallery.uploading : t.guestGallery.select }}
      </label>
      <p v-if="uploadError" class="guest-gallery__message guest-gallery__message--error">{{ uploadError }}</p>
      <p v-if="uploadSuccess" class="guest-gallery__message guest-gallery__message--success">
        {{ t.guestGallery.uploadSuccess }}
      </p>
      <p class="guest-gallery__note">{{ t.guestGallery.uploadNote }}</p>
    </div>

    <div v-if="loading" class="guest-gallery__status">{{ t.guestGallery.loading }}</div>
    <div v-else-if="loadError" class="guest-gallery__message guest-gallery__message--error">{{ loadError }}</div>
    <ul v-else class="guest-gallery__grid">
      <li v-for="photo in photos" :key="photo.photoId" class="guest-gallery__item">
        <img :src="photo.viewUrl" :alt="photo.fileName" class="guest-gallery__image" loading="lazy" />
      </li>
    </ul>
    <p v-if="!loading && !loadError && photos.length === 0" class="guest-gallery__status">
      {{ t.guestGallery.empty }}
    </p>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSide } from '../composables/useSide'
import { useLocale } from '../composables/useLocale'
import { listPhotos, requestPresignedUrl, uploadToS3 } from '../api/photos'
import SectionHeader from './SectionHeader.vue'

const { side } = useSide()
const { t } = useLocale()

const photos = ref([])
const loading = ref(false)
const loadError = ref('')
const uploading = ref(false)
const uploadError = ref('')
const uploadSuccess = ref(false)

async function fetchPhotos() {
  loading.value = true
  loadError.value = ''
  try {
    const data = await listPhotos(side.value)
    photos.value = data.photos ?? []
  } catch (err) {
    loadError.value = err.message || t.value.guestGallery.loadError
    photos.value = []
  } finally {
    loading.value = false
  }
}

async function onFileSelected(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  uploading.value = true
  uploadError.value = ''
  uploadSuccess.value = false

  try {
    const { uploadUrl } = await requestPresignedUrl({
      side: side.value,
      fileName: file.name,
      contentType: file.type || 'application/octet-stream',
    })
    await uploadToS3(uploadUrl, file, file.type || 'application/octet-stream')
    uploadSuccess.value = true
    await fetchPhotos()
  } catch (err) {
    uploadError.value = err.message || t.value.guestGallery.uploadError
  } finally {
    uploading.value = false
  }
}

watch(side, fetchPhotos, { immediate: true })
</script>

<style scoped>
.guest-gallery__upload {
  margin-bottom: 1.75rem;
  text-align: center;
}

.guest-gallery__upload-label {
  display: inline-block;
  cursor: pointer;
}

.guest-gallery__note {
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-align: center;
}

.guest-gallery__file-input {
  display: none;
}

.guest-gallery__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.guest-gallery__item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(244, 167, 185, 0.12);
}

.guest-gallery__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.guest-gallery__status {
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.guest-gallery__message {
  margin: 0.75rem 0 0;
  text-align: center;
  font-size: 0.8125rem;
}

.guest-gallery__message--error {
  color: #c0392b;
}

.guest-gallery__message--success {
  color: var(--color-primary-dark);
}
</style>
