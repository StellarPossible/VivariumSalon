<template>
  <button
    v-show="isVisible"
    class="back-to-top"
    type="button"
    title="Back to Top"
    aria-label="Back to Top"
    @click="scrollToTop"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="11" stroke-width="1.5" opacity="0.35" />
      <path d="M12 16V8" stroke-width="1.5" stroke-linecap="round" />
      <path d="M8 11l4-4 4 4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isVisible = ref(false)

const handleScroll = () => {
  isVisible.value = window.scrollY > 200
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.back-to-top {
  position: fixed;
  bottom: $spacing-xl;
  left: $spacing-xl;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, rgba($primary-color, 0.9), rgba($accent-color, 0.85));
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 30px rgba($black, 0.35);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
  z-index: 1400;

  svg {
    width: 28px;
    height: 28px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 34px rgba($black, 0.45);
  }

  &:active {
    transform: translateY(-1px);
  }
}

@media (max-width: $breakpoint-md) {
  .back-to-top {
    bottom: $spacing-lg;
    left: $spacing-lg;
    width: 48px;
    height: 48px;

    svg {
      width: 24px;
      height: 24px;
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .back-to-top {
    bottom: $spacing-md;
    left: $spacing-md;
    width: 44px;
    height: 44px;
  }
}
</style>
