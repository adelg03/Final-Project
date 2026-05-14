const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export class ApiError extends Error {
  constructor({ status, code, message, details = [] }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  fieldErrors() {
    const map = {}
    for (const detail of this.details) {
      if (detail?.field) map[detail.field] = detail.issue
    }
    return map
  }
}

async function rawFetch(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) return null

  let payload = null
  try {
    payload = await response.json()
  } catch {
    // non-JSON body
  }

  if (!response.ok) {
    const error = payload?.error ?? {}
    throw new ApiError({
      status: response.status,
      code: error.code ?? 'UNKNOWN_ERROR',
      message: error.message ?? response.statusText,
      details: error.details ?? [],
    })
  }

  return payload?.data ?? null
}

export async function apiFetch(path, options = {}) {
  const { auth = false, ...rest } = options
  if (!auth) return rawFetch(path, rest)

  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()

  try {
    return await rawFetch(path, { ...rest, token: authStore.accessToken })
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && authStore.refreshToken) {
      const refreshed = await authStore.refresh()
      if (refreshed) {
        return rawFetch(path, { ...rest, token: authStore.accessToken })
      }
      authStore.clear()
    }
    throw error
  }
}

export { rawFetch }