<template>
  <div class="products-page">
    <section class="shop-section" id="shop">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Shop Our Collection</h2>
          <p class="section-subtitle">Discover premium beauty and wellness products</p>
        </div>

        <div v-if="loading" class="loading">Loading products...</div>
        
        <div v-else-if="error" class="error">
          {{ error }}
        </div>

        <div v-else class="shop-grid">
          <div 
            v-for="product in products" 
            :key="product.node.id" 
            class="product-card"
          >
            <NuxtLink :to="`/products/${product.node.handle}`">
              <div class="product-image">
                <img 
                  v-if="product.node.images.edges[0]"
                  :src="product.node.images.edges[0].node.url" 
                  :alt="product.node.images.edges[0].node.altText || product.node.title"
                />
              </div>
              <div class="product-info">
                <h4>{{ product.node.title }}</h4>
                <p class="price">
                  ${{ product.node.priceRange.minVariantPrice.amount }} 
                  {{ product.node.priceRange.minVariantPrice.currencyCode }}
                </p>
                <p class="description">{{ truncate(product.node.description, 100) }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { fetchProducts } = useShopify()
const products = ref([])
const loading = ref(true)
const error = ref(null)

const truncate = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

onMounted(async () => {
  try {
    const data = await fetchProducts(20)
    products.value = data.data.products.edges
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  padding-top: 80px;
}

.shop-section {
  padding: 4rem 1.5rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  color: #e6e3de;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-subtitle {
  color: #e7e4dfcc;
  font-size: clamp(0.95rem, 1.8vw, 1.2rem);
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  backdrop-filter: blur(20px);
  background: #e7e4df0d;
  border: 1px solid rgba(230, 227, 222, 0.1);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: rgba(230, 227, 222, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
}

.product-card a {
  text-decoration: none;
  color: inherit;
}

.product-image {
  background: linear-gradient(135deg, rgba(53, 54, 55, 0.2), rgba(17, 41, 23, 0.2));
  height: 300px;
  width: 100%;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 1.5rem;
}

.product-info h4 {
  color: #e6e3de;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.price {
  color: #96784e;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.description {
  color: #e7e4dfb3;
  font-size: 0.95rem;
  line-height: 1.4;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #e6e3de;
  font-size: 1.2rem;
}

.error {
  color: #ff6b6b;
}
</style>
