<script setup>
const linkClass =
  'hover:underline hover:underline-offset-4 [&.router-link-active]:underline [&.router-link-active]:underline-offset-4'
</script>

<template>
  <nav class="flex justify-center gap-4">
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
