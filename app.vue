<template>
  <div class="layout-wrapper">
    <!-- Header with scroll prop -->
    <SiteHeader :scrolled="scrolledPastThreshold" />

    <main class="main-content">
      <div class="page-content">
        <!-- Hero Section -->
        <HeroContent />
        
        <!-- About Section -->
        <AboutSection />
        
        <!-- Shop Section (Priority) -->
        <ShopSection />
        
        <!-- Service Specialists Section -->
        <ServiceSpecialists />
      </div>
    </main>
  </div>

  <!-- Floating Book Now button -->
  <FloatingHelp @open-booking="openBookingModal" />

  <!-- Contact modal -->
  <ContactModal ref="bookingModal" />

  <SiteFooter />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
// Components are auto-imported by Nuxt

const scrolledPastThreshold = ref(false)
const bookingModal = ref<any>(null)

function handleScroll() {
  const y = window.scrollY
  scrolledPastThreshold.value = y > 50
}

function openBookingModal() {
  if (bookingModal.value) {
    bookingModal.value.open()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss">
@use '@/assets/scss/variables.scss' as *;

.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: $font-family;
  color: $white;
  position: relative;
  background: $black
    url('/images/primary/galaxyBackground.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
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
  position: relative;
  z-index: 2;
  margin-top: 1rem;
}

/* WordPress content global styles */
.wp-content {
  color: #333;
  
  p {
    display: block;
    margin-bottom: 1rem;
    line-height: 1.2;
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
