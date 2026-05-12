import { useFetch } from '@vueuse/core'
import { ref } from 'vue'

const ELECTION_API_KEY = import.meta.env.VITE_ELECTION_API_KEY
const ELECTIONS_URL = 'https://www.googleapis.com/civicinfo/v2/elections?key='

export function useElectionData() {
  const elections = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchElections = async () => {
    isLoading.value = true
    error.value = null

    try {
      const URL = `${ELECTIONS_URL}${ELECTION_API_KEY}`
      const request = useFetch(URL, { immediate: false }).get().json()
      await request.execute()

      elections.value = request.data.value.elections
    } catch {
      error.value = 'Could not find any elections. Try again.'
    } finally {
      isLoading.value = false
    }
  }

  const transformToCalendarEvents = (electionsData) => {
    if (!electionsData || !Array.isArray(electionsData)) {
      return []
    }

    const today = new Date()

    return electionsData.map((election) => {
      const electionDate = new Date(election.electionDay)
      const isUpcoming = electionDate > today

      let electionType = 'general'
      if (election.name.toLowerCase().includes('primary')) {
        electionType = 'primary'
      } else if (election.name.toLowerCase().includes('special')) {
        electionType = 'special'
      }

      const colorMap = {
        primary: { bg: '#5F9EA0', border: '#5F9EA0' },
        special: { bg: '#E4D00A', border: '#E4D00A' },
        general: { bg: '#50C878', border: '#50C878' },
      }

      const colors = colorMap[electionType]

      return {
        id: String(election.id),
        title: election.name,
        start: election.electionDay,
        allDay: true,
        extendedProps: {
          electionId: election.id,
          electionType: electionType,
          isUpcoming: isUpcoming,
          description: `Official ${electionType} election`,
          originalData: election,
        },
        backgroundColor: colors.bg,
        borderColor: colors.border,
        textColor: '#ffffff',
      }
    })
  }

  const getUpcomingEvents = (events, days = 30) => {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + days)

    return events
      .filter((event) => {
        const eventDate = new Date(event.start)
        return eventDate >= today && eventDate <= futureDate
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start))
  }

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'primary':
        return 'bg-teal-400 text-black font-semi-bold'
      case 'special':
        return 'bg-green-200 text-black font-semi-bold'
      default:
        return 'bg-grey-100 text-black font-semi-bold'
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return {
    elections,
    isLoading,
    error,
    fetchElections,
    transformToCalendarEvents,
    getUpcomingEvents,
    getEventTypeColor,
    formatDate,
  }
}
