<template>
  <Teleport to="body">
    <transition name="cart-overlay-fade">
      <div
        v-if="isCartOpenValue"
        class="cart-overlay"
        role="presentation"
        @click="handleOverlayClick"
      >
        <transition name="cart-modal-slide">
          <div
            v-show="isCartOpenValue"
            ref="modalRef"
            class="cart-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-modal-title"
            tabindex="-1"
            @click.stop
          >
            <header class="cart-modal__header">
              <button
                ref="closeButtonRef"
                type="button"
                class="close-btn"
                aria-label="Close cart"
                @click="closeCart"
              >
                <span aria-hidden="true">&times;</span>
              </button>

              <div class="cart-modal__title-group">
                <h2 id="cart-modal-title" class="cart-modal__title">Your Cart</h2>
                <span class="cart-modal__count" aria-live="polite">{{ itemCountLabel }}</span>
              </div>
            </header>

            <section v-if="hasItems" class="cart-modal__body" aria-live="polite">
              <ul class="cart-items" role="list">
                <li v-for="item in cartItems" :key="item.variantId" class="cart-item">
                  <div class="cart-item__media" aria-hidden="true">
                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.title"
                      class="cart-item__image"
                      loading="lazy"
                    />
                    <div v-else class="cart-item__placeholder">No image</div>
                  </div>

                  <div class="cart-item__details">
                    <h3 class="cart-item__title">{{ item.title }}</h3>
                    <p v-if="item.variantTitle" class="cart-item__variant">{{ item.variantTitle }}</p>
                    <p class="cart-item__price">{{ formatPrice(item.price, item.currencyCode) }}</p>

                    <div class="quantity-controls">
                      <button
                        type="button"
                        class="quantity-btn"
                        aria-label="Decrease quantity"
                        @click="decrementQuantity(item)"
                      >
                        &minus;
                      </button>
                      <input
                        :value="item.quantity"
                        class="quantity-input"
                        type="number"
                        inputmode="numeric"
                        min="1"
                        aria-label="Quantity"
                        @change="handleQuantityInput(item.variantId, $event)"
                      />
                      <button
                        type="button"
                        class="quantity-btn"
                        aria-label="Increase quantity"
                        @click="incrementQuantity(item)"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div class="cart-item__meta">
                    <p class="cart-item__total">
                      {{ formatPrice(lineItemTotal(item), item.currencyCode) }}
                    </p>
                    <button
                      type="button"
                      class="cart-item__remove"
                      @click="handleRemove(item.variantId)"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              </ul>
            </section>

            <section v-else class="cart-modal__empty" aria-live="polite">
              <h3 class="cart-modal__empty-title">Your cart is empty</h3>
              <p class="cart-modal__empty-copy">Add products to begin your Vivarium ritual.</p>
              <button type="button" class="continue-shopping" @click="closeCart">
                Continue Shopping
              </button>
            </section>

            <footer v-if="hasItems" class="cart-modal__footer">
              <div class="cart-subtotal">
                <span class="cart-subtotal__label">Subtotal</span>
                <span class="cart-subtotal__value">{{ formattedSubtotal }}</span>
              </div>
              <p class="cart-shipping-note">Shipping calculated at checkout</p>
              <p v-if="checkoutError" class="cart-error" role="alert">{{ checkoutError }}</p>
              <button
                type="button"
                class="checkout-btn"
                :disabled="isCheckingOut"
                @click="handleCheckout"
              >
                {{ isCheckingOut ? 'Processing…' : 'Checkout' }}
              </button>
              <button type="button" class="continue-shopping" @click="closeCart">
                Continue Shopping
              </button>
            </footer>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { CartItem } from '~/types/cart'
import { useCart } from '@/composables/useCart'

const {
  cartItems,
  isCartOpen,
  cartCount,
  cartTotal,
  updateQuantity,
  removeFromCart,
  checkout,
  closeCart,
} = useCart()

const isCheckingOut = ref(false)
const checkoutError = ref('')
const modalRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)
const previouslyFocused = ref<HTMLElement | null>(null)
const previousOverflow = ref<string | null>(null)

const isCartOpenValue = computed(() => isCartOpen.value)
const hasItems = computed(() => cartItems.value.length > 0)
const currencyCode = computed(() => cartItems.value[0]?.currencyCode ?? 'USD')
const itemCountLabel = computed(() => {
  const count = cartCount.value
  return `${count} item${count === 1 ? '' : 's'}`
})

