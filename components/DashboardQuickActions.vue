<template>
  <section class="card">
    <h2>Quick Actions</h2>
    <div class="actions">
      <NuxtLink to="/blog" class="action">
        <Icon icon="mdi:book-open-page-variant" />
        <span>Read Education</span>
      </NuxtLink>
      <NuxtLink to="/contact" class="action">
        <Icon icon="mdi:message-text" />
        <span>Contact Us</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
// Placeholder quick actions
</script>

<style scoped>
.card { background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 1rem; }
.actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.5rem; }
.action { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border: 1px dashed #dee2e6; border-radius: 8px; text-decoration: none; color: #212529; }
.action:hover { background: #f8f9fa; }
</style>
