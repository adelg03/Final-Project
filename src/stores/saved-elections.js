import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiFetch } from '@/lib/api'

export const useSavedElectionsStore = defineStore('saved-elections', () => {
  const list = ref([])
  const loading = ref(false)
  const error = ref(null)
  const savedStatus = ref(new Map()) 

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      list.value = (await apiFetch('/saved-elections', { auth: true })) ?? []
      // Build lookup map
      savedStatus.value.clear()
      list.value.forEach(item => {
        savedStatus.value.set(item.electionId, { saved: true, id: item.id })
      })
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  async function save(election) {
    const saved = await apiFetch('/saved-elections', {
      method: 'POST',
      body: {
        electionId: election.id,
        title: election.title,
        electionDate: election.start,
        electionType: election.extendedProps?.electionType || 'general',
      },
      auth: true,
    })
    list.value.push(saved)
    savedStatus.value.set(election.id, { saved: true, id: saved.id })
    return saved
  }

  async function remove(id) {
    await apiFetch(`/saved-elections/${id}`, { method: 'DELETE', auth: true })
    list.value = list.value.filter(item => item.id !== id)
    // Find and remove from status map
    for (const [electionId, data] of savedStatus.value.entries()) {
      if (data.id === id) {
        savedStatus.value.delete(electionId)
        break
      }
    }
  }

  async function checkSaved(electionId) {
    if (savedStatus.value.has(electionId)) {
      return savedStatus.value.get(electionId)
    }
    try {
      const result = await apiFetch(`/saved-elections/check/${encodeURIComponent(electionId)}`, { auth: true })
      if (result.saved) {
        savedStatus.value.set(electionId, { saved: true, id: result.id })
        return { saved: true, id: result.id }
      }
      return { saved: false, id: null }
    } catch {
      return { saved: false, id: null }
    }
  }

  function reset() {
    list.value = []
    savedStatus.value.clear()
    error.value = null
  }

  return {
    list,
    loading,
    error,
    savedStatus,
    fetchAll,
    save,
    remove,
    checkSaved,
    reset,
  }
})