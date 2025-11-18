<template>
  <div class="dashboard-container">
    <DashboardSidebar />
    <main class="dashboard-main">
      <DashboardHeader />
      <div class="dashboard-content">
        <!-- Render nested dashboard pages here -->
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Protect the route with auth middleware
definePageMeta({
  middleware: 'auth'
})

// Set page title
useHead({
  title: 'Dashboard - StellarPossible'
})

const user = useState('auth.user')
</script>
