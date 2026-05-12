<script setup>
import NavMenu from '@/components/NavMenu.vue'
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

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
})
</script>

<template>
  <main class="flex-1 items-center bg-linear-to-t from-[#4BBD2B] to-[#2BB6BD]">
    <div class="mx-auto w-full text-green-900">
      <NavMenu />
      <RouterView />
    </div>

    <div class="relative mx-auto flex max-w-400 gap-6 p-6">
      <div class="min-w-0 flex-1">
        <div class="rounded-xl bg-white p-4 shadow-md">
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>
    </div>
  </main>
</template>
