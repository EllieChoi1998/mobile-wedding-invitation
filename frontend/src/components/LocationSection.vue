<template>
  <section class="location section section--accent">
    <SectionCornerPatterns />
    <SectionHeader :eyebrow="t.location.eyebrow" :title="t.location.title" />

    <div class="location__venue">
      <h3 class="location__venue-name">
        <LocalizedName block :korean="wedding.venue" :english="wedding.venueEnglish" />
      </h3>
      <p class="location__hall">{{ wedding.hall }}</p>
      <p class="location__address">
        <LocalizedName block :korean="addressDisplayKo" :english="addressDisplayEn" />
      </p>
      <button type="button" class="btn-text location__copy-link" @click="copyAddress">
        {{ copied ? t.location.copied : t.location.copyAddress }}
      </button>
    </div>

    <div class="location__links">
      <a :href="mapLinks.naver" target="_blank" rel="noopener noreferrer" class="btn-outline">
        {{ t.location.naverMap }}
      </a>
      <a
        v-if="isEnglish"
        :href="mapLinks.googleMaps"
        class="btn-outline"
        @click="openGoogleMaps"
      >
        {{ t.location.googleMap }}
      </a>
      <a
        v-else
        :href="mapLinks.tmap"
        class="btn-outline"
        @click="openTmap"
      >
        {{ t.location.tmap }}
      </a>
      <a :href="mapLinks.kakaoRoute" target="_blank" rel="noopener noreferrer" class="btn-outline">
        {{ t.location.kakaoMap }}
      </a>
    </div>

    <div class="location__map">
      <VenueMap
        :image-src="mapImage"
        :lat="wedding.lat"
        :lng="wedding.lng"
        :naver-link="mapLinks.naver"
        :title="wedding.venue"
        :tap-hint="t.location.mapTapHint"
      />
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
      <div v-if="activeTransport" class="location__panel hanji-texture">
        <div class="location__items">
          <template v-for="(entry, i) in displayedTransportLines" :key="i">
            <div v-if="entry.bus" class="location__bus-row">
              <span class="location__bus-type">{{ entry.bus.label }}</span>
              <div class="location__bus-nums">
                <span
                  v-for="(num, j) in entry.bus.numbers"
                  :key="`${i}-${j}`"
                  class="location__bus-num"
                >
                  {{ num }}
                </span>
              </div>
            </div>

            <p
              v-else
              class="location__line"
              :class="{
                'location__line--header': entry.isHeader,
                'location__line--route': entry.isRoute,
              }"
            >
              <span v-if="entry.isHeader" class="location__line-dot" aria-hidden="true">♥</span>
              <template v-for="(segment, j) in entry.segments" :key="`${i}-${j}`">
                <span v-if="segment.type === 'arrow'" class="location__route-arrow" aria-hidden="true">›</span>
                <strong v-else-if="segment.bold" class="location__line-bold">{{ segment.text }}</strong>
                <template v-else>{{ segment.text }}</template>
              </template>
            </p>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { resolveAssetImage } from '../composables/useAssetImage'
import { useInvitationContent } from '../composables/useInvitationContent'
import { buildMapLinks } from '../utils/mapLinks'
import VenueMap from './VenueMap.vue'
import SectionCornerPatterns from './SectionCornerPatterns.vue'
import SectionHeader from './SectionHeader.vue'
import LocalizedName from './LocalizedName.vue'

const { wedding, t, isEnglish } = useInvitationContent()
const activeTab = ref('subway')
const copied = ref(false)

const mapImage = computed(() => resolveAssetImage(wedding.value.mapImagePath))

const addressMain = computed(() => {
  const addr = wedding.value.address ?? ''
  const idx = addr.indexOf(' (')
  return idx >= 0 ? addr.slice(0, idx) : addr
})

const addressDisplayKo = computed(() => {
  const main = addressMain.value
  const copy = wedding.value.addressCopy
  return copy ? `${main} (${copy})` : main
})

const addressDisplayEn = computed(() => {
  const main = wedding.value.addressEnglish
  const copy = wedding.value.addressCopyEnglish
  if (!main) return ''
  return copy ? `${main} (${copy})` : main
})

const mapLinks = computed(() =>
  buildMapLinks({
    venue: wedding.value.venue,
    address: wedding.value.address,
    lat: wedding.value.lat,
    lng: wedding.value.lng,
  }),
)

function openTmap(event) {
  event.preventDefault()
  const { tmap, kakaoRoute } = mapLinks.value
  window.location.href = tmap
  window.setTimeout(() => {
    if (document.visibilityState === 'visible') {
      window.open(kakaoRoute, '_blank', 'noopener,noreferrer')
    }
  }, 1500)
}

function openGoogleMaps(event) {
  event.preventDefault()
  const { googleMapsApp, googleMaps } = mapLinks.value
  window.location.href = googleMapsApp
  window.setTimeout(() => {
    if (document.visibilityState === 'visible') {
      window.open(googleMaps, '_blank', 'noopener,noreferrer')
    }
  }, 1500)
}

const activeTransport = computed(() => wedding.value.transport[activeTab.value])

const displayedTransportLines = computed(() => {
  const transport = activeTransport.value
  if (!transport) return []
  return transport.lines.map((line) => {
    const bus = parseBusLine(line)
    return {
      bus,
      isHeader: !bus && isHeaderLine(line),
      isRoute: !bus && isRouteLine(line),
      segments: bus ? [] : parseRouteSegments(line),
    }
  })
})

