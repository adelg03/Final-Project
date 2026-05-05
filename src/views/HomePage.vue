<script setup>
import NavMenu from '@/components/NavMenu.vue'
import { useCongressState } from '@/assets/composables/getCongressMembers'

const { congressMembers, stateInput, loading, error, getStateCongress } = useCongressState()
</script>
<template>
  <main class="flex-1 items-center bg-linear-to-t from-[#2B35BD] to-[#22C1C3]">
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
          class="transform rounded-full bg-linear-to-t from-[#2B35BD] to-[#22C1C3] px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-gray-100 disabled:opacity-50"
          @click="getStateCongress"
        >
          {{ loading ? 'Loading...' : 'Enter' }}
        </button>
      </div>

      <div class="mt-4 text-2xl font-bold text-amber-50">
        <div
          v-if="congressMembers?.members"
          class="mt-8"
        >
          <div class="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <h2 class="mb-6 text-2xl font-bold text-white">
              Congress Members from {{ stateInput.toUpperCase() }}
            </h2>

            <div class="space-y-4">
              <div
                v-for="member in congressMembers.members"
                :key="member.bioguideId"
                class="overflow-hidden rounded-lg bg-white/10 transition-all hover:bg-white/20"
              >
                <div class="p-4">
                  <div class="flex gap-4">
                    <div class="shrink-0">
                      <img
                        v-if="member.depiction?.imageUrl"
                        :src="member.depiction.imageUrl"
                        :alt="member.name"
                        class="h-24 w-20 object-cover shadow-md"
                      />
                      <div
                        v-else
                        class="flex h-24 w-20 items-center justify-center bg-linear-to-br from-blue-500 to-purple-500"
                      >
                        <span class="text-lg font-bold text-white">
                          {{ member.name?.charAt(0) || '?' }}
                        </span>
                      </div>
                    </div>

                    <div class="min-w-0 flex-1">
                      <h3 class="text-lg font-bold text-white">
                        {{ member.name }}
                      </h3>

                      <div class="mt-2 space-y-1 text-sm text-white/90">
                        <div>Party: {{ member.partyName || 'Unknown Party' }}</div>
                        <div>Chamber: {{ member.terms?.item?.[0]?.chamber || 'Unknown' }}</div>
                        <div v-if="member.district">District: {{ member.district }}</div>
                        <div>Since: {{ member.terms?.item?.[0]?.startYear || 'Unknown' }}</div>
                        <div v-if="member.terms?.item?.[0]?.state">
                          State: {{ member.terms?.item?.[0]?.state }}
                        </div>
                      </div>

                      <div class="mt-3">
                        <button class="text-sm text-white/80 transition hover:text-white">
                          View Sponsored Bills
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
