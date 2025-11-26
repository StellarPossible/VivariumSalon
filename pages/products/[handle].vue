<template>
  <div class="product-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading product...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <NuxtLink to="/products" class="back-link">← Back to Products</NuxtLink>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="product-container">
      <!-- Product Images Section -->
      <div class="product-images">
        <div class="main-image">
          <img
            v-if="currentImage"
            :src="currentImage.url"
            :alt="currentImage.altText || product.title"
          />
          <div v-else class="image-placeholder">
            {{ product.title.charAt(0) }}
          </div>
        </div>

        <!-- Thumbnail Gallery (if multiple images) -->
        <div v-if="product.images.edges.length > 1" class="image-thumbnails">
          <button
            v-for="(image, index) in product.images.edges"
            :key="image.node.url || index"
            class="thumbnail"
            :class="{ active: selectedImageIndex === index }"
            type="button"
            @click="selectedImageIndex = index"
          >
            <img
              :src="image.node.url"
              :alt="image.node.altText || `${product.title} view ${index + 1}`"
            />
          </button>
        </div>
      </div>

      <!-- Product Details Section -->
      <div class="product-details">
        <!-- Breadcrumb / Back Link -->
        <NuxtLink to="/products" class="breadcrumb">
          ← Back to Products
        </NuxtLink>

        <!-- Product Title -->
        <h1>{{ product.title }}</h1>

        <!-- Product Price -->
        <p class="price">
          {{
            formatPrice(
              selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount,
              selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode,
            )
          }}
        </p>

        <!-- Availability Badge -->
        <div class="availability-badge" :class="{ 'in-stock': isAvailable, 'out-of-stock': !isAvailable }">
          <span v-if="isAvailable">✓ In Stock</span>
          <span v-else>Out of Stock</span>
        </div>

        <!-- Product Description -->
        <div class="description" v-html="product.description"></div>

        <!-- Variant Selector (if multiple variants) -->
        <div v-if="product.variants.edges.length > 1" class="variant-selector">
          <label for="variant">Select Option:</label>
          <select id="variant" v-model="selectedVariant">
            <option
              v-for="variantEdge in product.variants.edges"
              :key="variantEdge.node.id"
              :value="variantEdge.node"
              :disabled="!variantEdge.node.availableForSale"
            >
              {{
                `${variantEdge.node.title} - ${formatPrice(
                  variantEdge.node.price.amount,
                  variantEdge.node.price.currencyCode,
                )}${!variantEdge.node.availableForSale ? ' (Out of Stock)' : ''}`
              }}
            </option>
          </select>
        </div>

        <!-- Quantity Selector -->
        <div class="quantity-selector">
          <label for="quantity">Quantity:</label>
          <div class="quantity-controls">
            <button
              type="button"
              aria-label="Decrease quantity"
              :disabled="quantity <= 1"
              @click="decreaseQuantity"
            >
              −
            </button>
            <input
              id="quantity"
              v-model.number="quantity"
              type="number"
              min="1"
              max="99"
              aria-label="Product quantity"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              :disabled="quantity >= 99"
              @click="increaseQuantity"
            >
              +
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="button-group">
          <button
            type="button"
            class="add-to-cart-button"
            :disabled="!isAvailable || isAddingToCart"
            @click="handleAddToCart"
          >
            <span v-if="!isAddingToCart && isAvailable">Add to Cart</span>
            <span v-else-if="isAddingToCart">Adding...</span>
            <span v-else>Out of Stock</span>
          </button>

          <button
            type="button"
            class="buy-now-button"
            :disabled="!isAvailable"
            @click="buyNow"
          >
            Buy Now on Shopify
          </button>
        </div>

        <!-- Success Message -->
        <Transition name="fade">
          <p v-if="addedToCart" class="success-message">
            ✓ Added {{ quantity }} {{ quantity === 1 ? 'item' : 'items' }} to cart!
          </p>
        </Transition>

        <!-- Product Meta Information -->
        <div class="product-meta">
          <div v-if="product.productType" class="meta-item">
            <span class="meta-label">Type:</span>
            <span class="meta-value">{{ product.productType }}</span>
          </div>
          <div v-if="product.tags && product.tags.length" class="meta-item">
            <span class="meta-label">Tags:</span>
            <div class="tags">
              <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// IMPORTS
