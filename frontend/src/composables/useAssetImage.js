const optimizedModules = import.meta.glob('../assets/.optimized/**/*.{webp,WEBP}', {
  eager: true,
  import: 'default',
})

const assetModules = import.meta.glob(
  [
    '../assets/cover/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
    '../assets/about/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
    '../assets/sections/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
    '../assets/location/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  ],
  {
    eager: true,
    import: 'default',
  },
)

function normalizePath(relativePath) {
  return relativePath.replace(/^assets\//, '').replace(/^\.\.\/assets\//, '')
}

function pathToKey(path) {
  const match = path.match(/assets\/(.+)$/)
  return match?.[1] ?? path
}

const assetMap = Object.fromEntries(
  Object.entries(assetModules).map(([path, url]) => [pathToKey(path), url]),
)

const optimizedMap = Object.fromEntries(
  Object.entries(optimizedModules).map(([path, url]) => {
    const key = pathToKey(path).replace(/^\.optimized\//, '')
    const withoutExt = key.replace(/\.[^.]+$/, '')
    return [withoutExt, url]
  }),
)

export function resolveAssetImage(relativePath) {
  if (!relativePath) return null
  const normalized = normalizePath(relativePath)
  const withoutExt = normalized.replace(/\.[^.]+$/, '')
  return optimizedMap[withoutExt] ?? assetMap[normalized] ?? null
}

export function useAssetImage(relativePath) {
  return resolveAssetImage(relativePath)
}
