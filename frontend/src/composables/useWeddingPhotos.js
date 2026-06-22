import { computed } from 'vue'

const photoModules = import.meta.glob('../assets/wedding-photos/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', {
  eager: true,
  import: 'default',
})

export function useWeddingPhotos() {
  const photos = computed(() =>
    Object.entries(photoModules)
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([path, url]) => ({
        url,
        name: path.split('/').pop(),
      })),
  )

  return { photos }
}