const formatPrice = (amount: number | string, currency: string) => {
  const numeric = typeof amount === 'string' ? Number.parseFloat(amount) : amount
  if (!Number.isFinite(numeric)) {
    return amount.toString()
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
  }).format(numeric)
}

const formattedSubtotal = computed(() => formatPrice(cartTotal.value, currencyCode.value))

const lineItemTotal = (item: CartItem) => {
  const price = Number.parseFloat(item.price)
  return Number.isFinite(price) ? price * item.quantity : item.price
}

const setBodyScroll = (locked: boolean) => {
  if (!process.client) {
    return
  }

  const body = document.body
  if (!body) {
    return
  }

  if (locked) {
    previousOverflow.value = body.style.overflow
    body.style.overflow = 'hidden'
  } else if (previousOverflow.value !== null) {
    body.style.overflow = previousOverflow.value
    previousOverflow.value = null
  }
}

const handleQuantityInput = (variantId: string, event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (!target) {
    return
  }

  const parsed = Number.parseInt(target.value, 10)
  const normalized = Number.isNaN(parsed) ? 1 : Math.max(1, parsed)
  updateQuantity(variantId, normalized)
  target.value = String(normalized)
}

const incrementQuantity = (item: CartItem) => {
  updateQuantity(item.variantId, item.quantity + 1)
}

const decrementQuantity = (item: CartItem) => {
  updateQuantity(item.variantId, item.quantity - 1)
}

const handleRemove = (variantId: string) => {
  removeFromCart(variantId)
}

const handleCheckout = async () => {
  checkoutError.value = ''
  isCheckingOut.value = true

  try {
    await checkout()
  } catch (error) {
    console.error('Checkout failed', error)
    checkoutError.value = error instanceof Error ? error.message : 'Unable to complete checkout'
  } finally {
    isCheckingOut.value = false
  }
}

const handleOverlayClick = () => {
  closeCart()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeCart()
  }
}

if (process.client) {
  watch(
    () => isCartOpen.value,
    (open) => {
      if (open) {
        previouslyFocused.value = document.activeElement as HTMLElement | null
        setBodyScroll(true)
        window.addEventListener('keydown', onKeydown)
        requestAnimationFrame(() => closeButtonRef.value?.focus())
      } else {
        setBodyScroll(false)
        window.removeEventListener('keydown', onKeydown)
        requestAnimationFrame(() => previouslyFocused.value?.focus?.())
      }
    },
    { immediate: true },
  )
}

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('keydown', onKeydown)
    setBodyScroll(false)
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
  padding: $spacing-lg;
  background: rgba($black, 0.45);
  backdrop-filter: blur(12px);
}

.cart-modal {
  width: min(500px, 100%);
  max-width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $background-color;
  border-radius: 20px;
  border: 1px solid rgba($accent-sage, 0.2);
  box-shadow: 0 30px 80px rgba($black, 0.25);
  padding: $spacing-xl $spacing-lg;
  color: $accent-sage;
  overflow: hidden;
}

.cart-modal__header {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  margin-bottom: $spacing-lg;
}

.cart-modal__title-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xxs;
}

.cart-modal__title {
  font-size: clamp(1.5rem, 2vw, 1.75rem);
  margin: 0;
  color: $accent-sage;
}

.cart-modal__count {
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba($accent-sage, 0.7);
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba($accent-sage, 0.2);
  background: rgba($accent-sage, 0.08);
  color: $accent-sage;
  font-size: 1.5rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover,
  &:focus-visible {
    background: rgba($accent-sage, 0.16);
    transform: rotate(90deg);
  }
}

.cart-modal__body {
  flex: 1;
  overflow-y: auto;
  margin: 0 -$spacing-md;
  padding: 0 $spacing-md;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding: 0;
  margin: 0;
  list-style: none;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: $spacing-md;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid rgba($accent-sage, 0.15);
}

