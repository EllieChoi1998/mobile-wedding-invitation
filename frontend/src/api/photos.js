const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

async function handleResponse(response) {
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(errorBody || `API error: ${response.status}`)
  }
  return response.json()
}

export async function requestPresignedUrl({ side, fileName, contentType }) {
  const response = await fetch(`${API_BASE_URL}/photos/presign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ side, fileName, contentType }),
  })
  return handleResponse(response)
}

export async function uploadToS3(uploadUrl, file, contentType) {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  })
  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.status}`)
  }
}

export async function listPhotos(side) {
  const response = await fetch(`${API_BASE_URL}/photos?side=${encodeURIComponent(side)}`)
  return handleResponse(response)
}
