const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`)
  }
  return data
}

export async function submitGuestbook({ authorName, message, side }) {
  const body = { authorName, message }
  if (side) body.side = side

  const response = await fetch(`${API_BASE}/guestbook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return parseResponse(response)
}

export async function listGuestbook({ limit = 20, cursor } = {}) {
  const params = new URLSearchParams({ limit: String(limit) })
  if (cursor) params.set('cursor', cursor)

  const response = await fetch(`${API_BASE}/guestbook?${params}`)
  return parseResponse(response)
}
