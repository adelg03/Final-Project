<script setup>
import NavMenu from '@/components/NavMenu.vue'
import { ref, onMounted, computed, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useElectionData } from '@/assets/composables/getElectionDates'
import { useAuthStore } from '@/stores/auth'
import { useSavedElectionsStore } from '@/stores/saved-elections'
import { useAsync } from '@/composables/useAsync'

const {
  elections,
  fetchElections,
  transformToCalendarEvents,
  getUpcomingEvents,
  getEventTypeColor: getTypeColor,
  formatDate: formatDateUtil,
} = useElectionData()

const auth = useAuthStore()
const savedElections = useSavedElectionsStore()
const { run: runSave, loading: saving } = useAsync()

const calendarEvents = ref([])
const currentEvents = ref([])
const showEventModal = ref(false)
const selectedEvent = ref(null)

const upcomingEvents = computed(() => {
  return getUpcomingEvents(calendarEvents.value, 30).slice(0, 10)
})

const getEventTypeColor = (type) => {
  return getTypeColor(type)
}

const formatDate = (date) => {
  return formatDateUtil(date)
}

const isSaved = (electionId) => {
  if (!electionId) return false
  return savedElections.savedStatus.get(electionId)?.saved || false
}

async function saveElection(event) {
  if (!auth.isAuthenticated) {
    alert('Please sign in to save elections')
    return
  }
  
  try {
    await runSave(() => savedElections.save(event))
    alert(`Saved "${event.title}" to your elections!`)
  } catch (err) {
    if (err.code === 'CONFLICT') {
      alert('This election is already saved')
    } else {
      alert('Failed to save election. Please try again.')
    }
  }
}

async function unsaveElection(electionId) {
  const savedData = savedElections.savedStatus.get(electionId)
  if (!savedData?.id) return
  
  if (confirm('Remove this election from your saved list?')) {
    try {
      await runSave(() => savedElections.remove(savedData.id))
      alert('Election removed from saved list')
    } catch (err) {
      alert('Failed to remove election. Please try again.')
    }
  }
}

const fetchElectionData = async () => {
  await fetchElections()
  if (elections.value && elections.value.length > 0) {
    calendarEvents.value = transformToCalendarEvents(elections.value)
    console.log(`Successfully loaded ${calendarEvents.value.length} elections`)
  } else {
    calendarEvents.value = []
  }
}

const handleEventClick = async (clickInfo) => {
  const event = clickInfo.event
  selectedEvent.value = {
    id: event.id,
    title: event.title,
    start: event.start,
    extendedProps: event.extendedProps,
  }
  
  if (auth.isAuthenticated) {
    await savedElections.checkSaved(event.id)
  }
  
  showEventModal.value = true
}

const handleEvents = (events) => {
  currentEvents.value = events
}

const closeModal = () => {
  showEventModal.value = false
  selectedEvent.value = null
}

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,dayGridDay',
  },
  weekends: true,
  height: 'auto',
  contentHeight: 600,
  selectable: false,
  editable: false,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  events: calendarEvents,
  eventDidMount: (info) => {
    if (info.event.extendedProps.electionType === 'primary') {
      info.el.style.backgroundColor = '#5F9EA0'
    } else if (info.event.extendedProps.electionType === 'general') {
      info.el.style.backgroundColor = '#50C878'
    } else if (info.event.extendedProps.electionType === 'special') {
      info.el.style.backgroundColor = '#E4D00A'
    }
  },
})

onMounted(async () => {
  await fetchElectionData()
  if (auth.isAuthenticated) {
    await savedElections.fetchAll()
  }
})

watch(() => auth.isAuthenticated, async (isAuthed) => {
  if (isAuthed) {
    await savedElections.fetchAll()
  }
})
</script>

