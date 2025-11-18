<script setup lang="ts">
// Redirect to login page which now handles both login and registration
await navigateTo('/login?tab=register')
</script>

<template>
  <div>
    <!-- This page redirects to /login -->
  </div>
</template>