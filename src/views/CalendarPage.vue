<script setup>
import NavMenu from '@/components/NavMenu.vue'
</script>

<template>
  <main class="flex-1 items-center bg-gradient-to-t from-[#4BBD2B] to-[#2BB6BD]">
    <div class="mx-auto w-full text-green-900">
      <NavMenu />
      <RouterView />
    </div>
  </main>
</template>
