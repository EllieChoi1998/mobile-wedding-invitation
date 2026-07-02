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

export async function deleteAdminItems(adminPassword, deletePassword, items) {
  const apiBaseUrl = getApiBaseUrl()
  if (!apiBaseUrl) {
    throw new Error(API_MISCONFIG_MESSAGE)
  }

  const response = await fetch(`${apiBaseUrl}/admin/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Password': adminPassword,
    },
    body: JSON.stringify({ deletePassword, items }),
  })

  if (response.status === 401) {
    throw new Error('관리자 비밀번호가 올바르지 않습니다')
  }
  if (response.status === 403) {
    throw new Error('삭제 비밀번호가 올바르지 않습니다')
  }
  return parseJsonResponse(response)
}

export async function updateAppSettings(adminPassword, settings) {
  const apiBaseUrl = getApiBaseUrl()
  if (!apiBaseUrl) {
    throw new Error(API_MISCONFIG_MESSAGE)
  }

  const response = await fetch(`${apiBaseUrl}/admin/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Password': adminPassword,
    },
    body: JSON.stringify(settings),
  })

  if (response.status === 401) {
    throw new Error('관리자 비밀번호가 올바르지 않습니다')
  }
  if (!response.ok) {
    const message = await readApiErrorMessage(response, `API error: ${response.status}`)
    throw new Error(message)
  }

  return parseJsonResponse(response)
}

/** @deprecated Use updateAppSettings */
export async function updatePhotoUploadSetting(adminPassword, photoUploadOpen) {
  return updateAppSettings(adminPassword, { photoUploadOpen })
}
