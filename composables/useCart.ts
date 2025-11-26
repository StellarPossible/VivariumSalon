import { computed, readonly } from 'vue'
import type { CartItem, CartCreateResponse } from '~/types/cart'
import { useToast } from '@/composables/useToast'

const STORAGE_KEY = 'vivarium_cart'
type CartLineItemInput = {
  merchandiseId: string
  quantity: number
}

const normalizeCartItems = (rawItems: unknown): CartItem[] => {
  if (!Array.isArray(rawItems)) {
    return []
  }

  return rawItems
    .filter((entry): entry is Partial<CartItem> => typeof entry === 'object' && entry !== null)
    .map((entry) => ({
      variantId: String(entry.variantId ?? ''),
      productId: String(entry.productId ?? ''),
      title: String(entry.title ?? ''),
      variantTitle: entry.variantTitle ? String(entry.variantTitle) : undefined,
      price: String(entry.price ?? '0'),
      currencyCode: String(entry.currencyCode ?? 'USD'),
      quantity: Number.isFinite((entry as any).quantity)
        ? Math.max(0, Number((entry as any).quantity))
        : 0,
      image: entry.image ? String(entry.image) : undefined,
      handle: String(entry.handle ?? ''),
    }))
    .filter((item) => item.variantId && item.productId && item.quantity > 0)
}

export const useCart = () => {
  const cartItems = useState<CartItem[]>('vivarium-cart-items', () => [])
  const isCartOpen = useState<boolean>('vivarium-cart-open', () => false)
  const cartInitialized = useState<boolean>('vivarium-cart-initialized', () => false)
  const config = useRuntimeConfig()
  const { success: showSuccess, error: showError } = useToast()

  const cartItemsReadonly = readonly(cartItems)
  const isCartOpenReadonly = readonly(isCartOpen)

  const cartCount = computed(() =>
    cartItems.value.reduce((total, item) => total + item.quantity, 0),
  )

  const cartTotal = computed(() =>
    cartItems.value.reduce((total, item) => {
      const price = Number.parseFloat(item.price)
      if (Number.isNaN(price)) {
        return total
      }
      return total + price * item.quantity
    }, 0),
  )

  const initCart = () => {
    if (!process.client || cartInitialized.value) {
      return
    }

    cartInitialized.value = true

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return
      }

      const parsed = JSON.parse(stored)
      const normalized = normalizeCartItems(parsed)

      cartItems.value = normalized.length ? normalized : []
    } catch (error) {
      console.error('Failed to initialize cart from localStorage', error)
      cartItems.value = []
    }
  }

  const saveCart = () => {
    if (!process.client) {
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems.value))
    } catch (error) {
      console.error('Failed to persist cart to localStorage', error)
    }
  }

  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    initCart()

    if (quantity <= 0) {
      return
    }

    const existingIndex = cartItems.value.findIndex(
      (cartItem) => cartItem.variantId === item.variantId,
    )

    if (existingIndex > -1) {
      cartItems.value[existingIndex].quantity += quantity
      showSuccess(`Updated ${item.title} quantity`)
    } else {
      cartItems.value.push({ ...item, quantity })
      showSuccess(`Added ${item.title} to cart`)
    }

    saveCart()
    openCart()
  }

  const removeFromCart = (variantId: string) => {
    initCart()

    const target = cartItems.value.find((item) => item.variantId === variantId)
    if (!target) {
      return
    }

    cartItems.value = cartItems.value.filter((item) => item.variantId !== variantId)
    saveCart()
    showSuccess(`Removed ${target.title} from cart`)
  }

  const updateQuantity = (variantId: string, quantity: number) => {
    initCart()

    const target = cartItems.value.find((item) => item.variantId === variantId)
    if (!target) {
      return
    }

    if (quantity <= 0) {
      removeFromCart(variantId)
      return
    }

    target.quantity = quantity
    saveCart()
  }

  const clearCart = () => {
    cartItems.value = []
    saveCart()
  }

  // ============================================================================
  // SHOPIFY CART API INTEGRATION (Updated for modern API)
  // ============================================================================

  /**
   * Create Shopify cart using cartCreate mutation
   */
  const createCart = async () => {
    initCart()

    if (!cartItems.value.length) {
      throw new Error('Cart is empty')
    }

    const lineItems: CartLineItemInput[] = cartItems.value.map((item) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    }))

    const mutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                      }
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    try {
      const response = await $fetch<CartCreateResponse>(
        `https://${config.public.shopifyStoreDomain}/api/${config.public.shopifyApiVersion}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': config.public.shopifyStorefrontToken,
          },
          body: JSON.stringify({
            query: mutation,
            variables: {
              input: {
                lines: lineItems,
              },
            },
          }),
        },
      )

      console.log('Shopify cart create response:', response)
      return response
    } catch (error) {
      console.error('Failed to create cart:', error)
      showError('Failed to create checkout')
      throw error
    }
  }

  /**
   * Checkout handler - creates cart and redirects to Shopify checkout
   */
  const checkout = async () => {
    try {
      const result = await createCart()

      if (result.data?.cartCreate?.cart?.checkoutUrl) {
        const checkoutUrl = result.data.cartCreate.cart.checkoutUrl
        console.log('Redirecting to checkout:', checkoutUrl)

        if (process.client) {
          window.location.href = checkoutUrl
        }

        return checkoutUrl
      }

      const userErrors = result.data?.cartCreate?.userErrors
      if (userErrors && userErrors.length > 0) {
        const errorMsg = userErrors[0]?.message || 'Checkout error'
        console.error('Cart creation error:', errorMsg)
        showError(`Checkout error: ${errorMsg}`)
        throw new Error(errorMsg)
      }

      const graphQLErrors = result.errors
      if (graphQLErrors && graphQLErrors.length > 0) {
        const errorMsg = graphQLErrors[0]?.message || 'Checkout error'
        console.error('GraphQL error:', errorMsg)
        showError(`Checkout error: ${errorMsg}`)
        throw new Error(errorMsg)
      }

      throw new Error('Failed to create checkout. Please try again.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Checkout error'
      console.error('Checkout error:', error)
      showError(message)
      throw error
    }
  }

  if (process.client && !cartInitialized.value) {
    initCart()
  }

  return {
    cartItems: readonly(cartItems),
    cartCount,
    cartTotal,
    isCartOpen: readonly(isCartOpen),
    initCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    checkout,
  }
}
