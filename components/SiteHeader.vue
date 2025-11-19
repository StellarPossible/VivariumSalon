<template>
  <header class="site-header" :class="{ scrolled }">
    <div class="container">
      <div class="logo">
        <NuxtLink to="/">
          <img src="/images/vivariumlogo.png" alt="Vivarium Salon" />
        </NuxtLink>
      </div>
      <nav class="main-nav">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
        <NuxtLink to="/products">Products</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  scrolled: boolean
}>()
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba($primary-color, 0.05);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &.scrolled {
    background-color: rgba($primary-color, 0.95);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: $spacing-md $spacing-lg;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo a {
    display: flex;
    align-items: center;
    text-decoration: none;
    
    img {
      height: 50px;
      width: auto;
      transition: transform 0.2s ease;
      filter: brightness(0) invert(1);
    }
    
    &:hover img {
      transform: scale(1.05);
    }
  }

  .main-nav {
    display: flex;
    gap: $spacing-lg;

    a {
      color: $white;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;

      &:hover {
        color: $accent-gold;
      }
    }
  }
}
</style>
