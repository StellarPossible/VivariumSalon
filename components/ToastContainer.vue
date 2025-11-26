<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
      >
        <span class="toast__message">{{ toast.message }}</span>
        <div class="toast__actions">
          <button
            v-if="toast.action"
            class="toast__action"
            type="button"
            @click="handleAction(toast)"
          >
            {{ toast.action.label }}
          </button>
          <button class="toast__close" type="button" @click="remove(toast.id)">
          &times;
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { Toast } from '@/composables/useToast'
import { useToast } from '@/composables/useToast'
import { useCart } from '@/composables/useCart'

const { toasts, remove } = useToast()
const { openCart } = useCart()

const handleAction = (toast: Toast) => {
  if (!toast.action) {
    return
  }

  if (toast.action.type === 'open-cart') {
    openCart()
  }

  remove(toast.id)
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.toast-container {
  position: fixed;
  right: clamp($spacing-md, 5vw, $spacing-xl);
  bottom: clamp($spacing-lg, 6vw, $spacing-xxl);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  max-width: 360px;
  pointer-events: none;
  align-items: flex-end;
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  padding: $spacing-sm $spacing-md;
  border-radius: 14px;
  box-shadow:
    0 18px 45px rgba($black, 0.45),
    0 6px 18px rgba($black, 0.4);
  background: rgba($black, 0.92);
  border: 1px solid rgba($white, 0.08);
  border-left: 3px solid transparent;
  pointer-events: auto;
  backdrop-filter: blur(16px);

  &--success {
    border-left-color: $accent-gold;
  }

  &--error {
    border-left-color: $danger-color;
  }

  &--info {
    border-left-color: rgba($accent-sage, 0.8);
  }
}

.toast__message {
  color: rgba($white, 0.9);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.toast__actions {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
}

.toast__action {
  background: rgba($white, 0.06);
  border: 1px solid rgba($accent-gold, 0.6);
  border-radius: 999px;
  color: rgba($white, 0.92);
  cursor: pointer;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba($accent-gold, 0.18);
    color: $white;
  }

  &:focus-visible {
    outline: 2px solid rgba($accent-gold, 0.8);
    outline-offset: 2px;
  }
}

.toast__close {
  background: transparent;
  border: none;
  color: rgba($white, 0.55);
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: rgba($white, 0.85);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.96);
}

@media (max-width: $breakpoint-sm) {
  .toast-container {
    right: $spacing-md;
    left: $spacing-md;
    bottom: clamp($spacing-md, 12vw, $spacing-xl);
    max-width: none;
    align-items: stretch;
  }
}
</style>