function parseBoldLine(line) {
  const parts = []
  const regex = /<bold>(.*?)<\/bold>/g
  let lastIndex = 0
  let match = regex.exec(line)

  while (match) {
    if (match.index > lastIndex) {
      parts.push({ text: line.slice(lastIndex, match.index), bold: false })
    }
    parts.push({ text: match[1], bold: true })
    lastIndex = regex.lastIndex
    match = regex.exec(line)
  }

  if (lastIndex < line.length) {
    parts.push({ text: line.slice(lastIndex), bold: false })
  }

  if (parts.length === 0) {
    parts.push({ text: line, bold: false })
  }

  return parts
}

function isHeaderLine(line) {
  const trimmed = line.trim()
  return /^<bold>[^<]+<\/bold>$/.test(trimmed) && !trimmed.includes('>')
}

function isRouteLine(line) {
  return line.includes('>')
}

function parseRouteSegments(line) {
  const segments = []
  for (const part of parseBoldLine(line)) {
    if (part.bold) {
      segments.push({ type: 'text', text: part.text, bold: true })
      continue
    }
    const chunks = part.text.split(/\s*>\s*/)
    chunks.forEach((chunk, index) => {
      if (chunk) {
        segments.push({ type: 'text', text: chunk, bold: false })
      }
      if (index < chunks.length - 1) {
        segments.push({ type: 'arrow' })
      }
    })
  }
  return segments
}

function parseBusLine(line) {
  const match = line.match(/^(간 선|지 선|직 행|Main|Branch|Express)\s+(.+)$/)
  if (!match) return null
  return {
    label: match[1],
    numbers: match[2].split(/,\s*/),
  }
}

async function copyAddress() {
  try {
    await navigator.clipboard.writeText(wedding.value.addressCopy)
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

.location :deep(.section-corner-patterns__bl) {
  top: calc(4.75rem * var(--inv-ratio) - 20px * var(--inv-ratio));
  bottom: auto;
  left: auto;
  right: calc(50% - 35px * var(--inv-ratio));
  transform: scale(0.7);
  transform-origin: right center;
}

.location :deep(.section-corner-patterns__tr) {
  top: calc(4.75rem * var(--inv-ratio) - 85px * var(--inv-ratio));
  right: auto;
  left: calc(50% - 85px * var(--inv-ratio));
  transform: scale(1.092) rotate(15deg);
  transform-origin: left center;
}

.location__venue {
  margin-bottom: 1rem;
}

.location__venue-name {
  margin: 0 0 0.375rem;
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-event-datetime);
  letter-spacing: 0.01em;
}

.location__venue-name :deep(.localized-name__ko) {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
}

.location__venue-name :deep(.localized-name__en) {
  font-family: var(--font-body);
  font-size: 0.8rem;
  letter-spacing: 0;
}

.location__hall,
.location__address {
  margin: 0 0 0.5rem;
  font-size: var(--font-size-event-venue);
  font-weight: 500;
  line-height: 1.6;
  color: var(--color-event-venue);
}

.location__address {
  margin-bottom: 0.375rem;
}

.location__address-note {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.location__copy-link {
  margin-top: 0.125rem;
  font-size: 0.75rem;
}

.location__links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.location__links .btn-outline {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.5rem 0.375rem;
  font-size: 0.75rem;
  line-height: 1.3;
  text-align: center;
  text-decoration: none;
}

.location__map {
  position: relative;
  width: 100%;
  aspect-ratio: 1403 / 752;
  margin-bottom: 1rem;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.location__map :deep(.venue-map) {
  position: absolute;
  inset: 0;
  min-height: 0;
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
  padding: 1rem;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 14px rgba(var(--color-primary-rgb), 0.1);
}

.location__items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.location__line {
  margin: 0;
  padding: 0.625rem 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.65;
  color: var(--color-text);
  border-radius: 10px;
  background: rgba(var(--color-primary-rgb), 0.06);
}

.location__line--header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-accent);
  font-weight: 600;
  text-align: left;
}

.location__line--route {
  background: #fff;
  border: 1px solid rgba(var(--color-primary-rgb), 0.18);
  box-shadow: 0 1px 6px rgba(var(--color-primary-rgb), 0.06);
}

.location__line-dot {
  flex-shrink: 0;
  font-size: 0.625rem;
  color: var(--color-primary);
}

.location__line-bold {
  font-weight: 600;
  color: var(--color-primary-dark);
}

.location__route-arrow {
  margin: 0 0.2rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
}

.location__bus-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border-radius: 10px;
  background: #fff;
  border: 1px solid rgba(var(--color-primary-rgb), 0.18);
}

.location__bus-type {
  flex-shrink: 0;
  min-width: 2.25rem;
  padding: 0.2rem 0.45rem;
  border-radius: 6px;
  background: var(--color-primary-dark);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-align: center;
  line-height: 1.4;
}

.location__bus-nums {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.location__bus-num {
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: var(--color-accent);
  border: 1px solid rgba(var(--color-primary-rgb), 0.25);
  font-size: 0.6875rem;
  font-weight: 500;
  color: #555;
  line-height: 1.4;
}
</style>
