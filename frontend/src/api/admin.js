const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export async function fetchAdminData(password) {
  const response = await fetch(`${API_BASE_URL}/admin/data`, {
    headers: { 'X-Admin-Password': password },
  })

  if (response.status === 401) {
    throw new Error('비밀번호가 올바르지 않습니다')
  }
  if (response.status === 503) {
    throw new Error('관리자 접근이 설정되지 않았습니다')
  }
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(errorBody || `API error: ${response.status}`)
  }

  return response.json()
}
