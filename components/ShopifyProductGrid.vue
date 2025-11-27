<template>
  <div class="shopify-product-grid">
    <div v-if="loading" class="status-message loading">
      <span class="status-label">Loading products...</span>
      <span class="status-helper">We&apos;re preparing the Vivarium collection for you.</span>
    </div>
    <div v-else-if="error" class="status-message error">
      <span class="status-label">There was a hiccup</span>
      <span class="status-helper">{{ error }}</span>
    </div>
    <div v-else-if="!products.length" class="status-message empty">
      <slot name="empty">
        <p>No products are available right now. Please check back soon.</p>
      </slot>
    </div>
    <div v-else class="product-experience">
      <div class="section-header-row">
        <div class="search-container">
          <div class="search-input-wrapper">
            <Icon icon="heroicons:magnifying-glass" class="search-icon" />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search products..."
              class="search-input"
            />
          </div>
        </div>
        <header class="section-head">
          <h3 v-if="viewMode === 'collections'" id="collection-browser-heading">Shop by Collection</h3>
          <h3 v-else id="all-products-heading">All Products</h3>
          <p v-if="viewMode === 'collections'" class="section-description">Select a ritual to explore salon-trusted essentials.</p>
          <p v-else class="section-description">Browse every Vivarium favorite in one streamlined view.</p>
        </header>
      </div>
      <div class="view-toggle">
        <button
          type="button"
          class="view-toggle-btn"
          :class="{ active: viewMode === 'collections' }"
          @click="viewMode = 'collections'"
        >
          Shop Collections
        </button>
        <button
          type="button"
          class="view-toggle-btn"
          :class="{ active: viewMode === 'all' }"
          @click="viewMode = 'all'"
        >
          Shop All Products
        </button>
      </div>
      <Transition name="view-fade" mode="out-in">
        <section
          v-if="viewMode === 'all'"
          key="all-products"
          class="all-products-section"
        >
          <div class="product-grid all-products-grid" role="list">
            <article
              v-for="product in allProductsList"
              :key="product.node.id"
              class="product-card"
              role="listitem"
            >
              <button
                type="button"
                class="product-trigger"
                @click="openProductModal(product)"
              >
                <div class="product-image">
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
                  <span class="product-category">{{ resolveCategoryForProduct(product) }}</span>
                  <h4 class="product-title">{{ product.node.title }}</h4>
                </div>
              </button>
              <button
                type="button"
                class="product-add-btn"
                :disabled="!isVariantAvailable(product)"
                @click.prevent.stop="handleQuickAdd(product)"
              >
                <span class="btn-text">{{ isVariantAvailable(product) ? 'Add to Cart' : 'Out of Stock' }}</span>
                <span class="btn-price">
                  {{
                    formatPrice(
                      product.node.priceRange.minVariantPrice.amount,
                      product.node.priceRange.minVariantPrice.currencyCode,
                    )
                  }}
                </span>
              </button>
            </article>
          </div>
        </section>
        <div v-else-if="viewMode === 'collections'" key="collection-view" class="category-view">
          <section
            ref="categorySectionRef"
            class="category-section"
          >
            <div class="category-display">
              <aside class="category-nav" aria-label="Product collections">
                <nav
                  class="category-tabs"
                  role="tablist"
                  aria-orientation="vertical"
                  aria-label="Collection tabs"
                >
                  <button
                    v-for="(group, index) in categorizedProducts"
                    :key="group.category"
                    :ref="(el) => setCategoryTabRef(el, index)"
                    class="category-tab"
                    type="button"
                    role="tab"
                    :id="getCategoryTabId(group.category)"
                    :aria-controls="getCategoryPanelId(group.category)"
                    :aria-selected="group.category === activeCategoryName"
                    :tabindex="group.category === activeCategoryName ? 0 : -1"
                    :class="{
                      'is-active': group.category === activeCategoryName,
                    }"
                    @click="selectCategory(group.category)"
                    @keydown="handleTabKeydown($event, index)"
                  >
                    <div class="tab-header">
                      <Icon
                        :icon="categoryDetailLookup[group.category]?.icon || 'heroicons:question-mark-circle'"
                        class="tab-icon"
                      />
                      <span class="tab-label">{{ group.category }}</span>
                    </div>
                    <span
                      v-if="categoryDetailLookup[group.category]?.tagline"
                      class="tab-tagline"
                    >
                      {{ categoryDetailLookup[group.category]?.tagline }}
                    </span>
                  </button>
                </nav>
              </aside>
              <Transition name="category-fade" mode="out-in">
                <section
                  v-if="activeCategoryGroup"
                  :key="activeCategoryName || 'unselected'"
                  :id="getCategoryPanelId(activeCategoryName)"
                  class="category-products"
                  role="tabpanel"
                  :aria-labelledby="getCategoryTabId(activeCategoryName)"
                  tabindex="0"
                >
                  <header class="category-summary">
                    <div class="category-overview">
                      <p class="category-kicker">
                        {{ activeCategoryDetail?.tagline }}
                      </p>
                      <h4 class="category-title">
                        <Icon
                          :icon="activeCategoryDetail?.icon || 'heroicons:question-mark-circle'"
                          class="category-title-icon"
                        />
                        {{ activeCategoryName }}
                      </h4>
                      <p class="category-description">
                        {{ activeCategoryDetail?.description }}
                      </p>
                    </div>
                  </header>
                  <div v-if="activeProducts.length" class="product-grid" role="list">
                    <article
                      v-for="product in activeProducts"
                      :key="product.node.id"
                      class="product-card"
                      role="listitem"
                    >
                      <button
                        type="button"
                        class="product-trigger"
                        @click="openProductModal(product)"
                      >
                        <div class="product-image">
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
                        </div>
                      </button>
                      <button
                        type="button"
                        class="product-add-btn"
                        :disabled="!isVariantAvailable(product)"
                        @click.prevent.stop="handleQuickAdd(product)"
                      >
                        <span class="btn-text">{{ isVariantAvailable(product) ? 'Add to Cart' : 'Out of Stock' }}</span>
                        <span class="btn-price">
                          {{
                            formatPrice(
                              product.node.priceRange.minVariantPrice.amount,
                              product.node.priceRange.minVariantPrice.currencyCode,
                            )
                          }}
                        </span>
                      </button>
                    </article>
                  </div>
                  <div v-else class="category-empty">
                    <p>We&apos;re curating this collection. Check back soon for new arrivals.</p>
                  </div>
                </section>
              </Transition>
            </div>
          </section>
        </div>
      </Transition>
    </div>

    <Teleport to="body">
      <Transition name="product-modal">
        <div
          v-if="showProductModal"
          class="product-modal-overlay"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="productModalTitleId"
          :aria-describedby="productModalDescriptionId"
          @click.self="closeProductModal()"
        >
          <div class="product-modal" tabindex="-1">
            <button
              ref="modalCloseButtonRef"
              type="button"
              class="product-modal__close"
              aria-label="Close product details"
              @click="closeProductModal()"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="product-modal__scroller" ref="productModalRef">
              <div class="product-modal__content">
                <div class="product-modal__media" aria-hidden="true">
                  <template v-if="selectedProductImage">
                    <img
                      :src="selectedProductImage.url"
                      :alt="selectedProductImage.altText || selectedProduct?.node.title"
                    />
                  </template>
                  <template v-else>
                    <div class="product-modal__placeholder">
                      {{ selectedProduct?.node.title.charAt(0) }}
                    </div>
                  </template>
                </div>
                <div class="product-modal__details">
                  <p v-if="selectedModalCategory" class="product-modal__kicker">
                    {{ selectedModalCategory }} Collection
                  </p>
                  <h3 :id="productModalTitleId" class="product-modal__title">
                    {{ selectedProduct?.node.title }}
                  </h3>
                  <p v-if="selectedProduct?.node.productType" class="product-modal__type">
                    {{ selectedProduct.node.productType }}
                  </p>
                  <div v-if="selectedProductPriceRange" class="product-modal__price">
                    {{
                      formatPrice(
                        selectedProductPriceRange.amount,
                        selectedProductPriceRange.currencyCode,
                      )
                    }}
                  </div>
                  <div :id="productModalDescriptionId" class="product-modal__description">
                    <p v-for="(line, index) in selectedProductDescriptionLines" :key="index">
                      {{ line }}
                    </p>
                  </div>
                  <ul v-if="selectedProductTags.length" class="product-modal__tags">
                    <li v-for="tag in selectedProductTags" :key="tag">{{ tag }}</li>
                  </ul>
                  <div class="product-modal__actions">
                    <template v-if="selectedVariantAvailable">
                      <button
                        v-if="selectedVariantQuantity === 0"
                        type="button"
                        class="modal-add-btn"
                        @click="handleModalAdd"
                      >
                        Add to Cart
                      </button>
                      <div v-else class="modal-quantity">
                        <button
                          type="button"
                          class="quantity-btn"
                          aria-label="Decrease quantity"
                          @click="decrementSelectedQuantity"
                        >
                          &minus;
                        </button>
                        <span class="quantity-value" aria-live="polite">
                          {{ selectedVariantQuantity }}
                        </span>
                        <button
                          type="button"
                          class="quantity-btn"
                          aria-label="Increase quantity"
                          @click="incrementSelectedQuantity"
                        >
                          +
                        </button>
                      </div>
                    </template>
                    <span v-else class="product-modal__soldout">Currently out of stock</span>
                  </div>
                </div>
              </div>

              <section
                v-if="recommendedProducts.length"
                class="product-modal__recommendations"
                aria-labelledby="product-modal-recommendations-heading"
              >
                <header class="recommendations-head">
                  <h4 id="product-modal-recommendations-heading">{{ recommendedSectionTitle }}</h4>
                  <p v-if="selectedModalCategory" class="recommendations-sub">
                    Discover Curated Favorites
                  </p>
                </header>
                <div class="recommendations-track" role="list">
                  <article
                    v-for="recommended in recommendedProducts"
                    :key="recommended.node.id"
                    class="recommendation-card"
                    role="listitem"
                  >
                    <button
                      type="button"
                      class="recommendation-card__trigger"
                      @click="openProductModal(recommended)"
                    >
                      <div class="recommendation-card__media" aria-hidden="true">
                        <template v-if="recommended.node.images.edges.length">
                          <img
                            :src="recommended.node.images.edges[0].node.url"
                            :alt="recommended.node.images.edges[0].node.altText || recommended.node.title"
                          />
                        </template>
                        <template v-else>
                          <div class="recommendation-card__placeholder">
                            {{ recommended.node.title.charAt(0) }}
                          </div>
                        </template>
                      </div>
                      <div class="recommendation-card__body">
                        <span class="recommendation-card__category">
                          {{ resolveCategoryForProduct(recommended) }}
                        </span>
                        <span class="recommendation-card__title">{{ recommended.node.title }}</span>
                        <span class="recommendation-card__price">
                          {{
                            formatPrice(
                              recommended.node.priceRange.minVariantPrice.amount,
                              recommended.node.priceRange.minVariantPrice.currencyCode,
                            )
                          }}
                        </span>
                      </div>
                    </button>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div v-if="debugEnabled" class="debug-panel">
      <div class="debug-header">
        <span class="debug-summary">
          Debug: {{ products.length }} products • {{ categorizedProducts.length }} collections • {{ debugLogs.length }} fetches
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
import type { ComponentPublicInstance, PropType } from 'vue'
import { Icon } from '@iconify/vue'
import { useCart } from '@/composables/useCart'
type ProductImageEdge = {
  node: {
    url: string
    altText: string | null
  }
}

