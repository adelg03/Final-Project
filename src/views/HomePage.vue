<script setup>
import NavMenu from '@/components/NavMenu.vue'
import { useCongressState } from '@/assets/composables/getCongressMembers'

const { congressMembers, stateInput, loading, error, getStateCongress } = useCongressState()
</script>
<template>
  <main class="flex-1 items-center bg-gradient-to-t from-[#2B35BD] to-[#22C1C3]">
    <div class="mx-auto w-full text-blue-900">
      <NavMenu />
      <RouterView />
    </div>

    <div class="mx-auto w-full max-w-4xl px-4 py-8">
      <div class="rounded-3xl p-6 text-center">
        <h1 class="mb-6 text-7xl font-bold text-white">Start Voting Now</h1>
        <p class="mb-6 text-white">
          Enter Your State Below To View Your Congress Members:<br />
          View What Legislation They Sponsor
        </p>
      </div>

      <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <input
          v-model="stateInput"
          type="text"
          placeholder="Enter state code (e.g., TX)"
          class="shadow-2x1 w-80 rounded-2xl border-0 border-white/50 bg-white px-6 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none"
        />

        <button
          :disabled="loading"
          class="transform rounded-full bg-gradient-to-t from-[#2B35BD] to-[#22C1C3] px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-gray-100 disabled:opacity-50"
          @click="getStateCongress"
        >
          {{ loading ? 'Loading...' : 'Enter' }}
        </button>
      </div>

      <div class="mt-4 text-2xl font-bold text-amber-50">
        Congress Member Data
        <div class="mt-2 max-h-64 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs text-white/70">
          {{ JSON.stringify(congressMembers, null, 2) }}
        </div>
      </div>
    </div>
  </main>
</template>
