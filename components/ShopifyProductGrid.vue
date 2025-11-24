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
      <Transition name="view-fade" mode="out-in">
        <section
          v-if="isAllProductsView"
          key="all-products"
          class="all-products-section"
          aria-labelledby="all-products-heading"
        >
          <header class="section-head">
            <span class="section-kicker">Full catalog</span>
            <h3 id="all-products-heading">All Products</h3>
            <p class="section-description">Browse every Vivarium favorite in one streamlined view.</p>
          </header>
          <div class="product-grid all-products-grid" role="list">
            <article
              v-for="product in allProductsList"
              :key="product.node.id"
              class="product-card product-card--all"
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
                  <span class="product-category-pill">{{ resolveCategoryForProduct(product) }}</span>
                  <h4 class="product-title">{{ product.node.title }}</h4>
                  <p class="price">
                    {{
                      formatPrice(
                        product.node.priceRange.minVariantPrice.amount,
                        product.node.priceRange.minVariantPrice.currencyCode,
                      )
                    }}
                  </p>
                  <p class="description">
                    {{ truncate(product.node.description, descriptionLength) }}
                  </p>
                </div>
              </NuxtLink>
            </article>
          </div>
        </section>
        <div v-else key="category-view" class="category-view">
          <section
            ref="categorySectionRef"
            class="category-section"
            aria-labelledby="category-browser-heading"
          >
            <header class="section-head">
              <span class="section-kicker">Curated edits</span>
              <h3 id="category-browser-heading">Shop by Category</h3>
              <p class="section-description">Select a ritual to explore salon-trusted essentials.</p>
            </header>
            <div class="category-display">
              <nav class="category-selector" aria-label="Product categories">
                <button
                  v-for="group in categorizedProducts"
                  :key="group.category"
                  class="category-chip"
                  type="button"
                  :class="{
                    'is-active': group.category === activeCategoryName,
                    'is-empty': !group.products.length,
                  }"
                  :aria-pressed="group.category === activeCategoryName"
                  @click="selectCategory(group.category)"
                >
                  <span class="chip-label">{{ group.category }}</span>
                  <span class="chip-tagline">
                    {{ categoryDetailLookup[group.category]?.tagline }}
                  </span>
                  <span class="chip-count">{{ formatItemCount(group.products.length) }}</span>
                </button>
              </nav>
              <Transition name="category-fade" mode="out-in">
                <div
                  v-if="activeCategoryGroup"
                  :key="activeCategoryName || 'unselected'"
                  class="category-products"
                >
                  <header class="category-summary">
                    <div class="category-overview">
                      <p class="category-kicker">
                        {{ activeCategoryDetail?.tagline }}
                      </p>
                      <h4 class="category-title">{{ activeCategoryName }}</h4>
                      <p class="category-description">
                        {{ activeCategoryDetail?.description }}
                      </p>
                    </div>
                    <span class="category-total">
                      {{ formatItemCount(activeProducts.length) }}
                    </span>
                  </header>
                  <div v-if="activeProducts.length" class="product-grid" role="list">
                    <article
                      v-for="product in activeProducts"
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
                            {{
                              formatPrice(
                                product.node.priceRange.minVariantPrice.amount,
                                product.node.priceRange.minVariantPrice.currencyCode,
                              )
                            }}
                          </p>
                          <p class="description">
                            {{ truncate(product.node.description, descriptionLength) }}
                          </p>
                        </div>
                      </NuxtLink>
                    </article>
                  </div>
                  <div v-else class="category-empty">
                    <p>We&apos;re curating this collection. Check back soon for new arrivals.</p>
                  </div>
                </div>
              </Transition>
            </div>
          </section>

          <section
            v-if="collectionSpotlights.length"
            class="collection-section"
            aria-labelledby="collection-spotlights-heading"
          >
            <header class="section-head">
              <span class="section-kicker">Experience the ritual</span>
              <h3 id="collection-spotlights-heading">Collection Spotlights</h3>
              <p class="section-description">Press play for an immersive look at our signature routines.</p>
            </header>
            <div class="collection-grid">
              <article
                v-for="collection in collectionSpotlights"
                :key="collection.id"
                class="collection-card"
              >
                <div class="collection-media">
                  <iframe
                    v-if="collection.media.type === 'video'"
                    :src="collection.mediaSrc"
                    :title="collection.media.title || collection.title"
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                  <img
                    v-else
                    :src="collection.media.url"
                    :alt="collection.media.title || collection.title"
                  />
                </div>
                <div class="collection-body">
                  <span class="collection-pill">{{ collection.category }}</span>
                  <h4 class="collection-title">{{ collection.title }}</h4>
                  <p class="collection-description">{{ collection.description }}</p>
                  <div class="collection-meta">
                    <span class="collection-count">
                      {{ formatItemCount(collection.productCount) }}
                    </span>
                    <button
                      type="button"
                      class="collection-cta"
                      @click="selectCollection(collection)"
                    >
                      Shop {{ collection.category }}
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </Transition>
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
import type { PropType } from 'vue'
type ProductImageEdge = {
  node: {
    url: string
    altText: string | null
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
  viewMode: {
    type: String as PropType<'categories' | 'all'>,
    default: 'categories',
    validator: (value: string) => ['categories', 'all'].includes(value),
  },
})

