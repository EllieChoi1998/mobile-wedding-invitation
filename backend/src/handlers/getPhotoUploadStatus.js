import { getPhotoUploadOpen } from '../lib/settings.js'
import { jsonResponse } from '../lib/response.js'

export async function handler() {
  try {
    const open = await getPhotoUploadOpen()
    return jsonResponse(200, { photoUploadOpen: open })
  } catch (err) {
    console.error('getPhotoUploadStatus error:', err)
    return jsonResponse(500, { message: 'Internal server error' })
  }
}
