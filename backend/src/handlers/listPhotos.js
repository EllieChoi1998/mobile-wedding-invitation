import { jsonResponse } from '../lib/response.js'

export async function handler() {
  return jsonResponse(403, { message: 'Guest photos are only available in the admin dashboard' })
}
