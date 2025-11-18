<template>
  <section class="card">
    <h2>Stats</h2>
    <div v-if="pending">Loading...</div>
    <div v-else>
      <ul class="stats">
        <li><strong>{{ data?.totalPosts }}</strong> Posts</li>
        <li><strong>{{ data?.totalComments }}</strong> Comments</li>
        <li><strong>{{ lastLoginDisplay }}</strong> Last login</li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
type Stats = { totalPosts: number; totalComments: number; lastLogin?: string | null }
const { data, pending } = useLazyFetch<Stats>('/api/dashboard/stats')
const lastLoginDisplay = computed(() => {
  if (!data.value?.lastLogin) return '—'
  try { return new Date(data.value.lastLogin).toLocaleString() } catch { return String(data.value.lastLogin) }
})
</script>

<style scoped>
.card { background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 1rem; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; list-style: none; padding: 0; margin: 0; }
</style>
