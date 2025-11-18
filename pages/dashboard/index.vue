<template>
  <div class="dashboard-grid">
    <DashboardStats />
    <DashboardRecentActivity />
    <DashboardQuickActions />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>
