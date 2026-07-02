import { verifyAdminPassword } from '../lib/auth.js'
import { updateAppSettings } from '../lib/settings.js'
import { jsonResponse } from '../lib/response.js'

export async function handler(event) {
  try {
    const authError = verifyAdminPassword(event)
    if (authError) return authError

    const body = JSON.parse(event.body || '{}')
    const { photoUploadOpen, guestbookOpen, rsvpOpen } = body
    const updates = {}

    if (typeof photoUploadOpen === 'boolean') {
      updates.photoUploadOpen = photoUploadOpen
    }
    if (typeof guestbookOpen === 'boolean') {
      updates.guestbookOpen = guestbookOpen
    }
    if (typeof rsvpOpen === 'boolean') {
      updates.rsvpOpen = rsvpOpen
    }

    if (Object.keys(updates).length === 0) {
      return jsonResponse(400, {
        message: 'At least one of photoUploadOpen, guestbookOpen, rsvpOpen must be a boolean',
      })
    }

    const settings = await updateAppSettings(updates)
    return jsonResponse(200, { settings })
  } catch (err) {
    console.error('adminUpdateSettings error:', err)
    return jsonResponse(500, { message: 'Internal server error' })
  }
}
