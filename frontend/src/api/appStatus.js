import { getApiBaseUrl, parseJsonResponse, readApiErrorMessage } from './client.js'

async function handleResponse(response) {
  if (!response.ok) {
    const message = await readApiErrorMessage(response, `API error: ${response.status}`)
    throw new Error(message)
  }
  return parseJsonResponse(response)
}

export async function getAppStatus() {
  const response = await fetch(`${getApiBaseUrl()}/photos/upload-status`)
  return handleResponse(response)
}
