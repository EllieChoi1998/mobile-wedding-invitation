import { getApiBaseUrl, parseJsonResponse, readApiErrorMessage } from './client.js'

async function handleResponse(response) {
  if (!response.ok) {
    const message = await readApiErrorMessage(response, `Request failed (${response.status})`)
    throw new Error(message)
  }
  return parseJsonResponse(response)
}

export async function submitGuestbook({ authorName, message, side }) {
  const body = { authorName, message }
  if (side) body.side = side

  const response = await fetch(`${getApiBaseUrl()}/guestbook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return handleResponse(response)
}

export async function listGuestbook({ limit = 20, cursor } = {}) {
  const params = new URLSearchParams({ limit: String(limit) })
  if (cursor) params.set('cursor', cursor)

  const response = await fetch(`${getApiBaseUrl()}/guestbook?${params}`)
  return handleResponse(response)
}
