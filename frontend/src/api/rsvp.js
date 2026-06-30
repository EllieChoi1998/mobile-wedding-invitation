import { getApiBaseUrl, parseJsonResponse, readApiErrorMessage } from './client.js'

async function handleResponse(response) {
  if (!response.ok) {
    const message = await readApiErrorMessage(response, `API error: ${response.status}`)
    throw new Error(message)
  }
  return parseJsonResponse(response)
}

export async function submitRsvp({ guestName, side, attending }) {
  const response = await fetch(`${getApiBaseUrl()}/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guestName, side, attending }),
  })
  return handleResponse(response)
}