const { fetchProducts } = useShopify()
const products = ref<ProductEdge[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const debugLogs = ref<DebugLogEntry[]>([])
const showDebug = ref(false)
const activeCategory = ref<string | null>(null)
const categorySectionRef = ref<HTMLElement | null>(null)

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

type CategoryMedia =
  | {
      type: 'video'
      url: string
      title?: string
    }
  | {
      type: 'image'
      url: string
      title?: string
    }

type CollectionSpotlight = {
  id: string
  title: string
  description: string
  category: string
  productHandles: string[]
  media: CategoryMedia
}

const debugEnabled = computed(() => props.debug || process.dev)
const formattedProducts = computed(() => JSON.stringify(products.value, null, 2))
const isAllProductsView = computed(() => props.viewMode === 'all')
const allProductsList = computed(() =>
  [...products.value].sort((a, b) =>
    a.node.title.localeCompare(b.node.title, 'en', { sensitivity: 'base' })
  ),
)

const categoryOrder = [
  'Essential Haircare',
  'Naturaltech',
  'OI',
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
}

const categoryDetailLookup: Record<string, CategoryDetail> = {
  'Essential Haircare': {
    title: 'Essential Haircare',
    tagline: 'Daily Ritual Care',
    description:
      'Hydration-forward haircare designed for balanced, weightless strength every day.',
  },
  Naturaltech: {
    title: 'Naturaltech',
    tagline: 'Scalp Science Systems',
    description:
      'Targeted scalp and hair treatments powered by trichology research and natural actives.',
  },
  OI: {
    title: 'OI',
    tagline: 'Iconic Shine Ritual',
    description:
      'Multi-tasking favorites that deliver instant gloss, softness, and signature fragrance.',
  },
  'Heart of Glass': {
    title: 'Heart of Glass',
    tagline: 'Blonde Brilliance',
    description:
      'Blue and purple botanicals neutralize brass while fortifying delicate blonde strands.',
  },
  'Pasta & Love': {
    title: 'Pasta & Love',
    tagline: 'Modern Grooming',
    description:
      'Italian-crafted grooming essentials for clean lines, subtle texture, and skin comfort.',
  },
  'Alchemic System': {
    title: 'Alchemic System',
    tagline: 'Color-Enhancing Pigments',
    description:
      'Customizable pigments refresh tone and extend color vibrancy between salon visits.',
  },
  Authentic: {
    title: 'Authentic',
    tagline: 'Multi-Use Clean Beauty',
    description:
      'Certified natural oils for hair, face, and body with minimalist ingredients.',
  },
  'Essential Haircare Shampoo Bars': {
    title: 'Essential Haircare Shampoo Bars',
    tagline: 'Sustainable Solids',
    description:
      'Low-waste shampoo bars that deliver the same luxurious results in solid form.',
  },
  'Hair Refresher': {
    title: 'Hair Refresher',
    tagline: 'Instant Reset',
    description:
      'Lightweight dry spray revives hair between washes with freshness and volume.',
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
    .map(([category, items]) => ({
      category,
      products: [...items].sort((a, b) =>
        a.node.title.localeCompare(b.node.title, 'en', { sensitivity: 'base' })
      ),
    }))
    .filter((group) => categoryDetailLookup[group.category])
    .sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.category)
      const bIndex = categoryOrder.indexOf(b.category)
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

const formatItemCount = (count: number) => (count === 1 ? '1 item' : `${count} items`)

const scrollToCategories = () => {
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
    scrollToCategories()
    return
  }

  activeCategory.value = category
  scrollToCategories()
}

const withVideoParams = (url: string, params: Record<string, string>) => {
  try {
    const parsed = new URL(url)
    Object.entries(params).forEach(([key, value]) => {
      parsed.searchParams.set(key, value)
    })
    return parsed.toString()
  } catch (error) {
    return url
  }
}

type CollectionSpotlightView = CollectionSpotlight & {
  productCount: number
  mediaSrc: string
}

const collectionBlueprints: CollectionSpotlight[] = [
  {
    id: 'alchemic-signature',
    title: 'Alchemic Signature Ritual',
    description: 'Tone-perfecting cleanse and care that keeps vivid shades luminous between visits.',
    category: 'Alchemic System',
    productHandles: [
      'alchemic-silver-shampoo',
      'alchemic-silver-conditioner',
      'alchemic-chocolate-shampoo',
      'alchemic-chocolate-conditioner',
    ],
    media: {
      type: 'video',
      url: 'https://player.vimeo.com/video/322131565',
      title: 'Alchemic System Film',
    },
  },
  {
    id: 'heart-of-glass-brilliance',
    title: 'Heart of Glass Brilliance',
    description: 'Blue botanical actives neutralize brass while reinforcing blonde strength and shine.',
    category: 'Heart of Glass',
    productHandles: [
      'heart-of-glass-silkening-shampoo',
      'heart-of-glass-rich-conditioner',
      'heart-of-glass-sheer-glaze',
      'davines-holiday-set-heart-of-glass',
    ],
    media: {
      type: 'video',
      url: 'https://player.vimeo.com/video/459764493',
      title: 'Heart of Glass Ritual',
    },
  },
  {
    id: 'pasta-love-edit',
    title: 'Pasta & Love Edit',
    description: 'Italian grooming staples for precise lines, subtle texture, and skin-soothing finish.',
    category: 'Pasta & Love',
    productHandles: [
      'pasta-love',
      'pasta-love-softening-shaving-cream',
      'pasta-love-pre-shaving-and-softening-oil',
    ],
    media: {
      type: 'video',
      url: 'https://player.vimeo.com/video/518197110',
      title: 'Pasta & Love Routine',
    },
  },
  {
    id: 'oi-radiance',
    title: 'OI Radiance Ritual',
    description: 'Iconic shine essentials that cushion every strand with silky softness and gloss.',
    category: 'OI',
    productHandles: [
      'oi-shampoo',
      'oi-conditioner',
      'oi-oil',
      'davines-holiday-set-oi',
    ],
    media: {
      type: 'video',
      url: 'https://player.vimeo.com/video/470706891',
      title: 'OI Ritual Film',
    },
  },
]

const collectionSpotlights = computed<CollectionSpotlightView[]>(() => {
  if (!products.value.length) {
    return []
  }

  return collectionBlueprints
    .map((blueprint) => {
      const handles = new Set(blueprint.productHandles)
      const matched = products.value.filter((edge) => handles.has(edge.node.handle))
      const mediaSrc =
        blueprint.media.type === 'video'
          ? withVideoParams(blueprint.media.url, {
              autoplay: '0',
              muted: '1',
              loop: '1',
              controls: '0',
              background: '1',
              playsinline: '1',
            })
          : blueprint.media.url

      return {
        ...blueprint,
        productHandles: matched.map((edge) => edge.node.handle),
        productCount: matched.length,
        mediaSrc,
      }
    })
    .filter((spotlight) => spotlight.productCount > 0)
})

const selectCollection = (collection: CollectionSpotlightView) => {
  selectCategory(collection.category)
  nextTick(() => {
    scrollToCategories()
  })
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
  color: rgba($accent-sage, 0.7);
}

.product-experience {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl * 1.5;
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
.category-section,
.collection-section {
  background: rgba($white, 0.97);
  border: 1px solid rgba($accent-sage, 0.12);
  border-radius: 32px;
  padding: $spacing-xl * 1.2 $spacing-xl * 1.25;
  box-shadow: 0 30px 70px rgba($accent-sage, 0.12);
}

.section-head {
  text-align: center;
  margin-bottom: $spacing-xl;
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
  gap: $spacing-xl;
  align-items: start;
}

.category-selector {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: $spacing-sm;
}

.category-chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  border-radius: 18px;
  border: 1px solid rgba($accent-sage, 0.18);
  background: rgba($accent-sage, 0.08);
  color: $accent-sage;
  cursor: pointer;
  text-align: left;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    border-color: rgba($accent-sage, 0.28);
    background: rgba($accent-sage, 0.12);
    outline: none;
  }

  &.is-active {
    border-color: rgba($accent-sage, 0.45);
    background: linear-gradient(135deg, rgba($accent-sage, 0.85), rgba($accent-sage, 0.75));
    color: lighten($white, 6%);

    .chip-tagline,
    .chip-count {
      color: lighten($white, 12%);
    }
  }

  &.is-empty {
    opacity: 0.45;
    cursor: default;
  }
}

