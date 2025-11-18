<script setup lang="ts">
defineProps<{
  title: string
  slug: string
  excerpt: string
  image?: string
}>()
</script>

<template>
  <NuxtLink :to="`/posts/${slug}`" class="card">
    <NuxtImg v-if="image" :src="image" width="400" height="200" alt="" />
    <div class="card-content">
      <h2>{{ title }}</h2>
      <div v-html="excerpt" class="excerpt" />
      <Icon icon="mdi:arrow-right" width="24" />
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.card {
  display: block;
  border: 1px solid #ccc;
  border-radius: 1rem;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: #fff;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .card-content {
    padding: 1rem;

    h2 {
      font-size: 1.2rem;
      margin: 0 0 0.5rem;
    }

    .excerpt {
      font-size: 0.9rem;
      color: #555;
      margin-bottom: 0.5rem;
    }
  }
}
</style>
