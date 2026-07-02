<template>
  <section class="guest-gallery section section--white">
    <FloatingPetals section="guest-gallery" />
    <div class="guest-gallery__top">
      <div class="section__divider" />
      <p class="section__eyebrow">{{ t.guestGallery.eyebrow }}</p>
    </div>

    <div class="guest-gallery__body">
      <div class="guest-gallery__inner">
        <h2 class="section__title">{{ t.guestGallery.title }}</h2>
        <p class="section__desc">{{ t.guestGallery.desc }}</p>

        <div class="guest-gallery__upload">
          <p v-if="uploadStatusLoading" class="guest-gallery__status">{{ t.guestGallery.statusLoading }}</p>
          <template v-else-if="isUploadOpen">
            <label class="guest-gallery__upload-label btn-outline">
              <input
                type="file"
                accept="image/*"
                multiple
                class="guest-gallery__file-input"
                :disabled="uploading"
                @change="onFilesSelected"
              />
              {{ uploadButtonLabel }}
            </label>
            <p v-if="uploadProgress" class="guest-gallery__progress">
              {{ uploadProgressLabel }}
            </p>
            <p v-if="uploadError" class="guest-gallery__message guest-gallery__message--error">{{ uploadError }}</p>
            <p v-if="uploadSuccess" class="guest-gallery__message guest-gallery__message--success">
              {{ uploadSuccessLabel }}
            </p>
            <p class="guest-gallery__note">{{ t.guestGallery.uploadNote }}</p>
          </template>
          <p v-else class="guest-gallery__closed">{{ t.guestGallery.uploadClosed }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useLocale } from '../composables/useLocale'
import { useAppStatus } from '../composables/useAppStatus'
import { requestPresignedUrl, uploadToS3 } from '../api/photos'
import { useSide } from '../composables/useSide'
import FloatingPetals from './FloatingPetals.vue'

const { side } = useSide()
const { t } = useLocale()
const { isUploadOpen, statusLoading: uploadStatusLoading } = useAppStatus()

const uploading = ref(false)
const uploadError = ref('')
const uploadSuccess = ref(false)
const uploadSuccessCount = ref(0)
const uploadProgress = ref(null)

const uploadButtonLabel = computed(() =>
  uploading.value ? t.value.guestGallery.uploadingBusy : t.value.guestGallery.select,
)

const uploadProgressLabel = computed(() => {
  if (!uploadProgress.value) return ''
  return t.value.guestGallery.uploading
    .replace('{current}', String(uploadProgress.value.current))
    .replace('{total}', String(uploadProgress.value.total))
})

const uploadSuccessLabel = computed(() =>
  t.value.guestGallery.uploadSuccess.replace('{count}', String(uploadSuccessCount.value)),
)

async function onFilesSelected(event) {
  const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('image/'))
  event.target.value = ''
  if (files.length === 0) return

  uploading.value = true
  uploadError.value = ''
  uploadSuccess.value = false
  uploadSuccessCount.value = 0
  uploadProgress.value = { current: 0, total: files.length }

  let failed = 0
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    uploadProgress.value = { current: i + 1, total: files.length }
    try {
      const contentType = file.type || 'application/octet-stream'
      const { uploadUrl } = await requestPresignedUrl({
        side: side.value,
        fileName: file.name,
        contentType,
      })
      await uploadToS3(uploadUrl, file, contentType)
      uploadSuccessCount.value += 1
    } catch {
      failed += 1
    }
  }

  uploadProgress.value = null
  uploading.value = false

  if (uploadSuccessCount.value > 0) {
    uploadSuccess.value = true
  }
  if (failed > 0) {
    uploadError.value =
      uploadSuccessCount.value > 0
        ? t.value.guestGallery.uploadPartialError.replace('{failed}', String(failed))
        : t.value.guestGallery.uploadError
  }
}
</script>

<style scoped>
.guest-gallery {
  display: flex;
  flex-direction: column;
}

.guest-gallery__top {
  flex-shrink: 0;
  text-align: center;
}

.guest-gallery__body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.guest-gallery__inner {
  width: 100%;
  text-align: center;
}

.guest-gallery__inner .section__title {
  margin-bottom: 0.5rem;
}

.guest-gallery__inner .section__desc {
  margin-bottom: 1.25rem;
}

.guest-gallery__upload {
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

.guest-gallery__closed {
  margin: 0;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  text-align: center;
  background: var(--color-accent, #fff0f3);
  border-radius: 8px;
}

.guest-gallery__file-input {
  display: none;
}

.guest-gallery__status {
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.guest-gallery__progress {
  margin: 0.75rem 0 0;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-primary-dark);
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
