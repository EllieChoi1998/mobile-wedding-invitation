const optimizedSplashModules = import.meta.glob('../assets/.optimized/splash/*.{webp,WEBP}', {
  eager: true,
  import: 'default',
})

export function useSplashImage() {
  return Object.values(optimizedSplashModules)[0] ?? null
}
