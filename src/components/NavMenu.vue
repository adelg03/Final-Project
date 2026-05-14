<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSavedElectionsStore } from '@/stores/saved-elections'

const router = useRouter()
const auth = useAuthStore()
const savedElections = useSavedElectionsStore()

async function onLogout() {
  await auth.logout()
  savedElections.reset()
  router.replace('/login')
}

const linkClass =
  'hover:underline hover:underline-offset-4 [&.router-link-active]:underline [&.router-link-active]:underline-offset-4'
</script>

<template>
  <nav
    class="mb-8 flex max-w-full flex-wrap items-center justify-center gap-4 rounded-lg bg-white/20 px-6 py-4 font-semibold"
  >
    <RouterLink
      to="/"
      :class="linkClass"
    >
      Home
    </RouterLink>
    <RouterLink
      to="/calendar"
      :class="linkClass"
    >
      Calendar
    </RouterLink>
    <RouterLink
      to="/links"
      :class="linkClass"
    >
      Links
    </RouterLink>

    <template v-if="auth.isAuthenticated">
      <span class="border-l border-white/30 pl-4 text-sm text-white/70 font-semibold">
        {{ auth.email }}
      </span>
      <button
        @click="onLogout"
        class="hover:underline hover:underline-offset-4"
      >
        Sign out
      </button>
    </template>
    <template v-else>
      <RouterLink
        to="/login"
        :class="linkClass"
      >
        Sign in
      </RouterLink>
      
    </template>
  </nav>
</template>