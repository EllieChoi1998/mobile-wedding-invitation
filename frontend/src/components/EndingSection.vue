<template>
  <footer class="ending section section--accent">
    <div class="ending__photo">
      <ImageWithPlaceholder
        :src="endingImage"
        alt="ending"
        :placeholder-label="t.ending.endingPhotoHint"
      />
    </div>

    <p class="ending__message">{{ t.ending.title }}</p>
    <p class="ending__names">
      {{ couple.groom.fullName }}
      <span class="ending__amp">&amp;</span>
      {{ couple.bride.fullName }}
    </p>

    <div class="ending__share">
      <button v-if="kakaoReady" type="button" class="btn-primary ending__share-btn" @click="shareKakao">
        {{ t.ending.shareKakao }}
      </button>
      <button type="button" class="btn-outline ending__share-btn" @click="copyLink">
        {{ copied ? t.ending.copied : t.ending.shareCopy }}
      </button>
    </div>

    <p class="ending__copyright">© {{ year }} {{ couple.groom.fullName }} · {{ couple.bride.fullName }} {{ t.ending.copyright }}</p>
  </footer>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { resolveAssetImage } from '../composables/useAssetImage'
import { useInvitationContent } from '../composables/useInvitationContent'
import ImageWithPlaceholder from './ImageWithPlaceholder.vue'

const { couple, assets, share, t } = useInvitationContent()

const kakaoReady = ref(false)
const copied = ref(false)
const year = new Date().getFullYear()

const endingImage = computed(() => resolveAssetImage(assets.endingPhoto))

function loadKakaoSdk() {
  const key = import.meta.env.VITE_KAKAO_JS_KEY
  if (!key || window.Kakao) return

  const script = document.createElement('script')
  script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'
  script.crossOrigin = 'anonymous'
  script.onload = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(key)
      kakaoReady.value = true
    }
  }
  document.head.appendChild(script)
}

function shareKakao() {
  if (!window.Kakao?.Share) return
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `${couple.groom.fullName} ♥ ${couple.bride.fullName}`,
      description: share.defaultMessage,
      link: {
        mobileWebUrl: window.location.href,
        webUrl: window.location.href,
      },
    },
    buttons: [
      {
        title: '청첩장 보기',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    ],
  })
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    copied.value = false
  }
}

onMounted(loadKakaoSdk)
</script>

<style scoped>
.ending {
  text-align: center;
  padding-bottom: 3rem;
}

.ending__photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
}

.ending__message {
  margin: 0 0 1rem;
  font-family: var(--font-serif);
  font-size: 0.9375rem;
  line-height: 1.8;
  white-space: pre-line;
  color: var(--color-text);
}

.ending__names {
  margin: 0 0 1.5rem;
  font-family: var(--font-serif);
  font-size: 1.0625rem;
  font-weight: 600;
  color: #333;
}

.ending__amp {
  margin: 0 0.35rem;
  color: var(--color-primary);
}

.ending__share {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  align-items: center;
  margin-bottom: 2rem;
}

.ending__share-btn {
  width: 100%;
  max-width: 280px;
}

.ending__copyright {
  margin: 0;
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}
</style>
