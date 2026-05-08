import { useFetch } from '@vueuse/core'
import { ref } from 'vue'

const API_KEY = 'iaQgHaJzohK7bEEsNcQY9RCZbplPG2AlSODEh2VK'
const BASE_URL = 'https://api.congress.gov/v3/member'
const MEMBER_LIMIT = 6

const stateValidation = (input) => {
  const validStates = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ]
  return validStates.includes(input.toUpperCase())
}

export function useCongressState() {
  const stateInput = ref('')
  const error = ref('')
  const congressMembers = ref(null)
  const loading = ref(false)
  const memberLimit = ref(5)

  const getStateCongress = async () => {
    if (loading.value) return

    const input = stateInput.value.trim()
    loading.value = true
    error.value = ''
    congressMembers.value = null

    if (!stateValidation(input)) {
      error.value = 'Please enter a valid 2-letter state abbreviation (e.g., TX, CA)'
      loading.value = false
      return
    }

    const formattedState = input.toUpperCase()
    const URL = `${BASE_URL}/${formattedState}?format=json&limit=${memberLimit.value}&currentMember=true&api_key=${API_KEY}`

    try {
      const request = useFetch(URL, { immediate: false }).get().json()
      await request.execute()

      congressMembers.value = request.data.value
    } catch {
      error.value = 'Could not find any Congress Members. Try again.'
    } finally {
      loading.value = false
    }
  }

  return {
    stateInput,
    congressMembers,
    loading,
    error,
    getStateCongress,
    memberLimit,
  }
}
