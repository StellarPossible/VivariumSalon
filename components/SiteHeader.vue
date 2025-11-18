<template>
  <header :class="['site-header', { scrolled }]">
    <div class="container" :class="{ 'home-layout': isHomePage }">
      <NuxtLink 
        to="/" 
        class="logo"
        :class="{ 'logo-hidden': isHomePage }"
      >
        <div v-if="isHomePage" class="logo-backdrop"></div>
        <img
          src="~/public/images/primary/spicon.png"
          alt="Stellar Possible logo"
        />
      </NuxtLink>

      <button
        class="menu-toggle"
        @click="isMenuOpen = !isMenuOpen"
        aria-label="Toggle navigation"
      >
        <span :class="{ open: isMenuOpen }"></span>
        <span :class="{ open: isMenuOpen }"></span>
        <span :class="{ open: isMenuOpen }"></span>
      </button>

      <nav
        class="nav"
        :class="{ open: isMenuOpen }"
      >
        <NuxtLink to="/" exact-active-class="active" @click="closeMenu">Home</NuxtLink>
        <NuxtLink to="/about" active-class="active" @click="closeMenu">About</NuxtLink>
        <NuxtLink to="/products" active-class="active" @click="closeMenu">Products</NuxtLink>
        <NuxtLink to="/blog" active-class="active" @click="closeMenu">Education</NuxtLink>
        
        
        <!-- Authentication Links -->
        <div v-if="user" class="auth-section">
          <NuxtLink to="/dashboard" class="dashboard-link" @click="closeMenu">Dashboard</NuxtLink>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
        <NuxtLink v-else to="/login" active-class="active" @click="closeMenu">Login</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{ scrolled: boolean }>()

const isMenuOpen = ref(false)
const route = useRoute()
import type { User } from '~/types/auth'
const user = useState<User | null>('auth.user', () => null)

const isHomePage = computed(() => route.path === '/')

function closeMenu() {
  isMenuOpen.value = false
}

async function logout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
  closeMenu()
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 2000;
  overflow: hidden;
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);
    z-index: -1;
    transition: background 0.3s ease, backdrop-filter 0.3s ease;
  }

  &.scrolled::before {
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
  }

  .container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: auto;
    padding: 0.5rem;
  }

  .logo {
    display: flex;
    align-items: center;
    transition: opacity 0.3s ease;
    position: relative;

    img {
      display: block;
      width: 7rem;
    }
  }

  .menu-toggle {
    position: relative;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 2.5rem;
    height: 2.5rem;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 1100;
    margin: 1rem;

    span {
      position: absolute;
      left: 0;
      width: 2.5rem;
      height: 0.25rem;
      background: $white;
      border-radius: 2px;
      transition: 0.3s;
    }

    span:nth-child(1) { top: 0.5rem; }
    span:nth-child(2) { top: 1.125rem; }
    span:nth-child(3) { top: 1.75rem; }

    & span.open:nth-child(1) {
      transform: translateY(0.625rem) rotate(45deg);
    }
    & span.open:nth-child(2) {
      opacity: 0;
    }
    & span.open:nth-child(3) {
      transform: translateY(-0.625rem) rotate(-45deg);
    }
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 2rem;
    opacity: 0.85;
    font-size: 1rem;
    font-family: 'Evermore', 'Inter', sans-serif;

    a {
      text-decoration: none;
      color: white;
      font-weight: 600;
      transition: color 0.2s;

      &:hover,
      &.active {
        color: $secondary;
      }
    }
  }

  .auth-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    .dashboard-link {
      text-decoration: none;
      color: white;
      font-weight: 600;
      transition: color 0.2s;
    }
    
    .logout-btn {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }

  @media (max-width: 768px) {
    .logo > img {
      width: 5rem;
    }

    .menu-toggle {
      display: flex;
    }

    .nav {
      padding: 0 1rem;
      margin: 0;
      position: fixed;
      bottom: 0;
      right: 0;
      height: 100vh;
      background: $primary;
      flex-direction: column;
      align-items: flex-start;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
      transform: translateX(100%);
      transition: transform 0.3s;
      z-index: 1050;
      width: 100%;
      justify-content: center;

      a {
        font-size: 1.2rem;
        width: 100%;
        text-align: right;
      }

      &.open {
        transform: translateX(0);
      }
    }

    .auth-section {
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
      width: 100%;
      
      .dashboard-link {
        text-align: right;
        width: 100%;
      }
      
      .logout-btn {
        width: auto;
        text-align: right;
        font-size: 1rem;
        padding: 0.75rem 1.5rem;
      }
    }
  }
}
</style>