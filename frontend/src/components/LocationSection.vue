<template>
  <section class="location section section--accent">
    <SectionHeader :eyebrow="t.location.eyebrow" :title="t.location.title" />

    <div class="location__venue">
      <h3 class="location__venue-name">{{ wedding.venue }}</h3>
      <p class="location__hall">{{ wedding.hall }}</p>
      <p class="location__address">{{ wedding.address }}</p>
      <button type="button" class="btn-outline location__copy" @click="copyAddress">
        {{ copied ? t.location.copied : t.location.copyAddress }}
      </button>
    </div>

    <div class="location__map">
      <ImageWithPlaceholder
        :src="mapImage"
        alt="venue map"
        :placeholder-label="t.location.mapPlaceholder"
      />
    </div>

    <div class="location__links">
      <a :href="wedding.mapLinks.naver" target="_blank" rel="noopener noreferrer" class="btn-outline">
        {{ t.location.naverMap }}
      </a>
      <a :href="wedding.mapLinks.tmap" target="_blank" rel="noopener noreferrer" class="btn-outline">
        {{ t.location.tmap }}
      </a>
      <a :href="wedding.mapLinks.kakao" target="_blank" rel="noopener noreferrer" class="btn-outline">
        {{ t.location.kakaoMap }}
      </a>
    </div>

    <div class="location__transport">
      <button
        v-for="(item, key) in wedding.transport"
        :key="key"
        type="button"
        class="location__tab"
        :class="{ 'location__tab--active': activeTab === key }"
        @click="activeTab = key"
      >
        {{ item.label }}
      </button>
      <div v-if="activeTransport" class="location__panel">
        <p v-for="(line, i) in activeTransport.lines" :key="i" class="location__line">{{ line }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { resolveAssetImage } from '../composables/useAssetImage'
import { useInvitationContent } from '../composables/useInvitationContent'
import ImageWithPlaceholder from './ImageWithPlaceholder.vue'
import SectionHeader from './SectionHeader.vue'

const { wedding, t } = useInvitationContent()
const activeTab = ref('subway')
const copied = ref(false)

const mapImage = computed(() => resolveAssetImage(wedding.value.mapImagePath))

const activeTransport = computed(() => wedding.value.transport[activeTab.value])

async function copyAddress() {
  try {
    await navigator.clipboard.writeText(wedding.value.address)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    copied.value = false
  }
}
</script>

<style scoped>
.location {
  text-align: center;
}

.location__venue {
  margin-bottom: 1.5rem;
}

.location__venue-name {
  margin: 0 0 0.25rem;
  font-family: var(--font-serif);
  font-size: 1.0625rem;
  font-weight: 600;
  color: #333;
}

.location__hall,
.location__address {
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.location__copy {
  margin-top: 0.75rem;
}

.location__map {
  aspect-ratio: 16 / 10;
  margin-bottom: 1rem;
  border-radius: 12px;
  overflow: hidden;
}

.location__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.location__links .btn-outline {
  padding: 0.625rem 1rem;
  font-size: 0.75rem;
  text-decoration: none;
}

.location__transport {
  text-align: left;
}

.location__tab {
  margin: 0 0.375rem 0.5rem 0;
  padding: 0.5rem 0.875rem;
  border: 1.5px solid rgba(244, 167, 185, 0.35);
  border-radius: 999px;
  background: #fff;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.location__tab--active {
  border-color: var(--color-primary);
  background: var(--color-accent);
  color: var(--color-primary-dark);
}

.location__panel {
  padding: 1rem 1.125rem;
  border-radius: 12px;
  background: #fff;
}

.location__line {
  margin: 0 0 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--color-text);
}

.location__line:last-child {
  margin-bottom: 0;
}
</style>
