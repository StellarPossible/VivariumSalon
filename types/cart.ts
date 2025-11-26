export interface CartItem {
  variantId: string
  productId: string
  title: string
  variantTitle?: string
  price: string
  currencyCode: string
  quantity: number
  image?: string
  handle: string
}

export interface CheckoutCreateResponse {
  data?: {
    checkoutCreate?: {
      checkout?: {
        id: string
        webUrl: string
      }
      checkoutUserErrors?: Array<{
        message: string
        field?: string[]
      }>
    }
  }
  errors?: Array<{
    message: string
  }>
}

export interface ShopifyVariant {
  id: string
  title: string
  availableForSale: boolean
  price: {
    amount: string
    currencyCode: string
  }
}

export interface CartCreateResponse {
  data?: {
    cartCreate?: {
      cart?: {
        id: string
        checkoutUrl?: string | null
      }
      userErrors?: Array<{
        field?: string[] | null
        message?: string
      }>
    }
  }
  errors?: Array<{
    message?: string
  }>
}
