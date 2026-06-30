import { getApiBaseUrl, parseJsonResponse, readApiErrorMessage } from './client.js'

async function handleResponse(response) {
  if (!response.ok) {
    const message = await readApiErrorMessage(response, `API error: ${response.status}`)
    if (response.status === 403) {
      throw new Error('지금은 사진 업로드 기간이 아닙니다')
    }
    throw new Error(message)
  }
  return parseJsonResponse(response)
}

export async function requestPresignedUrl({ side, fileName, contentType }) {
  const response = await fetch(`${getApiBaseUrl()}/photos/presign`, {
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

export async function getPhotoUploadStatus() {
  const response = await fetch(`${getApiBaseUrl()}/photos/upload-status`)
  return handleResponse(response)
}