.cart-item__media {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba($accent-sage, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item__placeholder {
  font-size: 0.75rem;
  color: rgba($accent-sage, 0.6);
  text-align: center;
  padding: 0 $spacing-xs;
}

.cart-item__details {
  display: flex;
  flex-direction: column;
  gap: $spacing-xxs;
  color: $accent-sage;
}

.cart-item__title {
  font-size: 1rem;
  margin: 0;
  font-weight: 600;
}

.cart-item__variant {
  margin: 0;
  font-size: 0.85rem;
  color: rgba($accent-sage, 0.7);
}

.cart-item__price {
  margin: 0;
  font-size: 0.9rem;
  color: rgba($accent-sage, 0.9);
}

.quantity-controls {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xxs;
  margin-top: $spacing-xxs;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba($accent-sage, 0.25);
  background: rgba($accent-sage, 0.1);
  color: $accent-sage;
  font-size: 1.1rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus-visible {
    background: rgba($accent-sage, 0.18);
    transform: translateY(-1px);
  }
}

.quantity-input {
  width: 48px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba($accent-sage, 0.25);
  background: $white;
  color: $accent-sage;
  text-align: center;
  font-weight: 600;
  appearance: textfield;
  -moz-appearance: textfield;

  &:focus-visible {
    outline: 2px solid rgba($accent-gold, 0.6);
    outline-offset: 2px;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }
}

.cart-item__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: $spacing-xxs;
  text-align: right;
}

.cart-item__total {
  margin: 0;
  font-weight: 600;
  color: $accent-sage;
}

.cart-item__remove {
  appearance: none;
  border: none;
  background: none;
  color: rgba($accent-sage, 0.65);
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover,
  &:focus-visible {
    color: $accent-gold;
  }
}

.cart-modal__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: $spacing-sm;
  color: $accent-sage;
}

.cart-modal__empty-title {
  margin: 0;
  font-size: 1.25rem;
}

.cart-modal__empty-copy {
  margin: 0;
  max-width: 24ch;
  color: rgba($accent-sage, 0.7);
}

.cart-modal__footer {
  padding-top: $spacing-lg;
  margin-top: $spacing-lg;
  border-top: 1px solid rgba($accent-sage, 0.15);
  display: grid;
  gap: $spacing-md;
}

.cart-subtotal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
}

.cart-subtotal__label {
  color: rgba($accent-sage, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
}

.cart-subtotal__value {
  font-size: 1.15rem;
  color: $accent-sage;
}

.cart-shipping-note {
  margin: 0;
  font-size: 0.85rem;
  color: rgba($accent-sage, 0.6);
}

.cart-error {
  margin: 0;
  padding: $spacing-xxs $spacing-xs;
  border-radius: 8px;
  background: rgba($accent-gold, 0.12);
  color: darken($accent-gold, 12%);
  font-size: 0.9rem;
}

.checkout-btn {
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: $spacing-sm $spacing-lg;
  font-size: 1rem;
  font-weight: 600;
  color: lighten($white, 6%);
  background: linear-gradient(135deg, $accent-sage 0%, lighten($accent-sage, 6%) 100%);
  box-shadow: 0 18px 40px rgba($accent-sage, 0.22);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 24px 48px rgba($accent-sage, 0.28);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.continue-shopping {
  appearance: none;
  border: 1px solid rgba($accent-sage, 0.3);
  border-radius: 999px;
  padding: $spacing-sm $spacing-lg;
  background: transparent;
  color: $accent-sage;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover,
  &:focus-visible {
    background: rgba($accent-sage, 0.1);
    color: darken($accent-sage, 6%);
  }
}

.cart-overlay-fade-enter-active,
.cart-overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}

.cart-overlay-fade-enter-from,
.cart-overlay-fade-leave-to {
  opacity: 0;
}

.cart-modal-slide-enter-active,
.cart-modal-slide-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.cart-modal-slide-enter-from,
.cart-modal-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: $breakpoint-sm) {
  .cart-overlay {
    padding: 0;
  }

  .cart-modal {
    border-radius: 0;
    width: 100%;
    max-width: none;
    padding: $spacing-lg $spacing-md;
  }

  .cart-item {
    grid-template-columns: 64px 1fr;
    grid-template-areas:
      'media meta'
      'media details';
    align-items: start;
  }

  .cart-item__media {
    grid-area: media;
    width: 64px;
    height: 64px;
  }

  .cart-item__meta {
    grid-area: meta;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-sm;
  }

  .cart-item__details {
    grid-area: details;
    margin-top: $spacing-xs;
  }
}
</style>
