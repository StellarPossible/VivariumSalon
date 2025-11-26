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
        <button class="toast__close" type="button" @click="remove(toast.id)">
          &times;
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.toast-container {
  position: fixed;
  top: 80px;
  right: $spacing-lg;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba($black, 0.15);
  background: $white;
  border-left: 4px solid;

  &--success {
    border-color: #28a745;
    background: rgba(40, 167, 69, 0.1);
  }

  &--error {
    border-color: $danger-color;
    background: rgba($danger-color, 0.1);
  }

  &--info {
    border-color: $accent-sage;
    background: rgba($accent-sage, 0.1);
  }
}

.toast__message {
  color: $accent-sage;
  font-weight: 600;
  font-size: 0.95rem;
}

.toast__close {
  background: transparent;
  border: none;
  color: rgba($accent-sage, 0.6);
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
    color: $accent-sage;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: $breakpoint-sm) {
  .toast-container {
    right: $spacing-md;
    left: $spacing-md;
    max-width: none;
  }
}
</style>
