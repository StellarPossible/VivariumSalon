<template>
  <header class="dashboard-header">
    <h1>Dashboard</h1>
    <div class="header-actions">
      <button @click="logout" class="logout-btn">
        <Icon icon="mdi:logout" />
        <span>Logout</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { User } from '~/types/auth'
const user = useState<User | null>('auth.user')

async function logout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped lang="scss">
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}
</style>