// ============================================================================
const route = useRoute()
const { fetchProduct } = useShopify()
const { addToCart, openCart } = useCart()

// ============================================================================
// TYPES
// ============================================================================
type ProductImageNode = {
  url: string
  altText: string | null
}

type ProductVariantNode = {
  id: string
  title: string
  availableForSale: boolean
  price: {
    amount: string
    currencyCode: string
  }
}

type ProductNode = {
  id: string
  title: string
  description: string
  handle: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{ node: ProductImageNode }>
  }
  variants: {
    edges: Array<{ node: ProductVariantNode }>
  }
  productType?: string | null
  tags?: string[]
}

// ============================================================================
// REACTIVE STATE
// ============================================================================
const product = ref<ProductNode | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedVariant = ref<ProductVariantNode | null>(null)
const selectedImageIndex = ref(0)
const quantity = ref(1)
const addedToCart = ref(false)
const isAddingToCart = ref(false)
let successMessageTimeout: ReturnType<typeof setTimeout> | null = null
let openCartTimeout: ReturnType<typeof setTimeout> | null = null

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================
const isAvailable = computed(() => Boolean(selectedVariant.value?.availableForSale))

const currentImage = computed<ProductImageNode | null>(() => {
  if (!product.value?.images?.edges?.length) {
    return null
  }

  const images = product.value.images.edges
  const index = Math.min(Math.max(selectedImageIndex.value, 0), images.length - 1)
  return images[index]?.node ?? null
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const clearTimers = () => {
  if (successMessageTimeout !== null) {
    clearTimeout(successMessageTimeout)
    successMessageTimeout = null
  }

  if (openCartTimeout !== null) {
    clearTimeout(openCartTimeout)
    openCartTimeout = null
  }
}

/**
 * Format price with currency symbol
 */
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

/**
 * Increase quantity (max 99)
 */
const increaseQuantity = () => {
  if (quantity.value < 99) {
    quantity.value += 1
  }
}

/**
 * Decrease quantity (min 1)
 */
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value -= 1
  }
}

/**
 * Handle adding product to cart
 */
const handleAddToCart = () => {
  if (!product.value || !selectedVariant.value || !isAvailable.value) {
    return
  }

  isAddingToCart.value = true

  try {
    const cartItem = {
      variantId: selectedVariant.value.id,
      productId: product.value.id,
      title: product.value.title,
      variantTitle:
        selectedVariant.value.title !== 'Default Title' ? selectedVariant.value.title : undefined,
      price: selectedVariant.value.price.amount,
      currencyCode: selectedVariant.value.price.currencyCode,
      image: currentImage.value?.url || product.value.images.edges[0]?.node.url,
      handle: product.value.handle,
    }

    addToCart(cartItem, quantity.value)

    addedToCart.value = true

    if (process.client) {
      clearTimers()

      successMessageTimeout = window.setTimeout(() => {
        addedToCart.value = false
        successMessageTimeout = null
      }, 2000)

      openCartTimeout = window.setTimeout(() => {
        openCart()
        openCartTimeout = null
      }, 500)
    }
  } catch (err) {
    console.error('Error adding to cart:', err)
  } finally {
    isAddingToCart.value = false
  }
}

/**
 * Handle Buy Now - redirects to Shopify product page
 */
const buyNow = () => {
  if (!product.value || !process.client) {
    return
  }

  const shopUrl = `https://vivarium-8261.myshopify.com/products/${product.value.handle}`
  window.open(shopUrl, '_blank', 'noopener')
}

/**
 * Load product data by handle
 */
