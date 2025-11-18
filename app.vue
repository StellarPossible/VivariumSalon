<template>
  <div class="layout-wrapper" :class="{ 'show-logo': isHomePage }">
    <!-- Homepage background overlay fade -->
    <div v-if="isHomePage" class="homepage-overlay"></div>

    <!-- Header with scroll prop -->
    <SiteHeader :scrolled="scrolledPastThreshold" />

    <main class="main-content">
      <div class="page-content">
        <!-- Render hero content only on home -->
        <HeroContent v-if="isHomePage" />
        <!-- Render all routed pages except home -->
        <NuxtPage v-else />
      </div>
    </main>
  </div>

  <!-- Floating help button -->
  <FloatingHelp />

  <!-- Contact modal -->
  <ContactModal />

  <SiteFooter />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import HeroContent from '@/components/HeroContent.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import ContactModal from '@/components/ContactModal.vue'
import FloatingHelp from '@/components/FloatingHelp.vue'

const route = useRoute()
const isHomePage = computed(() => route.path === '/')

const scrolledPastThreshold = ref(false)

function handleScroll() {
  const y = window.scrollY
  scrolledPastThreshold.value = y > 50
}

onMounted(() => {
  // Disable scroll on homepage
  document.body.style.overflow = isHomePage.value ? 'hidden' : 'auto'

  if (!isHomePage.value) {
    window.addEventListener('scroll', handleScroll)
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = 'auto'
  window.removeEventListener('scroll', handleScroll)
})

watch(isHomePage, (isHome) => {
  document.body.style.overflow = isHome ? 'hidden' : 'auto'
})
</script>

<style lang="scss">
@use '@/assets/scss/variables.scss' as *;

.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  color: $white;
  position: relative;
  background: var(--primary-color, #0e0f1a)
    url('/images/primary/galaxyBackground.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  overflow: hidden;

  &.show-logo::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0.95) 100%
    );
  }
}

.homepage-overlay {
  display: none; // Not needed now, fade handled via ::after
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
  z-index: 2;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  justify-content: center;
  position: relative;
  z-index: 2;
  margin-bottom: 3rem;
  margin-top: 6.5rem;

  .show-logo & {
    max-height: 100vh;
    overflow: hidden;
  }
}

/* WordPress content global styles */
.wp-content {
  color: #333;
  
  p {
    display: block;
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  h1, h2, h3, h4, h5, h6 {
    display: block;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    color: #222;
  }
  
  ul, ol {
    display: block;
    margin-left: 1.5rem;
    margin-bottom: 1rem;
    
    li {
      display: list-item;
      margin-bottom: 0.5rem;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1rem 0;
  }
  
  a {
    color: #0066cc;
    text-decoration: underline;
    
    &:hover {
      color: #004499;
    }
  }
}
</style>
