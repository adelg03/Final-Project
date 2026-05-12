<script setup>
import NavMenu from '@/components/NavMenu.vue'
import { useCongressState } from '@/assets/composables/getCongressMembers'
import { ref } from 'vue'

const {
  congressMembers,
  stateInput,
  loading,
  error,
  getStateCongress,
  memberLimit,
  sponsoredLegislation,
  sponsored,
} = useCongressState()

const numberOptions = Array.from({ length: 250 }, (_, i) => i + 1)

const selectedMemberName = ref('')
const expandedMemberId = ref(null)
const loadingSponsored = ref(false)

const toggleSponsored = async (member) => {
  if (expandedMemberId.value === member.bioguideId) {
    expandedMemberId.value = null
  } else {
    expandedMemberId.value = member.bioguideId
    selectedMemberName.value = member.name

    if (!sponsored.value || sponsored.value.bioguideId !== member.bioguideId) {
      loadingSponsored.value = true
      await sponsoredLegislation(member.bioguideId)
      loadingSponsored.value = false
    }
  }
}
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

        <select
          v-model="memberLimit"
          class="rounded-full border-2 border-white/50 bg-white/90 px-6 py-3 text-gray-800 shadow-lg focus:ring-2 focus:ring-white focus:outline-none"
        >
          <option
            v-for="num in numberOptions"
            :key="num"
            :value="num"
          >
            {{ num }}
          </option>
        </select>

        <button
          :disabled="loading"
          class="transform rounded-full bg-linear-to-t from-[#2B35BD] to-[#22C1C3] px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-gray-100 disabled:opacity-50"
          @click="getStateCongress"
        >
          {{ loading ? 'Loading...' : 'Enter' }}
        </button>
      </div>

      <!-- List of Congress Members-->
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
                    <div>
                      <img
                        v-if="member.depiction?.imageUrl"
                        :src="member.depiction.imageUrl"
                        :alt="member.name"
                        class="h-45 w-35 object-cover shadow-md"
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

                      <div class="mt-2 space-y-1 pb-4 text-sm text-white/90">
                        <div>Party: {{ member.partyName || 'Unknown Party' }}</div>
                        <div>Chamber: {{ member.terms?.item?.[0]?.chamber || 'Unknown' }}</div>
                        <div v-if="member.district">District: {{ member.district }}</div>
                        <div>Since: {{ member.terms?.item?.[0]?.startYear || 'Unknown' }}</div>
                        <div v-if="member.terms?.item?.[0]?.state">
                          State: {{ member.terms?.item?.[0]?.state }}
                        </div>
                      </div>

                      <div class="mt-3 pt-5">
                        <button
                          class="text-sm text-white/60 transition hover:text-white"
                          @click="toggleSponsored(member)"
                        >
                          {{
                            expandedMemberId === member.bioguideId
                              ? 'Hide Sponsored Legislation'
                              : 'View Latest Sponsored Legislation'
                          }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Congress Member's Sponsored Legislation -->
                <div
                  v-if="expandedMemberId === member.bioguideId"
                  class="border-t border-transparent bg-black/20 p-4"
                >
                  <div class="mt-2">
                    <h4 class="mb-3 text-xl font-semibold text-white">
                      Sponsored Legislation by {{ member.name }}
                    </h4>

                    <div
                      v-if="loadingSponsored && expandedMemberId === member.bioguideId"
                      class="flex items-center justify-center py-8"
                    >
                      <div
                        class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"
                      ></div>
                      <span class="ml-2 text-white">Loading Sponsored Legislation...</span>
                    </div>

                    <div v-else-if="sponsored?.sponsoredLegislation?.length > 0">
                      <div class="space-y-3">
                        <div
                          v-for="(bill, index) in sponsored.sponsoredLegislation"
                          :key="index"
                          class="rounded-lg bg-white/10 p-3"
                        >
                          <div class="flex items-start justify-between">
                            <div class="flex-1">
                              <div class="flex items-center gap-2">
                                <span
                                  class="rounded bg-blue-600/50 px-2 py-1 text-xs font-semibold text-white"
                                >
                                  {{ bill.type || 'Bill' }}
                                </span>
                                <span class="text-sm text-white/70">
                                  {{ bill.congress ? `${bill.congress}th Congress` : '' }}
                                </span>
                              </div>

                              <h5 class="font-small mt-2 font-bold text-white">
                                {{ bill.title || 'No title available' }}
                              </h5>

                              <div class="mt-2 flex flex-wrap gap-3 text-xs text-white/60">
                                <span v-if="bill.number">Bill #: {{ bill.number }}</span>
                                <span v-if="bill.introducedDate"
                                  >Introduced: {{ bill.introducedDate }}</span
                                >
                                <span v-if="bill.latestAction?.actionDate">
                                  Action Date: {{ bill.latestAction.actionDate }}
                                </span>
                              </div>

                              <div
                                v-if="bill.latestAction?.text"
                                class="mt-2 text-sm text-white/80"
                              >
                                <span class="text-xs font-semibold">Latest Action:</span>
                                {{ bill.latestAction.text }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      v-else
                      class="py-6 text-center"
                    >
                      <p class="text-white/70">
                        No sponsored legislation found for {{ member.name }}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="loading"
          class="mt-6 space-y-4 text-center text-white"
        >
          <div
            class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"
          ></div>
          <p class="mt-2">Fetching congress members...</p>
        </div>

        <div
          v-else-if="error"
          class="mt-6 rounded-lg bg-red-500 p-4 text-center text-white"
        >
          {{ error }}
        </div>

        <div
          v-else-if="congressMembers?.members?.length === 0 && !loading && !error"
          class="mt-6 rounded-lg bg-white/10 p-4 text-center text-white"
        >
          <p>No congress members found for {{ stateInput.toUpperCase() }}.</p>
          <p class="mt-1 text-sm opacity-80">Please check the state code and try again.</p>
        </div>
      </div>
    </div>
  </main>
</template>
