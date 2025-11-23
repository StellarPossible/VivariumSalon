<template>
  <div class="shop-page">
    <ShopSection />
  </div>
</template>

<script setup lang="ts">
// Components are auto-imported by Nuxt
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.shop-page {
  padding-top: 6rem;
  padding-bottom: $spacing-xl;
}
</style>
