<template>
  <div class="shopify-product-grid">
    <div v-if="loading" class="status-message loading">Loading products...</div>
    <div v-else-if="error" class="status-message error">{{ error }}</div>
    <div v-else-if="!products.length" class="status-message empty">
      <slot name="empty">
        <p>No products are available right now. Please check back soon.</p>
      </slot>
    </div>
    <div v-else class="categorized-products">
      <section
        v-for="group in categorizedProducts"
        :key="group.category"
        class="category-block"
        :aria-label="group.category"
      >
        <header class="category-header">
          <h3 class="category-title">{{ group.category }}</h3>
          <span class="category-count" aria-hidden="true">{{ group.products.length }} items</span>
        </header>
        <div class="product-grid" role="list">
          <article
            v-for="product in group.products"
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
      </section>
    </div>
    <div v-if="debugEnabled" class="debug-panel">
      <div class="debug-header">
        <span class="debug-summary">
          Debug: {{ products.length }} products • {{ categorizedProducts.length }} categories • {{ debugLogs.length }} fetches
        </span>
        <button class="debug-toggle" type="button" @click="showDebug = !showDebug">
          {{ showDebug ? 'Hide Debug' : 'Show Debug' }}
        </button>
      </div>
      <div v-if="showDebug" class="debug-logs">
        <div v-for="(entry, index) in debugLogs" :key="entry.timestamp" class="debug-entry">
          <div class="debug-meta">
            <span>Batch {{ index + 1 }} • {{ entry.timestamp }}</span>
            <span>{{ entry.responseEdges }} items (total {{ entry.totalLoaded }})</span>
          </div>
          <div class="debug-body">
            <pre>{{ JSON.stringify(entry, null, 2) }}</pre>
          </div>
        </div>
        <div class="debug-entry">
          <div class="debug-meta">
            <span>Aggregated Products</span>
            <span>Total {{ products.length }}</span>
          </div>
          <div class="debug-body">
            <pre>{{ formattedProducts }}</pre>
          </div>
        </div>
        <div class="debug-entry">
          <div class="debug-meta">
            <span>Categorized Products</span>
            <span>{{ categorizedProducts.length }} groups</span>
          </div>
          <div class="debug-body">
            <pre>{{ formattedCategories }}</pre>
          </div>
        </div>
      </div>
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
  debug: {
    type: Boolean,
    default: false,
  },
})

const { fetchProducts } = useShopify()
const products = ref<ProductEdge[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const debugLogs = ref<DebugLogEntry[]>([])
const showDebug = ref(false)

type CategorizedProductGroup = {
  category: string
  products: ProductEdge[]
}

type DebugLogEntry = {
  timestamp: string
  request: {
    first: number
    after: string | null
  }
  responseEdges: number
  totalLoaded: number
  edges: ProductEdge[]
}

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

const debugEnabled = computed(() => props.debug || process.dev)
const formattedProducts = computed(() => JSON.stringify(products.value, null, 2))

type CategoryRule = {
  label: string
  match: (handle: string) => boolean
}

const categoryRules: CategoryRule[] = [
  { label: 'Holiday Sets', match: (handle) => handle.includes('holiday-set') },
  { label: 'Pasta & Love', match: (handle) => handle.startsWith('pasta-love') },
  { label: 'Alchemic', match: (handle) => handle.startsWith('alchemic') },
  { label: 'Authentic', match: (handle) => handle.startsWith('authentic') },
  { label: 'DEDE', match: (handle) => handle.startsWith('dede') },
  { label: 'LOVE Curl', match: (handle) => handle.startsWith('love-curl') },
  { label: 'LOVE Smoothing', match: (handle) => handle.startsWith('love-smoothing') },
  { label: 'LOVE', match: (handle) => handle.startsWith('love') },
  { label: 'MELU', match: (handle) => handle.startsWith('melu') },
  { label: 'MINU', match: (handle) => handle.startsWith('minu') },
  { label: 'MOMO', match: (handle) => handle.startsWith('momo') },
  { label: 'Naturaltech', match: (handle) => handle.startsWith('naturaltech') },
]

const toTitleCase = (value: string) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

const deriveCategoryFromHandle = (handle: string) => {
  const normalized = handle.toLowerCase()
  const matched = categoryRules.find((rule) => rule.match(normalized))
  if (matched) {
    return matched.label
  }

  const [firstSegment] = normalized.split('-')
  return firstSegment ? toTitleCase(firstSegment) : 'Other'
}

const categorizedProducts = computed<CategorizedProductGroup[]>(() => {
  if (!products.value.length) {
    return []
  }

  const groups = new Map<string, ProductEdge[]>()
  const order: string[] = []

  products.value.forEach((edge) => {
    const category = deriveCategoryFromHandle(edge.node.handle)
    if (!groups.has(category)) {
      groups.set(category, [])
      order.push(category)
    }
    groups.get(category)!.push(edge)
  })

  return order.map((category) => ({
    category,
    products: [...(groups.get(category) || [])].sort((a, b) =>
      a.node.title.localeCompare(b.node.title, 'en', { sensitivity: 'base' })
    ),
  }))
})

const formattedCategories = computed(() => JSON.stringify(categorizedProducts.value, null, 2))

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

      if (debugEnabled.value) {
        const timestamp = new Date().toISOString()
        const safeEdges = JSON.parse(JSON.stringify(newEdges))
        console.groupCollapsed(
          `[ShopifyProductGrid] Batch ${debugLogs.value.length + 1} @ ${timestamp}`,
        )
        console.log('Request', { first, after })
        console.log('Response edges', safeEdges)
        console.groupEnd()
        debugLogs.value.push({
          timestamp,
          request: { first, after },
          responseEdges: safeEdges.length,
          totalLoaded: products.value.length + safeEdges.length,
          edges: safeEdges,
        })
      }

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

.categorized-products {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl * 1.5;
}

.category-block {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.category-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: $spacing-sm;
}

.category-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: $white;
  margin: 0;
}

.category-count {
  font-size: 0.95rem;
  color: rgba($white, 0.65);
  border: 1px solid rgba($white, 0.12);
  border-radius: 999px;
  padding: 0.1rem 0.6rem;
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

  .category-title {
    font-size: 1.4rem;
  }
}

.debug-panel {
  margin-top: $spacing-xl;
  padding: $spacing-lg;
  border-radius: 16px;
  background: rgba($white, 0.08);
  border: 1px solid rgba($white, 0.12);
  backdrop-filter: blur(14px);
  color: $white;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.debug-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.debug-toggle {
  appearance: none;
  border: 1px solid rgba($white, 0.2);
  background: rgba($accent-color, 0.4);
  color: $white;
  padding: $spacing-xs $spacing-sm;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba($accent-gold, 0.4);
    background: rgba($accent-gold, 0.35);
  }
}

.debug-logs {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  max-height: 300px;
  overflow-y: auto;
}

.debug-entry {
  padding: $spacing-sm;
  border-radius: 12px;
  background: rgba($white, 0.06);
  border: 1px solid rgba($white, 0.08);
}

.debug-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: $spacing-xs;
  color: rgba($white, 0.75);
}

.debug-body {
  font-size: 0.8rem;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 8px;
  padding: $spacing-xs;
  max-height: 200px;
  overflow: auto;
}

.debug-body pre {
  margin: 0;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.8rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

.debug-summary {
  font-size: 0.85rem;
  color: rgba($white, 0.8);
}
</style>
