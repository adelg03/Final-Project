import { ref } from 'vue'
import { ApiError } from '@/lib/api'

export function useAsync() {
  const loading = ref(false)
  const error = ref(null)
  const fieldErrors = ref({})

  async function run(fn) {
    loading.value = true
    error.value = null
    fieldErrors.value = {}
    try {
      return await fn()
    } catch (err) {
      error.value = err
      if (err instanceof ApiError) fieldErrors.value = err.fieldErrors()
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, error, fieldErrors, run }
}