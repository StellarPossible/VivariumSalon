<template>
  <div class="product-redirect">
    <p>Redirecting to the Vivarium collection...</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchProduct } = useShopify()
const product = ref(null)

const handleParam = route.params.handle
const handle = Array.isArray(handleParam) ? handleParam[0] : handleParam

if (handle) {
  try {
    const response = await fetchProduct(handle)
    product.value = response.data.productByHandle
  } catch (error) {
    console.error('Error fetching product:', error)
  }
}

// Dynamic meta tags based on product
useSeoMeta({
  title: () => product.value ? `${product.value.title} - Vivarium Salon` : 'Product - Vivarium Salon',
  description: () => product.value?.description || 'Discover our premium salon products at Vivarium Salon.',
  ogTitle: () => product.value?.title || 'Product - Vivarium Salon',
  ogDescription: () => product.value?.description || 'Discover our premium salon products at Vivarium Salon.',
  ogImage: () => product.value?.images?.edges?.[0]?.node?.url || '/images/og-default.jpg',
  ogUrl: () => `https://vivarium.stellarpossible.com/products/${handle}`,
  ogType: 'product',
  twitterCard: 'summary_large_image',
})

// Keep the redirect
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
