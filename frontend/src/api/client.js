export const API_MISCONFIG_MESSAGE =
  'API가 연결되지 않았습니다. Vercel → Settings → Environment Variables에 VITE_API_BASE_URL(AWS ApiEndpoint)을 설정한 뒤 Redeploy하세요.'

/** @returns {string} */
export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  if (import.meta.env.DEV) return '/api'
  return ''
}

export function isApiConfigured() {
  return Boolean(getApiBaseUrl())
}

function looksLikeHtml(text) {
  const trimmed = text.trimStart()
  return trimmed.toLowerCase().startsWith('<!doctype') || trimmed.startsWith('<')
}

export function parseJsonText(text) {
  if (looksLikeHtml(text)) {
    throw new Error(API_MISCONFIG_MESSAGE)
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('API 응답을 읽을 수 없습니다')
  }
}

export async function parseJsonResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  const text = await response.text()

  if (!contentType.includes('application/json') && looksLikeHtml(text)) {
    throw new Error(API_MISCONFIG_MESSAGE)
  }

  return parseJsonText(text)
}

export async function readApiErrorMessage(response, fallback) {
  const text = await response.text()
  if (looksLikeHtml(text)) {
    throw new Error(API_MISCONFIG_MESSAGE)
  }
  try {
    const body = JSON.parse(text)
    return body.message || fallback
  } catch {
    return text.slice(0, 200) || fallback
  }
}
