<template>
  <section class="card">
    <h2>Settings</h2>
    <p>Manage account settings and preferences.</p>
    <ul>
      <li>Notification preferences (coming soon)</li>
      <li>Security settings (coming soon)</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>

<style scoped>
.card { background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 1rem; }
</style>
