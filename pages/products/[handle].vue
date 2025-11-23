<template>
  <div class="product-page">
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="product" class="product-container">
      <div class="product-images">
        <img 
          v-if="product.images.edges[0]"
          :src="product.images.edges[0].node.url" 
          :alt="product.images.edges[0].node.altText || product.title"
        />
      </div>

      <div class="product-details">
        <h1>{{ product.title }}</h1>
        <p class="price">
          ${{ product.priceRange.minVariantPrice.amount }} 
          {{ product.priceRange.minVariantPrice.currencyCode }}
        </p>
        <div class="description" v-html="product.description"></div>
        
        <button class="buy-button" @click="buyNow">
          Buy Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchProduct } = useShopify()
const product = ref(null)
const loading = ref(true)
const error = ref(null)

const buyNow = () => {
  // Redirect to Shopify checkout or implement cart
  const shopUrl = `https://vivarium-8261.myshopify.com/products/${product.value.handle}`
  window.open(shopUrl, '_blank')
}

onMounted(async () => {
  try {
    const data = await fetchProduct(route.params.handle as string)
    product.value = data.data.productByHandle
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.product-page {
  min-height: 100vh;
  padding: 120px 1.5rem 4rem;
}

.product-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.product-images img {
  width: 100%;
  border-radius: 15px;
}

.product-details h1 {
  color: #e6e3de;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.price {
  color: #96784e;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.description {
  color: #e7e4dfcc;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.buy-button {
  background: linear-gradient(135deg, #96784e, #745d3d);
  border: none;
  border-radius: 50px;
  color: #e6e3de;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 1rem 3rem;
  transition: all 0.3s ease;
}

.buy-button:hover {
  box-shadow: 0 6px 20px rgba(150, 120, 78, 0.6);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
