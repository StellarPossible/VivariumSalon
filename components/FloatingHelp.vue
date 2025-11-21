<template>
  <NuxtLink to="/our-team#specialists" class="floating-book-now" title="Book an appointment">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <span>Book Now</span>
  </NuxtLink>
</template>

<script setup lang="ts">
// No additional logic required
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.floating-book-now {
  position: fixed;
  bottom: $spacing-xl;
  right: $spacing-xl;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  border-radius: 50px;
  background: linear-gradient(135deg, $accent-gold 0%, darken($accent-gold, 10%) 100%);
  color: $white;
  border: none;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba($accent-gold, 0.4);
  transition: all 0.3s ease;
  z-index: 1500;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba($accent-gold, 0.6);
  }

  &:active {
    transform: translateY(-2px);
  }
}

@media (max-width: $breakpoint-md) {
  .floating-book-now {
    bottom: $spacing-lg;
    right: $spacing-lg;
    padding: $spacing-md $spacing-lg;
    font-size: 1rem;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
