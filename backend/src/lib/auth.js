import { jsonResponse } from './response.js'

export function verifyAdminPassword(event) {
  const configured = process.env.ADMIN_PASSWORD
  if (!configured) {
    return jsonResponse(503, { message: 'Admin access is not configured' })
  }

  const provided =
    event.headers?.['x-admin-password'] ??
    event.headers?.['X-Admin-Password'] ??
    ''

  if (provided !== configured) {
    return jsonResponse(401, { message: 'Invalid admin password' })
  }

  return null
}
