import { getPublicAppStatus } from '../lib/settings.js'
import { jsonResponse } from '../lib/response.js'

export async function handler() {
  try {
    const status = await getPublicAppStatus()
    return jsonResponse(200, status)
  } catch (err) {
    console.error('getPhotoUploadStatus error:', err)
    return jsonResponse(500, { message: 'Internal server error' })
  }
}