<template>
  <main class="flex-1 items-center bg-linear-to-t from-[#4BBD2B] to-[#2BB6BD]">
    <div class="mx-auto w-full text-green-900">
      <NavMenu />
      <RouterView />
    </div>

    <div class="relative mx-auto flex max-w-400 gap-6 p-6">
      <!-- Upcoming Elections -->
      <aside class="w-80 shrink-0">
        <div class="sticky top-6 space-y-4">
          <div class="rounded-xl bg-white p-5 shadow-md">
            <h3 class="mb-3 flex items-center gap-2 font-semibold text-gray-800">
              Upcoming Elections
            </h3>
            <div class="max-h-96 space-y-3 overflow-y-auto">
              <div
                v-for="event in upcomingEvents"
                :key="event.id"
                class="rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
              >
                <div class="mb-1 flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-800">{{ event.title }}</span>
                  <span
                    :class="getEventTypeColor(event.extendedProps?.electionType)"
                    class="rounded-full px-2 py-0.5 text-xs"
                  >
                    {{ event.extendedProps?.electionType || 'general' }}
                  </span>
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatDate(event.start) }}
                </div>
              </div>
              <div
                v-if="upcomingEvents.length === 0"
                class="py-8 text-center text-gray-400"
              >
                No upcoming elections
              </div>
            </div>
          </div>

          <!-- Saved Elections -->
          <div 
            v-if="auth.isAuthenticated && savedElections.list.length > 0" 
            class="rounded-xl bg-white p-5 shadow-md"
          >
            <h3 class="mb-3 flex items-center gap-2 font-semibold text-gray-800">
              Your Saved Elections
            </h3>
            <div class="max-h-96 space-y-2 overflow-y-auto">
              <div 
                v-for="item in savedElections.list" 
                :key="item.id" 
                class="rounded-lg bg-gray-50 p-2 text-sm"
              >
                <div class="font-medium text-gray-800">{{ item.title }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(item.electionDate) }}</div>
              </div>
             
            </div>
          </div>
        </div>
      </aside>

      <!-- Calendar -->
      <div class="min-w-0 flex-1">
        <div class="rounded-xl bg-white p-4 shadow-md">
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>

      <div
        v-if="showEventModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click.self="closeModal"
      >
        <div class="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
          <h3 class="mb-4 text-xl font-bold text-gray-800">{{ selectedEvent?.title }}</h3>
          <div class="mb-6 space-y-2">
            <p class="text-gray-600">
              <strong class="text-gray-800">Date:</strong> {{ formatDate(selectedEvent?.start) }}
            </p>
            <p class="text-gray-600">
              <strong class="text-gray-800">Election ID:</strong> {{ selectedEvent?.id }}
            </p>
            <p class="text-gray-600">
              <strong class="text-gray-800">Type:</strong>
              <span
                :class="getEventTypeColor(selectedEvent?.extendedProps?.electionType)"
                class="ml-2 rounded-full px-2 py-0.5 text-xs"
              >
                {{ selectedEvent?.extendedProps?.electionType || 'General Election' }}
              </span>
            </p>
            <p
              v-if="selectedEvent?.extendedProps?.isUpcoming"
              class="text-gray-600"
            >
              <strong class="text-gray-800">Status:</strong>
              <span class="ml-2 text-green-600">Upcoming</span>
            </p>


            <div v-if="auth.isAuthenticated" class="pt-2">
              <button
                v-if="!isSaved(selectedEvent?.id)"
                @click="saveElection(selectedEvent)"
                :disabled="saving"
                class="w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-800 disabled:opacity-50"
              >
                {{ saving ? 'Saving...' : 'Save this Election' }}
              </button>
              <button
                v-else
                @click="unsaveElection(selectedEvent?.id)"
                :disabled="saving"
                class="w-full rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {{ saving ? 'Removing...' : 'Remove from Saved Elections' }}
              </button>
            </div>
            <p v-else class="pt-2 text-center text-sm text-gray-500">
              <RouterLink to="/login" class="text-green-600 hover:text-green-800 hover:underline">
                Sign in
              </RouterLink> to save elections
            </p>
          </div>
          <button
            class="w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-800"
            @click="closeModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </main>
</template>