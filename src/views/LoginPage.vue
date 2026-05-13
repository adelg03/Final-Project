<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import { useAsync } from '@/composables/useAsync'
import NavMenu from '@/components/NavMenu.vue'

useTitle('Sign In')

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { loading, error, fieldErrors, run } = useAsync()

const form = reactive({ email: '', password: '' })

async function onSubmit() {
  try {
    await run(() => auth.login(form))
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/calendar'
    router.replace(redirect)
  } catch {
    // error captured
  }
}
</script>

<template>
  <main class="flex-1 items-center bg-linear-to-t from-[#2B35BD] to-[#22C1C3]">
    <div class="mx-auto w-full text-blue-900">
      <NavMenu />
      <RouterView />
    </div>

    <div class="mx-auto w-full max-w-md px-4 py-16">
      <div class="rounded-3xl p-3 text-center">
        <h1 class="mb-6 text-6xl font-bold text-white">Welcome Back</h1>
        <p class="mb-6 text-white/90">Sign in to save election dates</p>
      </div>

      <div class="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <div>
            <label class="mb-2 block text-sm font-medium text-white">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full rounded-2xl border-0 bg-white/90 px-6 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              :class="fieldErrors.email ? 'ring-2 ring-red-400' : ''"
            />
            <p v-if="fieldErrors.email" class="mt-1 text-sm text-red-200">
              {{ fieldErrors.email }}
            </p>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-white">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="Enter your password"
              class="w-full rounded-2xl border-0 bg-white/90 px-6 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              :class="fieldErrors.password ? 'ring-2 ring-red-400' : ''"
            />
            <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-200">
              {{ fieldErrors.password }}
            </p>
          </div>

          <div
            v-if="error && Object.keys(fieldErrors).length === 0"
            class="rounded-lg bg-red-500/20 p-3 text-center text-sm text-red-100"
          >
            {{ error.message }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full transform rounded-2xl bg-linear-to-t from-[#2B35BD] to-[#22C1C3] px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-white/80">
          Don't have an account?
          <RouterLink to="/register" class="font-semibold text-white underline hover:text-white/80">
            Create one here
          </RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>