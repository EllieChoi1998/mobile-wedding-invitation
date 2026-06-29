const assetModules = import.meta.glob('../assets/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
})

function normalizePath(relativePath) {
  return relativePath.replace(/^assets\//, '').replace(/^\.\.\/assets\//, '')
}

const assetMap = Object.fromEntries(
  Object.entries(assetModules).map(([path, url]) => {
    const match = path.match(/assets\/(.+)$/)
    return [match?.[1] ?? path, url]
  }),
)

export function resolveAssetImage(relativePath) {
  if (!relativePath) return null
  const normalized = normalizePath(relativePath)
  return assetMap[normalized] ?? null
}

export function useAssetImage(relativePath) {
  return resolveAssetImage(relativePath)
}
