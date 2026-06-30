import { verifyAdminPassword } from '../lib/auth.js'
import { setPhotoUploadOpen } from '../lib/settings.js'
import { jsonResponse } from '../lib/response.js'

export async function handler(event) {
  try {
    const authError = verifyAdminPassword(event)
    if (authError) return authError

    const body = JSON.parse(event.body || '{}')
    const { photoUploadOpen } = body

    if (typeof photoUploadOpen !== 'boolean') {
      return jsonResponse(400, { message: 'photoUploadOpen must be a boolean' })
    }

    const settings = await setPhotoUploadOpen(photoUploadOpen)
    return jsonResponse(200, { settings })
  } catch (err) {
    console.error('adminUpdateSettings error:', err)
    return jsonResponse(500, { message: 'Internal server error' })
  }
}
