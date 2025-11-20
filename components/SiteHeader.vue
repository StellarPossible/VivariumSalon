<template>
  <header class="site-header" :class="{ scrolled: props.scrolled }">
    <div class="container">
      <div class="logo">
        <NuxtLink to="/">
          <img src="/images/vivariumlogo.png" alt="Vivarium Salon" />
        </NuxtLink>
        <p class="header-values">
          <span>Quality</span>
          <span class="separator">•</span>
          <span>Integrity</span>
          <span class="separator">•</span>
          <span>Authenticity</span>
        </p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
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
  background-color: rgba($primary-color, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &.scrolled {
    background-color: rgba($primary-color, 0.9);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;

  img {
    height: 60px;
    width: auto;
    filter: brightness(0) invert(1);
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.85;
    }
  }
}

.header-values {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.18rem;
  text-transform: uppercase;
  color: rgba($white, 0.8);
  font-weight: 600;
}

.header-values .separator {
  opacity: 0.6;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem 1.25rem;
  }

  .logo img {
    height: 52px;
  }

  .header-values {
    font-size: 0.75rem;
    letter-spacing: 0.14rem;
  }
}
</style>