type ProductVariantEdge = {
  node: {
    id: string
    availableForSale: boolean
    title?: string | null
  }
}

type ProductCategoryMetafield = {
  value: string | null
  type: string | null
} | null

type ProductEdge = {
  cursor: string
  node: {
    id: string
    title: string
    handle: string
    description: string
    productType?: string | null
    tags: string[]
    categoryMetafield?: ProductCategoryMetafield
    priceRange: {
      minVariantPrice: {
        amount: string
        currencyCode: string
      }
      maxVariantPrice?: {
        amount: string
        currencyCode: string
      }
    }
    images: {
      edges: ProductImageEdge[]
    }
    variants: {
      edges: ProductVariantEdge[]
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
  viewMode: {
    type: String as PropType<'collections' | 'all'>,
    default: 'collections',
    validator: (value: string) => ['collections', 'all'].includes(value),
  },
})

const { fetchProducts } = useShopify()
const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart()
const products = ref<ProductEdge[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const debugLogs = ref<DebugLogEntry[]>([])
const showDebug = ref(false)
const activeCategory = ref<string | null>(null)
const categorySectionRef = ref<HTMLElement | null>(null)
const categoryTabRefs = ref<Array<HTMLElement | null>>([])
const selectedProduct = ref<ProductEdge | null>(null)
const modalCloseButtonRef = ref<HTMLButtonElement | null>(null)
const productModalRef = ref<HTMLDivElement | null>(null)
const previousBodyOverflow = ref<string | null>(null)
const viewMode = ref<'collections' | 'all'>(props.viewMode)
const searchQuery = ref('')

const route = useRoute()
const router = useRouter()
const pendingRouteHandle = ref<string | null>(null)

const showProductModal = computed(() => Boolean(selectedProduct.value))
const productModalTitleId = computed(() =>
  selectedProduct.value ? `product-modal-${selectedProduct.value.node.handle}-title` : 'product-modal-title',
)
const productModalDescriptionId = computed(() =>
  selectedProduct.value
    ? `product-modal-${selectedProduct.value.node.handle}-description`
    : 'product-modal-description',
)
const selectedProductPriceRange = computed(
  () => selectedProduct.value?.node.priceRange.minVariantPrice ?? null,
)
const selectedProductImage = computed(() => selectedProduct.value?.node.images.edges[0]?.node ?? null)
const selectedProductTags = computed(() =>
  selectedProduct.value
    ? selectedProduct.value.node.tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length)
        .slice(0, 6)
    : [],
)

const routeProductHandle = computed(() => {
  const raw = route.query.product
  if (Array.isArray(raw)) {
    return raw[0] ?? null
  }

  return raw ? String(raw) : null
})

const selectedProductDescriptionLines = computed(() => {
  if (!selectedProduct.value) {
    return []
  }

  return selectedProduct.value.node.description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length)
})

