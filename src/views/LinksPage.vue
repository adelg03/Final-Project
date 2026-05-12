<script setup>
import NavMenu from '@/components/NavMenu.vue'

const openLink = (url) => window.open(url, '_blank')
</script>

<template>
  <main class="flex-1 items-center bg-linear-to-t from-[#FF2E2E] to-[#FF8C2E]">
    <div class="mx-auto w-full text-orange-900">
      <NavMenu />
      <RouterView />

      <div class="mt-20 flex flex-col items-center justify-center">
        <h2 class="mb-12 text-center text-5xl font-bold text-white drop-shadow-lg">
          Here are Links to Get You Started
        </h2>

        <div class="flex w-full max-w-2xl flex-col gap-6">
          <button
            class="hover:shadow-3xl flex w-full transform items-center justify-center gap-3 rounded-lg bg-emerald-600 px-8 py-6 text-xl font-bold text-white shadow-2xl transition hover:scale-105 hover:bg-emerald-800 hover:text-white/40"
            @click="openLink('https://www.vote.org/am-i-registered-to-vote/')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
              />
            </svg>
            Check Registration Status
          </button>

          <button
            class="hover:shadow-3xl flex w-full transform items-center justify-center gap-3 rounded-lg bg-yellow-500 px-8 py-6 text-xl font-bold text-white shadow-2xl transition hover:scale-105 hover:bg-yellow-800 hover:text-white/40"
            @click="openLink('https://www.vote.org/register-to-vote/')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
            Register To Vote
          </button>

          <button
            class="hover:shadow-3xl flex w-full transform items-center justify-center gap-3 rounded-lg bg-blue-800 px-8 py-6 text-xl font-bold text-white shadow-2xl transition hover:scale-105 hover:bg-blue-950 hover:text-white/40"
            @click="openLink('https://www.house.gov/representatives/find-your-representative')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-6 w-6"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              />
            </svg>
            Find Your Representative
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
