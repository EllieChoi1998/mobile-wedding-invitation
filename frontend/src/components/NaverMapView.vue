<template>
  <div ref="mapEl" class="naver-map-view" />
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { loadNaverMapSdk } from '../composables/useNaverMapSdk'

const props = defineProps({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  zoom: { type: Number, default: 16 },
})

const emit = defineEmits(['error'])

const mapEl = ref(null)
let map = null

onMounted(async () => {
  try {
    const maps = await loadNaverMapSdk()
    await nextTick()

    const center = new maps.LatLng(props.lat, props.lng)
    map = new maps.Map(mapEl.value, {
      center,
      zoom: props.zoom,
      zoomControl: true,
      scaleControl: false,
      mapDataControl: false,
    })
    new maps.Marker({ position: center, map })
  } catch (error) {
    emit('error', error)
  }
})

onUnmounted(() => {
  map?.destroy()
  map = null
})
</script>

<style scoped>
.naver-map-view {
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.naver-map-view :deep(img) {
  max-width: none;
}
</style>
