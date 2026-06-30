import { computed } from 'vue'

const thumbModules = import.meta.glob('../assets/wedding-photos/optimized/*-thumb.webp', {
  eager: true,
  import: 'default',
})

const fullModules = import.meta.glob('../assets/wedding-photos/optimized/*-full.webp', {
  eager: true,
  import: 'default',
})

function baseNameFromPath(path, suffix) {
  const file = path.split('/').pop()
  return file.replace(new RegExp(`${suffix}\\.webp$`), '')
}

export function useWeddingPhotos() {
  const photos = computed(() => {
    const entries = Object.entries(fullModules).map(([path, fullUrl]) => {
      const base = baseNameFromPath(path, '-full')
      const thumbPath = Object.keys(thumbModules).find((p) => baseNameFromPath(p, '-thumb') === base)
      return {
        name: `${base}.webp`,
        thumbUrl: thumbPath ? thumbModules[thumbPath] : fullUrl,
        fullUrl,
      }
    })

    return entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
  })

  return { photos }
}
