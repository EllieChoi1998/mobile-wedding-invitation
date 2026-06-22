const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

async function handleResponse(response) {
  if (!response.ok) {
    let message = `API error: ${response.status}`
    try {
      const body = await response.json()
      message = body.message || message
    } catch {
      const text = await response.text()
      if (text) message = text
    }
    throw new Error(message)
  }
  return response.json()
}

export async function submitRsvp({ guestName, side, attending }) {
  const response = await fetch(`${API_BASE_URL}/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guestName, side, attending }),
  })
  return handleResponse(response)
}
