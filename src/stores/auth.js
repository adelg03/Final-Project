import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { rawFetch, ApiError } from '@/lib/api'

function decodeJwtEmail(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.email ?? null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const refreshToken = useStorage('myvote:refreshToken', null)
  const email = useStorage('myvote:email', null)

  const isAuthenticated = computed(() => Boolean(refreshToken.value))

  function setTokens({ accessToken: at, refreshToken: rt }) {
    if (at !== undefined) accessToken.value = at
    if (rt !== undefined) refreshToken.value = rt
    if (at) {
      const emailFromToken = decodeJwtEmail(at)
      if (emailFromToken) email.value = emailFromToken
    }
  }

  function clear() {
    accessToken.value = null
    refreshToken.value = null
    email.value = null
  }

  async function register({ email: userEmail, password }) {
    await rawFetch('/auth/register', {
      method: 'POST',
      body: { email: userEmail, password },
    })
    await login({ email: userEmail, password })
  }

  async function login({ email: userEmail, password }) {
    const data = await rawFetch('/auth/login', {
      method: 'POST',
      body: { email: userEmail, password },
    })
    setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    })
    email.value = userEmail
  }

  async function refresh() {
    if (!refreshToken.value) return false
    try {
      const data = await rawFetch('/auth/refresh', {
        method: 'POST',
        body: { refresh_token: refreshToken.value },
      })
      accessToken.value = data.accessToken
      return true
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) clear()
      return false
    }
  }

  async function logout() {
    const token = refreshToken.value
    clear()
    if (token) {
      try {
        await rawFetch('/auth/logout', {
          method: 'POST',
          body: { refresh_token: token },
        })
      } catch {
        // Ignore — local state already cleared
      }
    }
  }

  return {
    accessToken,
    refreshToken,
    email,
    isAuthenticated,
    setTokens,
    clear,
    register,
    login,
    refresh,
    logout,
  }
})