const loadProduct = async (handleParam: string | string[] | undefined) => {
  const normalizedHandle = Array.isArray(handleParam) ? handleParam[0] : handleParam

  if (!normalizedHandle) {
    error.value = 'Product handle is required'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  clearTimers()
  addedToCart.value = false
  quantity.value = 1
  selectedVariant.value = null
  selectedImageIndex.value = 0

  try {
    const data = (await fetchProduct(normalizedHandle)) as {
      data?: { productByHandle?: ProductNode | null }
      errors?: Array<{ message?: string }>
    }

    if (data?.errors?.length) {
      throw new Error(data.errors[0]?.message || 'Failed to load product')
    }

    const productNode = data?.data?.productByHandle
    if (!productNode) {
      throw new Error('Product not found')
    }

    product.value = productNode

    if (productNode.variants?.edges?.length) {
      const firstAvailable = productNode.variants.edges.find((edge) => edge.node.availableForSale)
      selectedVariant.value = (firstAvailable ?? productNode.variants.edges[0]).node
    } else {
      selectedVariant.value = null
    }
  } catch (err) {
    console.error('Error loading product:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load product'
    product.value = null
  } finally {
    loading.value = false
  }
}

// ============================================================================
// WATCHERS
// ============================================================================
watch(selectedVariant, () => {
  selectedImageIndex.value = 0
  addedToCart.value = false
  quantity.value = 1
})

watch(quantity, (value) => {
  if (!Number.isFinite(value)) {
    quantity.value = 1
    return
  }

  const clamped = Math.min(Math.max(Math.round(value), 1), 99)
  if (clamped !== value) {
    quantity.value = clamped
  }
})

watch(
  () => product.value?.images?.edges.length,
  (length) => {
    if (!length || length <= 0) {
      selectedImageIndex.value = 0
      return
    }

    if (selectedImageIndex.value > length - 1) {
      selectedImageIndex.value = 0
    }
  },
)

watch(
  () => route.params.handle,
  (newHandle, oldHandle) => {
    if (newHandle === oldHandle) {
      return
    }

    loadProduct(newHandle)
  },
)

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================
onMounted(() => {
  loadProduct(route.params.handle)
})

onBeforeUnmount(() => {
  clearTimers()
})

// ============================================================================
// SEO META TAGS (Optional)
// ============================================================================
useHead(() => {
  const plainDescription = product.value?.description
    ? product.value.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    : ''

  return {
    title: product.value ? `${product.value.title} - Vivarium Salon` : 'Product - Vivarium Salon',
    meta: [
      {
        name: 'description',
        content:
          plainDescription || 'Shop premium beauty and wellness products at Vivarium Salon',
      },
      {
        property: 'og:title',
        content: product.value?.title || 'Product',
      },
      {
        property: 'og:image',
        content: product.value?.images?.edges?.[0]?.node?.url || '',
      },
    ],
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.product-page {
  min-height: 100vh;
  padding: ($spacing-xl * 2) $spacing-lg $spacing-xl;
  background: linear-gradient(180deg, rgba($black, 0.85) 0%, rgba($black, 0.75) 100%);
  color: $accent-sage;
}

.loading-state,
.error-state {
  max-width: 960px;
  margin: 0 auto;
  padding: $spacing-xxl;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
  text-align: center;
}

.loading-state p {
  margin: 0;
  color: rgba($accent-sage, 0.8);
}

.loading-spinner {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 4px solid rgba($accent-sage, 0.15);
  border-top-color: $accent-sage;
  animation: spin 1s linear infinite;
}

.error-message {
  font-size: 1.1rem;
  color: lighten($accent-gold, 10%);
}

.back-link,
.breadcrumb {
  color: rgba($accent-sage, 0.75);
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: $spacing-xxs;

  &:hover,
  &:focus-visible {
    color: $accent-sage;
    text-decoration: underline;
  }
}

.product-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: $spacing-xxl;
  align-items: start;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.main-image {
  position: relative;
  padding: $spacing-lg;
  border-radius: 28px;
  background: rgba($accent-sage, 0.1);
  border: 1px solid rgba($accent-sage, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 420px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 18px;
    box-shadow: 0 24px 60px rgba($accent-sage, 0.18);
  }
}

.image-placeholder {
  font-size: 4rem;
  font-weight: 700;
  color: rgba($accent-sage, 0.4);
}

.image-thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(72px, 1fr));
  gap: $spacing-sm;
}

.thumbnail {
  border: 1px solid transparent;
  border-radius: 18px;
  overflow: hidden;
  background: rgba($accent-sage, 0.08);
  padding: 0;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover,
  &:focus-visible {
    border-color: rgba($accent-gold, 0.6);
    transform: translateY(-3px);
  }

  &.active {
    border-color: $accent-gold;
  }
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  h1 {
    color: $accent-sage;
    font-size: clamp(2.25rem, 4vw, 3rem);
    margin: 0;
    line-height: 1.1;
  }
}

.price {
  font-size: clamp(1.5rem, 2.8vw, 2rem);
  font-weight: 700;
  color: $accent-gold;
  margin: 0;
}

.availability-badge {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-sm;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  &.in-stock {
    background: rgba($accent-sage, 0.12);
    color: $accent-sage;
  }

  &.out-of-stock {
    background: rgba($accent-gold, 0.18);
    color: darken($accent-gold, 12%);
  }
}

.description {
  color: rgba($accent-sage, 0.75);
  line-height: 1.8;

  :deep(p) {
    margin-bottom: $spacing-sm;
  }

  :deep(a) {
    color: $accent-gold;

    &:hover {
      text-decoration: underline;
    }
  }
}

.variant-selector,
.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  label {
    color: $accent-sage;
    font-weight: 600;
    font-size: 1rem;
  }

  select {
    padding: $spacing-sm $spacing-md;
    border: 2px solid rgba($accent-sage, 0.3);
    border-radius: 8px;
    font-size: 1rem;
    color: $accent-sage;
    background: rgba($accent-sage, 0.05);
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus-visible {
      outline: none;
      border-color: $accent-gold;
      box-shadow: 0 0 0 3px rgba($accent-gold, 0.25);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  button {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 2px solid rgba($accent-sage, 0.3);
    background: rgba($accent-sage, 0.1);
    color: $accent-sage;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      background: rgba($accent-sage, 0.2);
      border-color: rgba($accent-sage, 0.5);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  input {
    width: 80px;
    padding: $spacing-sm;
    border: 2px solid rgba($accent-sage, 0.3);
    border-radius: 8px;
    text-align: center;
    font-size: 1.1rem;
    font-weight: 600;
    color: $accent-sage;
    appearance: textfield;
    -moz-appearance: textfield;
    background: rgba($white, 0.92);

    &:focus-visible {
      outline: none;
      border-color: $accent-gold;
      box-shadow: 0 0 0 3px rgba($accent-gold, 0.25);
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      appearance: none;
      margin: 0;
    }
  }
}

.button-group {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-md;
}

.add-to-cart-button,
.buy-now-button {
  flex: 1;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  padding: $spacing-md $spacing-xl;
  transition: all 0.3s ease;
  color: $white;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.add-to-cart-button {
  background: linear-gradient(135deg, $accent-sage, darken($accent-sage, 10%));
  box-shadow: 0 4px 15px rgba($accent-sage, 0.4);

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    box-shadow: 0 6px 20px rgba($accent-sage, 0.6);
    transform: translateY(-2px);
  }
}

.buy-now-button {
  background: linear-gradient(135deg, $accent-gold, darken($accent-gold, 10%));
  box-shadow: 0 4px 15px rgba($accent-gold, 0.4);

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    box-shadow: 0 6px 20px rgba($accent-gold, 0.6);
    transform: translateY(-2px);
  }
}

.success-message {
  color: #28a745;
  font-weight: 600;
  text-align: center;
  padding: $spacing-sm;
  background: rgba(40, 167, 69, 0.1);
  border-radius: 8px;
  margin: 0;
}

.product-meta {
  display: grid;
  gap: $spacing-sm;
}

.meta-item {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
  font-size: 0.95rem;
  color: rgba($accent-sage, 0.75);
}

.meta-label {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba($accent-sage, 0.6);
}

.meta-value {
  color: $accent-sage;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.tag {
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  background: rgba($accent-sage, 0.12);
  border: 1px solid rgba($accent-sage, 0.18);
  color: $accent-sage;
  font-size: 0.8rem;
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: $breakpoint-lg) {
  .product-container {
    gap: $spacing-xl;
  }
}

@media (max-width: $breakpoint-md) {
  .product-page {
    padding: ($spacing-xl * 1.5) $spacing-md $spacing-xl;
  }

  .product-container {
    grid-template-columns: 1fr;
    gap: $spacing-xl;
  }

  .button-group {
    flex-direction: column;
  }

  .add-to-cart-button,
  .buy-now-button {
    width: 100%;
  }
}

@media (max-width: $breakpoint-sm) {
  .main-image {
    padding: $spacing-md;
    min-height: 320px;
  }

  .image-thumbnails {
    grid-template-columns: repeat(auto-fit, minmax(56px, 1fr));
  }
}
</style>
