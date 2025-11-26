<template>
  <div class="product-redirect">
    <p>Redirecting to the Vivarium collection...</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const handleParam = route.params.handle
const handle = Array.isArray(handleParam) ? handleParam[0] : handleParam

await navigateTo(
  {
    path: '/products',
    query: handle ? { product: handle } : undefined,
  },
  { replace: true },
)
</script>

<style scoped>
.product-redirect {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  font-size: 1.1rem;
}
</style>