.chip-label {
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.015em;
}

.chip-tagline {
  font-size: 0.85rem;
  color: rgba($accent-sage, 0.7);
  transition: color 0.2s ease;
}

.chip-count {
  margin-top: $spacing-xs;
  font-size: 0.75rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba($accent-sage, 0.2);
  color: rgba($accent-sage, 0.75);
  transition: color 0.2s ease, border-color 0.2s ease;
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
}

.category-description {
  font-size: 1rem;
  color: rgba($accent-sage, 0.7);
  margin: 0;
  line-height: 1.6;
}

.category-total {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-md;
  border-radius: 999px;
  border: 1px solid rgba($accent-sage, 0.18);
  background: rgba($accent-sage, 0.08);
  color: $accent-sage;
  font-size: 0.9rem;
  font-weight: 600;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: $spacing-xl;
}

.all-products-grid {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.product-card {
  background: rgba($white, 0.98);
  border: 1px solid rgba($accent-sage, 0.12);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 42px rgba($accent-sage, 0.1);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 60px rgba($accent-sage, 0.16);
    border-color: rgba($accent-sage, 0.26);
  }
}

.product-card--all .product-info {
  gap: $spacing-sm;
}

.product-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.product-image {
  background: linear-gradient(135deg, rgba($accent-sage, 0.18), rgba($accent-sage, 0.1));
  height: 280px;
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
  color: rgba($accent-sage, 0.35);
  background: linear-gradient(135deg, rgba($accent-sage, 0.12), rgba($accent-sage, 0.08));
}

