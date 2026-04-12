<script setup>
const linkClass =
  'hover:underline hover:underline-offset-4 [&.router-link-active]:underline [&.router-link-active]:underline-offset-4'
</script>

<template>
  <nav
    class="mb-8 flex max-w-full justify-center gap-4 rounded-lg bg-white/20 px-6 py-4 font-semibold"
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
  </nav>
</template>
