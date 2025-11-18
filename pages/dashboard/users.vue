<template>
  <section class="card">
    <h2>Users (Admin)</h2>
    <p>Admin-only user management area.</p>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'admin'] } as any)
</script>

<style scoped>
.card { background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 1rem; }
</style>