const getCategoryIdentifier = (category: string | null | undefined) => {
  const canonical = category ? canonicalizeCategory(category) : ''
  return canonical.length ? canonical : 'collection'
}

const getCategoryTabId = (category: string | null | undefined) =>
  `collection-tab-${getCategoryIdentifier(category)}`

const getCategoryPanelId = (category: string | null | undefined) =>
  `collection-panel-${getCategoryIdentifier(category)}`

const setCategoryTabRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el && '$el' in el ? (el.$el as HTMLElement | null) : (el as HTMLElement | null)
  categoryTabRefs.value[index] = element instanceof HTMLElement ? element : null
}

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
const allProductsList = computed(() => {
  let filteredProducts = [...products.value]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filteredProducts = filteredProducts.filter(product =>
      product.node.title.toLowerCase().includes(query) ||
      product.node.description?.toLowerCase().includes(query) ||
      product.node.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filteredProducts.sort((a, b) =>
    a.node.title.localeCompare(b.node.title, 'en', { sensitivity: 'base' })
  )
})

const categoryOrder = [
  'Essential Haircare',
  'Naturaltech',
  'OI',
  'More Inside',
  'Heart of Glass',
  'Pasta & Love',
  'Alchemic System',
  'Authentic',
  'Essential Haircare Shampoo Bars',
  'Hair Refresher',
]

type CategoryDetail = {
  title: string
  tagline: string
  description: string
  icon: string
}

const categoryDetailLookup: Record<string, CategoryDetail> = {
  'Essential Haircare': {
    title: 'Essential Haircare',
    tagline: 'Daily Ritual Care',
    description:
      'Hydration-forward haircare designed for balanced, weightless strength every day.',
    icon: 'heroicons:sparkles',
  },
  Naturaltech: {
    title: 'Naturaltech',
    tagline: 'Scalp Science Systems',
    description:
      'Targeted scalp and hair treatments powered by trichology research and natural actives.',
    icon: 'heroicons:beaker',
  },
  OI: {
    title: 'OI',
    tagline: 'Iconic Shine Ritual',
    description:
      'Multi-tasking favorites that deliver instant gloss, softness, and signature fragrance.',
    icon: 'heroicons:sun',
  },
  'More Inside': {
    title: 'More Inside',
    tagline: 'Styling Storytellers',
    description:
      'High-performance styling formulas that sculpt, define, and finish every look with touchable texture.',
    icon: 'heroicons:scissors',
  },
  'Heart of Glass': {
    title: 'Heart of Glass',
    tagline: 'Blonde Brilliance',
    description:
      'Blue and purple botanicals neutralize brass while fortifying delicate blonde strands.',
    icon: 'heroicons:bolt',
  },
  'Pasta & Love': {
    title: 'Pasta & Love',
    tagline: 'Modern Grooming',
    description:
      'Italian-crafted grooming essentials for clean lines, subtle texture, and skin comfort.',
    icon: 'heroicons:rectangle-stack',
  },
  'Alchemic System': {
    title: 'Alchemic System',
    tagline: 'Color-Enhancing Pigments',
    description:
      'Customizable pigments refresh tone and extend color vibrancy between salon visits.',
    icon: 'heroicons:swatch',
  },
  Authentic: {
    title: 'Authentic',
    tagline: 'Multi-Use Clean Beauty',
    description:
      'Certified natural oils for hair, face, and body with minimalist ingredients.',
    icon: 'heroicons:star',
  },
  'Essential Haircare Shampoo Bars': {
    title: 'Essential Haircare Shampoo Bars',
    tagline: 'Sustainable Solids',
    description:
      'Low-waste shampoo bars that deliver the same luxurious results in solid form.',
    icon: 'heroicons:recycle',
  },
  'Hair Refresher': {
    title: 'Hair Refresher',
    tagline: 'Instant Reset',
    description:
      'Lightweight dry spray revives hair between washes with freshness and volume.',
    icon: 'heroicons:arrow-path',
  },
}

type CategoryRule = {
  label: string
  match: (handle: string) => boolean
}

const essentialHaircarePrefixes = [
  'dede',
  'love',
  'minu',
  'melu',
  'momo',
  'nounou',
  'solu',
  'volu',
  'replumping',
  'energizing',
  'purifying',
  'detoxifying',
]

const categoryRules: CategoryRule[] = [
  { label: 'Alchemic System', match: (handle) => handle.startsWith('alchemic') },
  { label: 'Authentic', match: (handle) => handle.startsWith('authentic') },
  {
    label: 'Essential Haircare Shampoo Bars',
    match: (handle) => handle.includes('shampoo-bar') || handle.includes('shampobar'),
  },
  {
    label: 'Hair Refresher',
    match: (handle) => handle.includes('hair-refresher'),
  },
  { label: 'Heart of Glass', match: (handle) => handle.startsWith('heart-of-glass') },
  { label: 'Liquid Spell', match: (handle) => handle.startsWith('liquid-spell') },
  {
    label: 'Naturaltech',
    match: (handle) =>
      handle.startsWith('naturaltech') || handle.includes('naturaltech-') || handle.includes('natural-tech'),
  },
  {
    label: 'Pasta & Love',
    match: (handle) => handle.includes('pasta') || handle.startsWith('pasta-love'),
  },
  {
    label: 'More Inside',
    match: (handle) =>
      handle.includes('more-inside') || handle.startsWith('moreinside') || handle.includes('moreinside-'),
  },
  { label: 'OI', match: (handle) => handle.startsWith('oi') || handle.includes('oi-') },
  {
    label: 'Essential Haircare',
    match: (handle) => essentialHaircarePrefixes.some((prefix) => handle.startsWith(prefix)),
  },
]

const canonicalizeCategory = (label: string) => label.toLowerCase().replace(/[^a-z0-9]/g, '')

const categoryLabelLookup = new Map(
  categoryRules.map((rule) => [canonicalizeCategory(rule.label), rule.label]),
)

const findKnownCategory = (label: string) => {
  const canonical = canonicalizeCategory(label)
  if (!canonical.length) {
    return null
  }

  const directMatch = categoryLabelLookup.get(canonical)
  if (directMatch) {
    return directMatch
  }

  for (const [storedKey, storedLabel] of categoryLabelLookup.entries()) {
    if (canonical.startsWith(storedKey) || storedKey.startsWith(canonical)) {
      return storedLabel
    }
  }

  return null
}

const deriveCategoryFromHandle = (handle: string) => {
  const normalized = handle.toLowerCase()
  const matched = categoryRules.find((rule) => rule.match(normalized))
  if (matched) {
    return matched.label
  }

  return 'Essential Haircare'
}

const parseMetafieldValues = (metafield: ProductCategoryMetafield): string[] => {
  if (!metafield?.value) {
    return []
  }

  const rawValue = metafield.value.trim()
  if (!rawValue.length) {
    return []
  }

  const type = metafield.type || ''

  const tryParseJson = () => {
    try {
      const parsed = JSON.parse(rawValue)
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => (typeof item === 'string' ? item : String(item)))
          .filter((item) => item.trim().length)
      }
      if (parsed && typeof parsed === 'object') {
        return Object.values(parsed)
          .map((item) => (typeof item === 'string' ? item : String(item)))
          .filter((item) => item.trim().length)
      }
      if (parsed !== null && parsed !== undefined) {
        return [String(parsed)]
      }
    } catch (error) {
      return []
    }
    return []
  }

  if (type.startsWith('list.') || type === 'json') {
    const parsed = tryParseJson()
    if (parsed.length) {
      return parsed
    }
  }

  if (type === 'number_integer' || type === 'number_decimal') {
    return [rawValue]
  }

  const segments = rawValue
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length)

  return segments.length ? segments : [rawValue]
}

