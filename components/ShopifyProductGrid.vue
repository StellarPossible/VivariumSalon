<template>
  <div class="shopify-product-grid">
    <div v-if="loading" class="status-message loading">Loading products...</div>
    <div v-else-if="error" class="status-message error">{{ error }}</div>
    <div v-else-if="!products.length" class="status-message empty">
      <slot name="empty">
        <p>No products are available right now. Please check back soon.</p>
      </slot>
    </div>
    <div v-else class="product-grid" role="list">
      <article
        v-for="product in products"
        :key="product.node.id"
        class="product-card"
        role="listitem"
      >
        <NuxtLink :to="`/products/${product.node.handle}`" class="product-link">
          <div class="product-image" aria-hidden="true">
            <template v-if="product.node.images.edges.length">
              <img
                :src="product.node.images.edges[0].node.url"
                :alt="product.node.images.edges[0].node.altText || product.node.title"
              />
            </template>
            <template v-else>
              <div class="image-placeholder">{{ product.node.title.charAt(0) }}</div>
            </template>
          </div>
          <div class="product-info">
            <h4 class="product-title">{{ product.node.title }}</h4>
            <p class="price">
              {{ formatPrice(product.node.priceRange.minVariantPrice.amount, product.node.priceRange.minVariantPrice.currencyCode) }}
            </p>
            <p class="description">{{ truncate(product.node.description, descriptionLength) }}</p>
          </div>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
type ProductImageEdge = {
  node: {
    url: string
    altText: string | null
  }
}

type ProductEdge = {
  cursor: string
  node: {
    id: string
    title: string
    handle: string
    description: string
    priceRange: {
      minVariantPrice: {
        amount: string
        currencyCode: string
      }
    }
    images: {
      edges: ProductImageEdge[]
    }
  }
}

const props = defineProps({
  limit: {
    type: Number,
    default: Number.POSITIVE_INFINITY,
  },
  pageSize: {
    type: Number,
    default: 50,
  },
  descriptionLength: {
    type: Number,
    default: 100,
  },
})

const { fetchProducts } = useShopify()
const products = ref<ProductEdge[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

type ShopifyProductsConnection = {
  edges?: ProductEdge[]
  pageInfo?: {
    hasNextPage: boolean
    endCursor: string | null
  }
}

type ShopifyProductsResponse = {
  data?: {
    products?: ShopifyProductsConnection
  }
}

const truncate = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? `${text.substring(0, length)}...` : text
}

const formatPrice = (amount: string, currency: string) => {
  const numericAmount = Number.parseFloat(amount)

  if (!Number.isFinite(numericAmount)) {
    return `${amount} ${currency}`
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      maximumFractionDigits: 2,
    }).format(numericAmount)
  } catch (err) {
    return `${numericAmount.toFixed(2)} ${currency}`
  }
}

const loadProducts = async () => {
  try {
    const maxProducts = props.limit
    if (maxProducts <= 0) {
      loading.value = false
      return
    }

    const maxPageSize = 250
    let hasNextPage = true
    let after: string | null = null

    while (hasNextPage && products.value.length < maxProducts) {
      const remaining = maxProducts - products.value.length
      const first = Math.min(props.pageSize, remaining, maxPageSize)
      const data = (await fetchProducts({ first, after })) as ShopifyProductsResponse
      const connection = data.data?.products
      const newEdges = connection?.edges ?? []

      if (!newEdges.length) {
        hasNextPage = false
        break
      }

      products.value = products.value.concat(newEdges)
      hasNextPage = Boolean(connection?.pageInfo?.hasNextPage)
      after = connection?.pageInfo?.endCursor ?? null
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to load products right now.'
    error.value = message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.shopify-product-grid {
  margin-top: $spacing-xl * 1.5;
}

.status-message {
  text-align: center;
  padding: $spacing-xl;
  border-radius: 18px;
  backdrop-filter: blur(18px);
  background: rgba($white, 0.05);
  border: 1px solid rgba($white, 0.08);
  color: rgba($white, 0.9);
  font-size: 1.1rem;

  &.loading {
    color: rgba($white, 0.75);
  }

  &.error {
    color: lighten($danger-color, 10%);
    border-color: rgba($danger-color, 0.4);
  }

  &.empty {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    color: rgba($white, 0.85);
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-xl;
}

.product-card {
  backdrop-filter: blur(20px);
  background: rgba($white, 0.08);
  border: 1px solid rgba($white, 0.12);
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
    border-color: rgba($white, 0.22);
  }
}

.product-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.product-image {
  background: linear-gradient(135deg, rgba($primary-color, 0.35), rgba($accent-sage, 0.35));
  height: 300px;
  width: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
}

.product-card:hover img {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: rgba($white, 0.6);
  background: linear-gradient(135deg, rgba($accent-color, 0.2), rgba($primary-color, 0.25));
}

.product-info {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.product-title {
  color: $white;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.price {
  color: $accent-gold;
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0;
}

.description {
  color: rgba($white, 0.75);
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0;
}

@media (max-width: $breakpoint-md) {
  .shopify-product-grid {
    margin-top: $spacing-xl;
  }

  .product-image {
    height: 240px;
  }

  .product-grid {
    gap: $spacing-lg;
  }
}
</style>
