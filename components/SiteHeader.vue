<template>
  <header class="site-header" :class="{ scrolled: props.scrolled }">
    <div class="container">
      <div class="header-inner">
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

        <nav
          id="primary-navigation"
          class="primary-nav"
          :class="{ open: isMenuOpen }"
          aria-label="Primary"
        >
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            :class="{ active: isActive(link.to) }"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <button
          class="menu-toggle"
          type="button"
          @click="toggleMenu"
          :aria-expanded="isMenuOpen ? 'true' : 'false'"
          aria-controls="primary-navigation"
          aria-label="Toggle navigation"
        >
          <span class="menu-icon" :class="{ open: isMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from '#imports'

const props = defineProps<{
  scrolled: boolean
}>()

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Our Team', to: '/our-team' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
]

const isMenuOpen = ref(false)
const route = useRoute()

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function isActive(target: string) {
  if (target.includes('#')) {
    const [path, hash] = target.split('#')
    return route.path === path && route.hash === `#${hash}`
  }
  return route.path === target
}

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  }
)
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba($black, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;

  &.scrolled {
    background-color: transparent;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-lg;
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

.primary-nav {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.nav-link {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.16rem;
  color: rgba($white, 0.85);
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: color 0.25s ease, border-color 0.25s ease, background-color 0.25s ease;

  &:hover {
    color: $white;
  }

  &.active {
    color: #445347;
    border-color: rgba($white, 0.8);
    background-color: rgba($white, 0.8);
  }
}

.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: $spacing-sm;
  margin: 0;
}

.menu-icon {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 26px;

  span {
    height: 3px;
    background: $white;
    border-radius: 999px;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  &.open span:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }

  &.open span:nth-child(2) {
    opacity: 0;
  }

  &.open span:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem 1.25rem;
  }

  .header-inner {
    position: relative;
  }

  .logo img {
    height: 52px;
  }

  .header-values {
    font-size: 0.75rem;
    letter-spacing: 0.14rem;
  }

  .primary-nav {
    position: absolute;
    top: 100%;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-md;
    background: rgba($primary-color, 0.92);
    padding: $spacing-lg;
    border-radius: 16px;
    border: 1px solid rgba($white, 0.1);
    backdrop-filter: blur(18px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
    min-width: 220px;
    transform: translateY(12px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;

    &.open {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-link {
    font-size: 0.9rem;
  }
}
</style>