const normalizeCategoryLabel = (label: string) => {
  const cleaned = label.trim()
  if (!cleaned.length) {
    return null
  }

  const spacingNormalized = cleaned.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  const known = findKnownCategory(spacingNormalized)
  if (known) {
    return known
  }

  return spacingNormalized
}

const getCategoryFromMetafield = (edge: ProductEdge) => {
  const values = parseMetafieldValues(edge.node.categoryMetafield || null)
  if (!values.length) {
    return null
  }

  const normalized = values
    .map((value) => normalizeCategoryLabel(value))
    .filter((value): value is string => Boolean(value))

  if (!normalized.length) {
    return null
  }

  for (const value of normalized) {
    const known = findKnownCategory(value)
    if (known) {
      return known
    }
  }

  return normalized[0]
}

const tagCategoryPrefixes = [
  'category:',
  'category -',
  'collection:',
  'collections:',
  'line:',
  'series:',
  'range:',
  'family:',
]

const getCategoryFromTags = (edge: ProductEdge) => {
  const tags = Array.isArray(edge.node.tags) ? edge.node.tags : []
  if (!tags.length) {
    return null
  }

  const candidates: string[] = []

  tags.forEach((tag) => {
    const cleaned = tag.trim()
    if (!cleaned.length) {
      return
    }

    const lower = cleaned.toLowerCase()
    const prefix = tagCategoryPrefixes.find((candidatePrefix) =>
      lower.startsWith(candidatePrefix),
    )

    if (prefix) {
      const value = cleaned.slice(prefix.length).trim()
      if (value.length) {
        candidates.push(value)
      }
      return
    }

    candidates.push(cleaned)
})

  if (!candidates.length) {
    return null
  }

  const normalized = candidates
    .map((candidate) => normalizeCategoryLabel(candidate))
    .filter((value): value is string => Boolean(value))

  if (!normalized.length) {
    return null
  }

  for (const value of normalized) {
    const known = findKnownCategory(value)
    if (known) {
      return known
    }
  }

  return normalized[0]
}

const resolveCategoryForProduct = (edge: ProductEdge) => {
  const metafieldCategory = getCategoryFromMetafield(edge)
  if (metafieldCategory) {
    return metafieldCategory
  }

  const tagCategory = getCategoryFromTags(edge)
  if (tagCategory) {
    return tagCategory
  }

  return deriveCategoryFromHandle(edge.node.handle)
}

const selectedModalCategory = computed(() =>
  selectedProduct.value ? resolveCategoryForProduct(selectedProduct.value) : null,
)

const recommendedProducts = computed<ProductEdge[]>(() => {
  const current = selectedProduct.value
  if (!current) {
    return []
  }

  const currentId = current.node.id
  const currentCategory = resolveCategoryForProduct(current)
  const sameCategory: ProductEdge[] = []
  const otherCategory: ProductEdge[] = []

  products.value.forEach((edge) => {
    if (edge.node.id === currentId) {
      return
    }

    const category = resolveCategoryForProduct(edge)
    if (category === currentCategory) {
      sameCategory.push(edge)
    } else {
      otherCategory.push(edge)
    }
  })

  const combined: ProductEdge[] = []
  const pushUnique = (list: ProductEdge[]) => {
    for (const item of list) {
      if (!combined.some((existing) => existing.node.id === item.node.id)) {
        combined.push(item)
        if (combined.length >= 10) {
          break
        }
      }
    }
  }

  pushUnique(sameCategory)
  if (combined.length < 10) {
    pushUnique(otherCategory)
  }

  return combined.slice(0, 10)
})

const recommendedSectionTitle = computed(() => {
  const category = selectedModalCategory.value
  if (category) {
    return `More from ${category}`
  }
  return 'Recommended for you'
})

