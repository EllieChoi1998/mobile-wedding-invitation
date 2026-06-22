<template>
  <div class="invitation">
    <SideSync />
    <WeddingInfo />
    <WeddingPhotos />
    <RsvpForm />

    <section class="guest-gallery">
      <h2 class="guest-gallery__title">하객 사진 갤러리</h2>
      <p class="guest-gallery__hint">{{ sideInfo.label }} 사진을 업로드하고 함께 나눠보세요.</p>

      <div class="guest-gallery__upload">
        <label class="guest-gallery__upload-label">
          <input
            type="file"
            accept="image/*"
            class="guest-gallery__file-input"
            :disabled="uploading"
            @change="onFileSelected"
          />
          {{ uploading ? '업로드 중...' : '사진 선택하기' }}
        </label>
        <p v-if="uploadError" class="guest-gallery__error">{{ uploadError }}</p>
        <p v-if="uploadSuccess" class="guest-gallery__success">사진이 업로드되었습니다!</p>
      </div>

      <div v-if="loading" class="guest-gallery__loading">사진을 불러오는 중...</div>
      <div v-else-if="loadError" class="guest-gallery__error">{{ loadError }}</div>
      <ul v-else class="guest-gallery__grid">
        <li v-for="photo in photos" :key="photo.photoId" class="guest-gallery__item">
          <img :src="photo.viewUrl" :alt="photo.fileName" class="guest-gallery__image" loading="lazy" />
        </li>
      </ul>
      <p v-if="!loading && !loadError && photos.length === 0" class="guest-gallery__empty">
        아직 업로드된 사진이 없습니다.
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import SideSync from '../components/SideSync.vue'
import WeddingInfo from '../components/WeddingInfo.vue'
import WeddingPhotos from '../components/WeddingPhotos.vue'
import RsvpForm from '../components/RsvpForm.vue'
import { useSide } from '../composables/useSide'
import { listPhotos, requestPresignedUrl, uploadToS3 } from '../api/photos'

const { side, sideInfo } = useSide()

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
    loadError.value = err.message || '사진을 불러오지 못했습니다.'
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
    uploadError.value = err.message || '업로드에 실패했습니다.'
  } finally {
    uploading.value = false
  }
}

watch(side, fetchPhotos, { immediate: true })
</script>

<style scoped>
.invitation {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background: #fff;
  box-shadow: 0 0 40px rgba(244, 167, 185, 0.12);
}

.guest-gallery {
  padding: 2.5rem 1.5rem 3rem;
  background: var(--color-accent);
}

.guest-gallery__title {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
  color: var(--color-primary-dark);
}

.guest-gallery__hint {
  margin: 0 0 1.5rem;
  font-size: 0.8125rem;
  text-align: center;
  color: var(--color-text-muted);
}

.guest-gallery__upload {
  margin-bottom: 2rem;
  text-align: center;
}

.guest-gallery__upload-label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
}

.guest-gallery__upload-label:hover {
  background: var(--color-primary-dark);
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
  box-shadow: 0 2px 8px rgba(244, 167, 185, 0.15);
}

.guest-gallery__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.guest-gallery__loading,
.guest-gallery__empty {
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.guest-gallery__error {
  margin-top: 0.75rem;
  text-align: center;
  color: #c0392b;
  font-size: 0.8125rem;
}

.guest-gallery__success {
  margin-top: 0.75rem;
  text-align: center;
  color: var(--color-primary-dark);
  font-size: 0.8125rem;
}
</style>
