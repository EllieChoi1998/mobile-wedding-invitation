import { API_MISCONFIG_MESSAGE, getApiBaseUrl, parseJsonResponse, readApiErrorMessage } from './client.js'

export async function fetchAdminData(password) {
  const apiBaseUrl = getApiBaseUrl()
  if (!apiBaseUrl) {
    throw new Error(API_MISCONFIG_MESSAGE)
  }

  const response = await fetch(`${apiBaseUrl}/admin/data`, {
    headers: { 'X-Admin-Password': password },
  })

  if (response.status === 401) {
    throw new Error('비밀번호가 올바르지 않습니다')
  }
  if (response.status === 503) {
    throw new Error('관리자 접근이 설정되지 않았습니다')
  }
  if (!response.ok) {
    const message = await readApiErrorMessage(response, `API error: ${response.status}`)
    throw new Error(message)
  }

  return parseJsonResponse(response)
}

export async function deleteAdminItem(password, { resource, id, side }) {
  const apiBaseUrl = getApiBaseUrl()
  if (!apiBaseUrl) {
    throw new Error(API_MISCONFIG_MESSAGE)
  }

  const body = { resource, id }
  if (side) body.side = side

  const response = await fetch(`${apiBaseUrl}/admin/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Password': password,
    },
    body: JSON.stringify(body),
  })

  if (response.status === 401) {
    throw new Error('비밀번호가 올바르지 않습니다')
  }
  if (response.status === 404) {
    throw new Error('항목을 찾을 수 없습니다')
  }
  if (!response.ok) {
    const message = await readApiErrorMessage(response, `API error: ${response.status}`)
    throw new Error(message)
  }

  return parseJsonResponse(response)
}