const categorizedProducts = computed<CategorizedProductGroup[]>(() => {
  const groups = new Map<string, ProductEdge[]>()

  categoryOrder.forEach((label) => {
    groups.set(label, [])
  })

  products.value.forEach((edge) => {
    const category = resolveCategoryForProduct(edge)
    if (!groups.has(category)) {
      groups.set(category, [])
    }
    groups.get(category)!.push(edge)
  })

  return Array.from(groups.entries())
    .map(([category, items]) => {
      let filteredProducts = [...items]

      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        filteredProducts = filteredProducts.filter(product =>
          product.node.title.toLowerCase().includes(query) ||
          product.node.description?.toLowerCase().includes(query) ||
          product.node.tags?.some(tag => tag.toLowerCase().includes(query))
        )
      }

      const sortedProducts = filteredProducts.sort((a, b) =>
        a.node.title.localeCompare(b.node.title, 'en', { sensitivity: 'base' })
      )

      return {
        category,
        products: sortedProducts,
      }
    })
    .filter((group) => categoryDetailLookup[group.category])
    .filter((group) => group.products.length > 0)
    .sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.category)
      const bIndex = categoryOrder.indexOf(b.category)
      if (aIndex === -1 && bIndex === -1) {
        return a.category.localeCompare(b.category, 'en', { sensitivity: 'base' })
      }
      if (aIndex === -1) {
        return 1
      }
      if (bIndex === -1) {
        return -1
      }
      return aIndex - bIndex
    })
})

const formattedCategories = computed(() => JSON.stringify(categorizedProducts.value, null, 2))

const activeCategoryGroup = computed(() => {
  if (!categorizedProducts.value.length) {
    return null
  }

  if (activeCategory.value) {
    return (
      categorizedProducts.value.find((group) => group.category === activeCategory.value) || null
    )
  }

  return (
    categorizedProducts.value.find((group) => group.products.length) ||
    categorizedProducts.value[0] ||
    null
  )
})

const activeCategoryName = computed(() => activeCategoryGroup.value?.category ?? null)
const activeCategoryDetail = computed(() =>
  activeCategoryName.value ? categoryDetailLookup[activeCategoryName.value] : null,
)

const activeProducts = computed(() => activeCategoryGroup.value?.products ?? [])

watch(
  categorizedProducts,
  (groups) => {
    if (!groups.length) {
      activeCategory.value = null
      return
    }

    if (activeCategory.value && groups.some((group) => group.category === activeCategory.value)) {
      return
    }

    const nextCategory = (groups.find((group) => group.products.length) || groups[0])?.category
    activeCategory.value = nextCategory ?? null
  },
  { immediate: true },
)

onBeforeUpdate(() => {
  categoryTabRefs.value = []
})

const handleGlobalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showProductModal.value) {
    event.preventDefault()
    closeProductModal()
  }
}

watch(showProductModal, (isOpen) => {
  if (!process.client) {
    return
  }

  if (isOpen) {
    previousBodyOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleGlobalKeydown)
  } else {
    window.removeEventListener('keydown', handleGlobalKeydown)
    if (previousBodyOverflow.value !== null) {
      document.body.style.overflow = previousBodyOverflow.value
      previousBodyOverflow.value = null
    }
  }
})

onBeforeUnmount(() => {
  if (!process.client) {
    return
  }

  window.removeEventListener('keydown', handleGlobalKeydown)
  if (previousBodyOverflow.value !== null) {
    document.body.style.overflow = previousBodyOverflow.value
    previousBodyOverflow.value = null
  }
})

const scrollToCollections = () => {
  if (typeof window === 'undefined') {
    return
  }

  const target = categorySectionRef.value
  if (!target) {
    return
  }

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const selectCategory = (category: string) => {
  if (!categorizedProducts.value.some((group) => group.category === category)) {
    return
  }

  if (activeCategory.value === category) {
    scrollToCollections()
    return
  }

  activeCategory.value = category
  scrollToCollections()
}

const focusCategoryAtIndex = (index: number) => {
  const target = categoryTabRefs.value[index]
  if (target) {
    target.focus()
  }
}

const findNextEnabledIndex = (currentIndex: number, direction: 1 | -1) => {
  const groups = categorizedProducts.value
  if (!groups.length) {
    return currentIndex
  }

  const total = groups.length
  const nextIndex = (currentIndex + direction + total) % total
  return nextIndex
}

const handleTabKeydown = (event: KeyboardEvent, index: number) => {
  if (!categorizedProducts.value.length) {
    return
  }

  const { key } = event

  if (key === 'ArrowRight' || key === 'ArrowDown') {
    event.preventDefault()
    const nextIndex = findNextEnabledIndex(index, 1)
    if (nextIndex !== index) {
      selectCategory(categorizedProducts.value[nextIndex].category)
      focusCategoryAtIndex(nextIndex)
    }
    return
  }

  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    event.preventDefault()
    const nextIndex = findNextEnabledIndex(index, -1)
    if (nextIndex !== index) {
      selectCategory(categorizedProducts.value[nextIndex].category)
      focusCategoryAtIndex(nextIndex)
    }
    return
  }

  if (key === 'Home') {
    event.preventDefault()
    selectCategory(categorizedProducts.value[0].category)
    focusCategoryAtIndex(0)
    return
  }

  if (key === 'End') {
    event.preventDefault()
    const lastIndex = categorizedProducts.value.length - 1
    selectCategory(categorizedProducts.value[lastIndex].category)
    focusCategoryAtIndex(lastIndex)
  }
}

const getPrimaryVariant = (product: ProductEdge) =>
  product.node.variants?.edges?.[0]?.node ?? null

const isVariantAvailable = (product: ProductEdge) => {
  const variant = getPrimaryVariant(product)
  return Boolean(variant?.availableForSale)
}

const selectedVariant = computed(() =>
  selectedProduct.value ? getPrimaryVariant(selectedProduct.value) : null,
)

const selectedVariantAvailable = computed(() => Boolean(selectedVariant.value?.availableForSale))

const selectedVariantQuantity = computed(() => {
  const variantId = selectedVariant.value?.id
  if (!variantId) {
    return 0
  }

  const entry = cartItems.value.find((item) => item.variantId === variantId)
  return entry?.quantity ?? 0
})

const handleQuickAdd = (product: ProductEdge) => {
  const variant = getPrimaryVariant(product)

  if (!variant || !variant.availableForSale) {
    return
  }

  const imageNode = product.node.images.edges[0]?.node

  addToCart(
    {
      variantId: variant.id,
      productId: product.node.id,
      title: product.node.title,
      variantTitle: variant.title ?? undefined,
      price: product.node.priceRange.minVariantPrice.amount,
      currencyCode: product.node.priceRange.minVariantPrice.currencyCode,
      image: imageNode?.url,
      handle: product.node.handle,
    },
    1,
  )

}

