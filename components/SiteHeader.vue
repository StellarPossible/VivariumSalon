<template>
  <header class="site-header" :class="{ scrolled }">
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
      
      <!-- Hamburger Menu Button -->
      <button class="hamburger" :class="{ open: mobileMenuOpen }" @click="toggleMobileMenu" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <!-- Navigation -->
      <nav class="main-nav" :class="{ open: mobileMenuOpen }">
        <NuxtLink to="/" @click="closeMobileMenu">Home</NuxtLink>
        <NuxtLink to="/about" @click="closeMobileMenu">About</NuxtLink>
        <NuxtLink to="/products" @click="closeMobileMenu">Products</NuxtLink>
        <NuxtLink to="/contact" @click="closeMobileMenu">Contact</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  scrolled: boolean
}>()

const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/variables.scss';

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba($primary-color, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &.scrolled {
    background-color: rgba($primary-color, 0.95);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .logo {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
    z-index: 1001;
    
    img {
      height: 50px;
      width: auto;
      filter: brightness(0) invert(1);
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .header-values {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin: 0;
    font-size: 0.8rem;
    letter-spacing: 0.12rem;
    text-transform: uppercase;
    color: rgba($white, 0.85);
    font-weight: 600;
  }

  .header-values .separator {
    opacity: 0.6;
  }

  // Hamburger Menu Button
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    z-index: 1001;
    transition: transform 0.3s ease;

    span {
      display: block;
      width: 28px;
      height: 3px;
      background-color: $white;
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    &.open {
      span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
      }

      span:nth-child(2) {
        opacity: 0;
      }

      span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
      }
    }

    @media (max-width: 768px) {
      display: flex;
    }
  }

  .main-nav {
    display: flex;
    gap: 2.5rem;

    a {
      color: $white;
      text-decoration: none;
      font-weight: 500;
      font-size: 1rem;
      transition: color 0.3s ease;
      position: relative;

      &:hover {
        color: $accent-gold;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: $accent-gold;
        transition: width 0.3s ease;
      }

      &:hover::after {
        width: 100%;
      }
    }

    // Mobile Menu Styles
    @media (max-width: 768px) {
      position: fixed;
      top: 0;
      right: -100%;
      width: 100%;
      max-width: 300px;
      height: 100vh;
      background-color: rgba($primary-color, 0.98);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      flex-direction: column;
      gap: 0;
      padding: 100px 2rem 2rem;
      box-shadow: -5px 0 20px rgba(0, 0, 0, 0.3);
      transition: right 0.3s ease;

      &.open {
        right: 0;
      }

      a {
        font-size: 1.25rem;
        padding: 1rem 0;
        border-bottom: 1px solid rgba($white, 0.1);

        &::after {
          display: none;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .logo {
      align-items: center;
    }

    .header-values {
      font-size: 0.75rem;
      letter-spacing: 0.1rem;
    }
  }
}
</style>
