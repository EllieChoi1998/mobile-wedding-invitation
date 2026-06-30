let loadPromise = null

export function getNaverMapClientId() {
  return import.meta.env.VITE_NAVER_MAP_CLIENT_ID?.trim() || ''
}

export function loadNaverMapSdk() {
  const clientId = getNaverMapClientId()
  if (!clientId) {
    return Promise.reject(new Error('VITE_NAVER_MAP_CLIENT_ID is not set'))
  }

  if (window.naver?.maps) {
    return Promise.resolve(window.naver.maps)
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      window.navermap_authFailure = () => {
        reject(new Error('Naver Map authentication failed'))
      }

      const script = document.createElement('script')
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`
      script.async = true
      script.onload = () => {
        if (window.naver?.maps) resolve(window.naver.maps)
        else reject(new Error('Naver Maps SDK unavailable'))
      }
      script.onerror = () => reject(new Error('Failed to load Naver Maps SDK'))
      document.head.appendChild(script)
    })
  }

  return loadPromise
}