const handleModalAdd = () => {
  const product = selectedProduct.value
  const variant = selectedVariant.value

  if (!product || !variant || !variant.availableForSale) {
    return
  }

  const imageNode = product.node.images.edges[0]?.node

  addToCart(
    {
      variantId: variant.id,
      productId: product.node.id,
      title: product.node.title,
      variantTitle: variant.title ?? undefined,
      price: product.node.priceRange.minVariantPrice.amount,
      currencyCode: product.node.priceRange.minVariantPrice.currencyCode,
      image: imageNode?.url,
      handle: product.node.handle,
    },
    1,
  )
}

const incrementSelectedQuantity = () => {
  const variant = selectedVariant.value
  if (!variant || !variant.availableForSale) {
    return
  }

  const nextQuantity = selectedVariantQuantity.value + 1
  updateQuantity(variant.id, nextQuantity)
}

const decrementSelectedQuantity = () => {
  const variant = selectedVariant.value
  if (!variant) {
    return
  }

  const nextQuantity = selectedVariantQuantity.value - 1
  if (nextQuantity <= 0) {
    removeFromCart(variant.id)
  } else {
    updateQuantity(variant.id, nextQuantity)
  }
}

type ModalSyncOptions = {
  skipRouteSync?: boolean
}

const syncRouteProductQuery = (product: ProductEdge | null) => {
  if (process.server) {
    return
  }

  const currentHandle = routeProductHandle.value
  const nextHandle = product?.node.handle ?? null

  if (currentHandle === nextHandle) {
    return
  }

  const currentQuery = { ...route.query } as Record<string, any>

  if (nextHandle) {
    currentQuery.product = nextHandle
  } else {
    delete currentQuery.product
  }

  void router.replace({
    path: route.path,
    query: currentQuery,
    hash: route.hash,
  })
}

const openProductModal = (product: ProductEdge, options: ModalSyncOptions = {}) => {
  const category = resolveCategoryForProduct(product)
  if (category && activeCategory.value !== category) {
    activeCategory.value = category
  }

  selectedProduct.value = product

  if (!options.skipRouteSync) {
    syncRouteProductQuery(product)
  }

  nextTick(() => {
    productModalRef.value?.scrollTo({ top: 0, behavior: 'auto' })
    modalCloseButtonRef.value?.focus({ preventScroll: true })
  })
}

const closeProductModal = (options: ModalSyncOptions = {}) => {
  if (!options.skipRouteSync) {
    syncRouteProductQuery(null)
  }

  selectedProduct.value = null
  modalCloseButtonRef.value = null
}

const findProductByHandle = (handle: string | null | undefined) => {
  if (!handle) {
    return null
  }

  return products.value.find((edge) => edge.node.handle === handle) ?? null
}

const openProductForHandle = (handle: string, options: ModalSyncOptions = {}) => {
  const match = findProductByHandle(handle)
  if (!match) {
    return false
  }

  openProductModal(match, options)
  return true
}

watch(
  routeProductHandle,
  (handle) => {
    if (!handle) {
      if (selectedProduct.value) {
        closeProductModal({ skipRouteSync: true })
      }
      pendingRouteHandle.value = null
      return
    }

    if (selectedProduct.value?.node.handle === handle) {
      pendingRouteHandle.value = null
      return
    }

    if (!openProductForHandle(handle, { skipRouteSync: true })) {
      pendingRouteHandle.value = handle
    } else {
      pendingRouteHandle.value = null
    }
  },
  { immediate: true },
)

watch(
  () => products.value.length,
  () => {
    if (!pendingRouteHandle.value) {
      return
    }

    if (openProductForHandle(pendingRouteHandle.value, { skipRouteSync: true })) {
      pendingRouteHandle.value = null
    }
  },
)

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
  display: flex;
  flex-direction: column;
  gap: $spacing-xl * 1.5;
}

.view-toggle {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
}

.view-toggle-btn {
  padding: $spacing-sm $spacing-md;
  border: 2px solid rgba($accent-sage, 0.3);
  border-radius: 24px;
  background: transparent;
  color: rgba($accent-sage, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba($accent-sage, 0.6);
    color: rgba($accent-sage, 0.9);
  }

  &.active {
    background: $accent-sage;
    border-color: $accent-sage;
    color: $white;
  }
}

.status-message {
  display: grid;
  gap: $spacing-xs;
  text-align: center;
  padding: $spacing-xl;
  border-radius: 22px;
  background: rgba($white, 0.96);
  border: 1px solid rgba($accent-sage, 0.14);
  box-shadow: 0 18px 44px rgba($accent-sage, 0.12);
  color: $accent-sage;
  font-size: 1.05rem;

  &.loading {
    .status-label {
      color: darken($accent-sage, 5%);
    }

    .status-helper {
      color: rgba($accent-sage, 0.65);
    }
  }

  &.error {
    background: rgba($danger-color, 0.08);
    border-color: rgba($danger-color, 0.25);
    color: darken($danger-color, 5%);

    .status-helper {
      color: rgba($danger-color, 0.8);
    }
  }

  &.empty {
    color: $accent-sage;
  }
}

.status-label {
  font-weight: 600;
  letter-spacing: 0.01em;
}

.status-helper {
  font-size: 0.95rem;
  color: rgb($accent-sage, 0.7);
}

.product-experience {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.view-fade-enter-active,
.view-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.view-fade-enter-from,
.view-fade-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

.all-products-section,
.category-section {
  background: rgba($white, 0.97);
  border: 1px solid rgba($accent-sage, 0.12);
  border-radius: 32px;
  padding: $spacing-xl * .5;
  box-shadow: 0 30px 70px rgba($accent-sage, 0.12);
}

.section-head {
  flex: 1;
  text-align: center;
  display: grid;
  gap: $spacing-xs;
  justify-items: center;

  h3 {
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    color: $accent-sage;
    font-weight: 600;
    margin: 0;
  }
}

.section-header-row {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  position: relative;
}

.search-container {
  position: absolute;
  left: 2rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 12rem;
}

.search-icon {
  position: absolute;
  left: $spacing-sm;
  width: 1.2rem;
  height: 1.2rem;
  color: rgba($accent-sage, 0.6);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: $spacing-sm $spacing-sm $spacing-sm 2.5rem;
  border: 1px solid rgba($accent-sage, 0.2);
  border-radius: 8px;
  background: rgba($white, 0.95);
  color: $accent-sage;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba($accent-sage, 0.4);
    box-shadow: 0 0 0 3px rgba($accent-sage, 0.1);
  }

  &::placeholder {
    color: rgba($accent-sage, 0.5);
  }
}

