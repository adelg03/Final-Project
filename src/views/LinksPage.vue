<script setup>
import NavMenu from '@/components/NavMenu.vue'
</script>

<template>
  <main class="flex-1 items-center bg-gradient-to-t from-[#FF2E2E] to-[#FF8C2E]">
    <div class="mx-auto w-full text-orange-900">
      <NavMenu />
      <RouterView />
    </div>
  </main>
</template>
