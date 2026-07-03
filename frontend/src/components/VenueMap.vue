<template>
  <div class="venue-map">
    <img
      v-if="imageSrc"
      :src="imageSrc"
      :alt="title"
      class="venue-map__img"
      loading="lazy"
    />
    <NaverMapView
      v-else-if="useNaverMap && !naverFailed"
      :lat="lat"
      :lng="lng"
      @error="naverFailed = true"
    />
    <a
      v-else
      :href="naverLink"
      target="_blank"
      rel="noopener noreferrer"
      class="venue-map__fallback"
      :aria-label="tapHint"
    >
      <img
        :src="staticMapUrl"
        :alt="title"
        class="venue-map__img"
        loading="lazy"
      />
      <span class="venue-map__fallback-hint">{{ tapHint }}</span>
    </a>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getNaverMapClientId } from '../composables/useNaverMapSdk'
import { buildStaticMapUrl } from '../utils/mapLinks'
import NaverMapView from './NaverMapView.vue'

const props = defineProps({
  imageSrc: { type: String, default: null },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  naverLink: { type: String, required: true },
  title: { type: String, default: '예식장 위치' },
  tapHint: { type: String, default: '네이버지도에서 보기' },
})

const naverFailed = ref(false)
const useNaverMap = computed(() => Boolean(getNaverMapClientId()))

const staticMapUrl = computed(() =>
  buildStaticMapUrl(props.lat, props.lng),
)
</script>

<style scoped>
.venue-map {
  width: 100%;
  height: 100%;
  background: #fff;
}

.venue-map__img {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  object-fit: contain;
  object-position: center;
  background: #fff;
}

.venue-map__fallback {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.venue-map__fallback-hint {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  padding: 0.375rem 0.625rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
</style>