.section-kicker {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  background: rgba($accent-sage, 0.12);
  color: rgba($accent-sage, 0.85);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.75rem;
  font-weight: 600;
}

.section-description {
  color: rgba($accent-sage, 0.7);
  font-size: 1rem;
  max-width: 48ch;
  margin: 0;
}

.category-display {
  display: grid;
  grid-template-columns: minmax(220px, 300px) minmax(0, 1fr);
  gap: $spacing-xl;
  align-items: start;
}

.category-nav {
  position: sticky;
  top: $spacing-xl;
  align-self: start;
  max-height: calc(100vh - $spacing-xxl);
  overflow-y: auto;
  padding-right: $spacing-sm;
}

.category-tabs {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  padding-right: $spacing-sm;
  justify-content: center;
}

.category-tab {
  appearance: none;
  border: none;
  background: rgba($accent-sage, 0.04);
  color: rgba($accent-sage, 0.72);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: $spacing-sm $spacing-md;
  border-radius: 12px;
  position: relative;
  text-align: left;
  transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    top: $spacing-xs * 0.5;
    bottom: $spacing-xs * 0.5;
    left: 0;
    width: 3px;
    border-radius: 999px;
    background: transparent;
    transition: background 0.2s ease;
  }

  &:hover {
    color: $accent-sage;
    background: rgba($accent-sage, 0.1);
  }

  &:focus-visible {
    outline: 2px solid rgba($accent-gold, 0.4);
    outline-offset: 3px;
  }

  &.is-active {
    color: $accent-sage;
    background: rgba($accent-sage, 0.14);
    box-shadow: inset 0 0 0 1px rgba($accent-sage, 0.22);

  }

}

.tab-label {
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
}

.tab-tagline {
  font-size: 0.8rem;
  color: rgba($accent-sage, 0.6);
}

.tab-header {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.tab-icon {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
  color: rgba($accent-sage, 0.7);
}

.category-tab.is-active .tab-icon {
  color: $accent-sage;
}

.category-tab:hover .tab-icon {
  color: $accent-sage;
}

.category-products {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.category-summary {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  align-items: flex-end;
  justify-content: space-between;
}

.category-overview {
  max-width: 640px;
}

.category-kicker {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.8rem;
  color: rgba($accent-sage, 0.55);
  margin: 0 0 $spacing-xs;
}

.category-title {
  font-size: clamp(1.8rem, 3vw, 2.3rem);
  color: $accent-sage;
  margin: 0 0 $spacing-xs;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.category-title-icon {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  color: $accent-sage;
}

.category-description {
  font-size: 1rem;
  color: rgba($accent-sage, 0.7);
  margin: 0;
  line-height: 1.6;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: $spacing-lg;
}

.all-products-grid {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.product-card {
  display: flex;
  flex-direction: column;
  background: rgba($white, 0.98);
  border: 1px solid rgba($accent-sage, 0.15);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  min-height: 320px;

  &:hover {
    border-color: rgba($accent-sage, 0.3);
    box-shadow: 0 8px 24px rgba($accent-sage, 0.1);
  }
}

.product-trigger {
  display: flex;
  width: 100%;
  text-decoration: none;
  color: inherit;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  flex-flow: column;
  flex: 1;

  &:focus-visible {
    outline: 2px solid rgba($accent-gold, 0.4);
    outline-offset: 2px;
  }
}

.product-image {
  aspect-ratio: 0.75;
  background: $white;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
}

.product-card:hover .product-image img {
  transform: scale(1.03);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: rgba($accent-sage, 0.3);
  background: $white;
}

.product-info {
  padding: $spacing-md;
  background: $white;
}

.product-category {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba($black, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: $spacing-xs;
}

.product-title {
  color: $black;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 $spacing-xs 0;
  line-height: 1.3;
}

.product-add-btn {
  margin: 0 $spacing-sm $spacing-sm;
  padding: $spacing-sm $spacing-md;
  background: $accent-sage;
  color: $white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-height: 48px;

  &:hover:not(:disabled) {
    background: darken($accent-sage, 8%);
  }

  &:focus-visible {
    outline: 2px solid rgba($accent-gold, 0.5);
    outline-offset: 2px;
  }

  &:disabled {
    background: rgba($accent-sage, 0.3);
    cursor: not-allowed;
  }
}

.btn-text {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
}

.btn-price {
  font-size: 1rem;
  font-weight: 500;
}

.category-empty {
  border-radius: 16px;
  border: 1px dashed rgba($accent-sage, 0.2);
  padding: $spacing-xl;
  text-align: center;
  color: rgba($accent-sage, 0.7);
  font-size: 1rem;
}

.category-fade-enter-active,
.category-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.category-fade-enter-from,
.category-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.product-modal-enter-active,
.product-modal-leave-active {
  transition: opacity 0.2s ease;
}

.product-modal-enter-from,
.product-modal-leave-to {
  opacity: 0;
}

.product-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba($accent-sage, 0.35);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
  z-index: 1200;
}

.product-modal {
  position: relative;
  width: min(960px, 100%);
  max-height: 88vh;
  background: $white;
  border-radius: 28px;
  border: 1px solid rgba($accent-sage, 0.16);
  box-shadow: 0 40px 90px rgba($accent-sage, 0.22);
  overflow: hidden;
}

.product-modal__close {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba($accent-sage, 0.12);
  color: $accent-sage;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus-visible {
    background: rgba($accent-sage, 0.2);
    transform: translateY(-1px);
    outline: none;
  }
}

.product-modal__scroller {
  overflow-y: auto;
  max-height: inherit;
  padding: $spacing-xl * 1.2 $spacing-xl * 1.4;
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.product-modal__content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: $spacing-xl;
}

.product-modal__media {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba($accent-sage, 0.18), rgba($accent-sage, 0.12));
  min-height: 380px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-modal__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(3rem, 6vw, 4rem);
  color: rgba($accent-sage, 0.38);
  height: 100%;
}

.product-modal__details {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  color: $accent-sage;
}

.product-modal__kicker {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.75rem;
  color: rgba($accent-sage, 0.6);
  margin: 0;
}

.product-modal__title {
  font-size: clamp(2rem, 3.5vw, 2.6rem);
  margin: 0;
  font-weight: 600;
}

.product-modal__type {
  margin: 0;
  font-size: 0.9rem;
  color: rgba($accent-sage, 0.65);
}

.product-modal__price {
  font-size: 1.5rem;
  font-weight: 600;
  color: $accent-gold;
}

.product-modal__description {
  display: grid;
  gap: $spacing-sm;
  font-size: 0.95rem;
  line-height: 1.2;
  color: rgba($accent-sage, 0.78);

  p {
    margin: 0;
  }
}

.product-modal__tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    background: rgba($accent-sage, 0.1);
    border: 1px solid rgba($accent-sage, 0.18);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
}

.product-modal__actions {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  margin-top: $spacing-sm;
}

.modal-add-btn {
  appearance: none;
  border: none;
  background: linear-gradient(135deg, $accent-sage, darken($accent-sage, 8%));
  color: $white;
  padding: $spacing-sm $spacing-lg;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba($accent-sage, 0.28);
    outline: none;
  }
}

.modal-quantity {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  border-radius: 999px;
  background: rgba($accent-sage, 0.08);
  border: 1px solid rgba($accent-sage, 0.18);
  padding: $spacing-xs $spacing-sm;
  align-self: flex-start;
}

.quantity-btn {
  appearance: none;
  border: none;
  background: transparent;
  color: $accent-sage;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover,
  &:focus-visible {
    background: rgba($accent-sage, 0.12);
    outline: none;
  }
}

.quantity-value {
  min-width: 2ch;
  text-align: center;
  font-weight: 600;
  color: $accent-sage;
}

.product-modal__soldout {
  font-size: 0.95rem;
  color: rgba($accent-sage, 0.65);
}

.product-modal__recommendations {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.recommendations-head {
  display: grid;
  gap: $spacing-xs;

  h4 {
    margin: 0;
    font-size: 1.2rem;
    color: $accent-sage;
  }
}

.recommendations-sub {
  margin: 0;
  font-size: 0.9rem;
  color: rgba($accent-sage, 0.65);
}

.recommendations-track {
  display: flex;
  gap: $spacing-md;
  overflow-x: auto;
  padding-bottom: $spacing-sm;
  margin: 0 -$spacing-sm;
  padding-left: $spacing-sm;
  scroll-snap-type: x mandatory;
}

.recommendation-card {
  flex: 0 0 220px;
  scroll-snap-align: start;
}

.recommendation-card__trigger {
  appearance: none;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  width: 100%;
  border: none;
  text-align: left;
  background: rgba($white, 0.96);
  border-radius: 18px;
  border: 1px solid rgba($accent-sage, 0.14);
  box-shadow: 0 18px 40px rgba($accent-sage, 0.12);
  padding: $spacing-sm;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-4px);
    border-color: rgba($accent-sage, 0.28);
    box-shadow: 0 28px 60px rgba($accent-sage, 0.16);
    outline: none;
  }
}