.product-info {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.product-category-pill {
  align-self: flex-start;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  background: rgba($accent-sage, 0.12);
  border: 1px solid rgba($accent-sage, 0.18);
  color: rgba($accent-sage, 0.85);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: $spacing-xs;
}

.product-title {
  color: $accent-sage;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.price {
  color: $accent-gold;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.description {
  color: rgba($accent-sage, 0.7);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
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

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: $spacing-xl;
}

.collection-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-radius: 24px;
  border: 1px solid rgba($accent-sage, 0.12);
  background: rgba($white, 0.98);
  box-shadow: 0 20px 52px rgba($accent-sage, 0.12);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    border-color: rgba($accent-sage, 0.28);
    box-shadow: 0 28px 64px rgba($accent-sage, 0.16);
  }
}

.collection-media {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 18px;
  overflow: hidden;
  background: rgba($accent-sage, 0.08);

  iframe,
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    object-fit: cover;
  }
}

.collection-body {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.collection-pill {
  align-self: flex-start;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: rgba($accent-sage, 0.12);
  border: 1px solid rgba($accent-sage, 0.18);
  color: $accent-sage;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
}

.collection-title {
  font-size: 1.4rem;
  color: $accent-sage;
  margin: 0;
  font-weight: 600;
}

.collection-description {
  color: rgba($accent-sage, 0.7);
  margin: 0;
  line-height: 1.6;
  font-size: 1rem;
}

.collection-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  margin-top: $spacing-sm;
}

.collection-count {
  font-size: 0.9rem;
  color: rgba($accent-sage, 0.65);
}

.collection-cta {
  appearance: none;
  border: 1px solid rgba($accent-sage, 0.22);
  background: $accent-sage;
  color: lighten($white, 8%);
  padding: $spacing-xs $spacing-lg;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 16px 38px rgba($accent-sage, 0.25);
    background: darken($accent-sage, 4%);
    outline: none;
  }
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
  .category-selector {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  .category-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .category-total {
    align-self: flex-start;
  }
}

@media (max-width: $breakpoint-md) {
  .product-experience {
    gap: $spacing-xl;
  }

  .all-products-section,
  .category-section,
  .collection-section {
    padding: $spacing-xl $spacing-lg;
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

  .collection-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: $breakpoint-sm) {
  .category-selector {
    grid-template-columns: 1fr;
  }

  .all-products-section,
  .category-section,
  .collection-section {
    padding: $spacing-lg;
  }

  .all-products-grid {
    grid-template-columns: 1fr;
  }

  .collection-card {
    padding: $spacing-md;
  }
}
</style>