.recommendation-card__media {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: rgba($accent-sage, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.recommendation-card__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  color: rgba($accent-sage, 0.4);
  height: 100%;
}

.recommendation-card__body {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.recommendation-card__category {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba($accent-sage, 0.6);
}

.recommendation-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: $accent-sage;
}

.recommendation-card__price {
  font-size: 0.95rem;
  color: $accent-gold;
  font-weight: 600;
}

.debug-panel {
  padding: $spacing-lg;
  border-radius: 18px;
  background: rgba($white, 0.95);
  border: 1px solid rgba($accent-sage, 0.14);
  color: $accent-sage;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  box-shadow: 0 16px 42px rgba($accent-sage, 0.1);
}

.debug-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.debug-toggle {
  appearance: none;
  border: 1px solid rgba($accent-sage, 0.2);
  background: rgba($accent-sage, 0.12);
  color: $accent-sage;
  padding: $spacing-xs $spacing-sm;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba($accent-sage, 0.3);
    background: rgba($accent-sage, 0.18);
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
  background: rgba($accent-sage, 0.08);
  border: 1px solid rgba($accent-sage, 0.12);
}

.debug-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: $spacing-xs;
  color: rgba($accent-sage, 0.7);
}

.debug-body {
  font-size: 0.8rem;
  background: rgba($accent-sage, 0.08);
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
  color: rgba($accent-sage, 0.7);
}

@media (max-width: $breakpoint-lg) {
  .category-display {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
  }

  .category-nav {
    position: static;
    max-height: none;
    padding-right: 0;
  }

  .category-tabs {
    flex-direction: row;
    flex-wrap: wrap;
    gap: $spacing-sm;
    border-right: none;
    border-bottom: 1px solid rgba($accent-sage, 0.18);
    padding-right: 0;
    padding-bottom: $spacing-sm;
  }

  .category-tab {
    flex: 1 1 220px;
    border-radius: 12px 12px 0 0;

    &::before {
      top: auto;
      bottom: -$spacing-xs;
      left: $spacing-md * 0.6;
      right: $spacing-md * 0.6;
      width: auto;
      height: 3px;
    }
  }

  .category-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-modal__content {
    grid-template-columns: 1fr;
  }

  .product-modal__scroller {
    padding: $spacing-xl;
  }

  .product-modal__media {
    min-height: 320px;
  }
}

@media (max-width: $breakpoint-md) {
  .product-experience {
    gap: $spacing-xl;
  }

  .section-header-row {
    flex-direction: column;
    align-items: stretch;
    gap: $spacing-md;
  }

  .search-container {
    position: static;
    order: -1; /* Move search above section-head */
  }

  .section-head {
    flex: none;
    text-align: center;
    justify-items: center;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: $spacing-lg;
  }

  .all-products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .product-image {
    height: 240px;
  }

  .product-modal__scroller {
    padding: $spacing-lg;
  }

  .recommendations-track {
    margin: 0;
    padding: 0;
    gap: $spacing-sm;
  }

}

@media (max-width: $breakpoint-sm) {
  .category-tabs {
    gap: $spacing-xs;
    overflow-x: auto;
  }

  .category-tab {
    flex: 0 0 auto;
    min-width: 200px;
    border-radius: 12px;
  }

  .all-products-section,
  .category-section {
    padding: $spacing-lg;
  }

  .all-products-grid {
    grid-template-columns: 1fr;
  }

  .product-modal__scroller {
    padding: $spacing-md;
  }

  .recommendation-card {
    flex: 0 0 180px;
  }
}
</style>
