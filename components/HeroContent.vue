<template>
  <section class="hero-content" id="home">
    <div class="hero-inner">
      <p class="hero-subtitle">Your Premier Destination for Beauty and Wellness</p>
      <div class="hero-logo">
        <img src="/images/vivariumlogo.png" alt="Vivarium Salon" />
      </div>
      <div class="hero-values">
        <span>Quality</span>
        <span class="separator">•</span>
        <span>Integrity</span>
        <span class="separator">•</span>
        <span>Authenticity</span>
      </div>
      <div class="hero-cta">
        <a href="#shop" class="btn btn-primary">Shop Now</a>
        <a href="#specialists" class="btn btn-secondary">Book Services</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  position: relative;
  background: url('/images/vivariumhero.png') no-repeat center center;
  background-size: cover;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba($black, 0.5);
    z-index: 0;
  }
}

.hero-inner {
  max-width: 75%;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-logo {
  display: flex;
  justify-content: center;
  
  img {
    max-width: 600px;
    width: 100%;
    height: auto;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.5));
  }
}

.hero-values {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  margin-bottom: $spacing-xl * 1.5;
  font-size: clamp(0.85rem, 1.8vw, 1.1rem);
  color: $white;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  span {
    opacity: 0.95;
  }
  
  .separator {
    opacity: 0.5;
    font-weight: 300;
  }
}

.hero-title {
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  margin-bottom: $spacing-md;
  color: $white;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.hero-subtitle {
  margin: 3rem 0 2rem 0;
  font-family: 'Charm', cursive;
  font-size: clamp(1.25rem, 3.2vw, 2.5rem);
  color: rgba($white, 0.9);
  margin-bottom: $spacing-xl;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  line-height: 1.2;
}

.hero-cta {
  display: flex;
  gap: $spacing-lg;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: $spacing-md $spacing-xl;
  border-radius: 50px;
  font-family: $font-family;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &-primary {
    background: linear-gradient(135deg, $accent-gold 0%, darken($accent-gold, 10%) 100%);
    color: $white;
    opacity: 0.9;
    box-shadow: 0 4px 15px rgba($accent-gold, 0.4);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    &:hover {
      opacity: 1;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($accent-gold, 0.6);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  &-secondary {
    background: $primary-color;
    color: $white;
    opacity: 0.9;
    border: 2px solid $primary-color;
    box-shadow: 0 4px 15px rgba($primary-color, 0.4);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    &:hover {
      opacity: 1;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($primary-color, 0.6);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

@media (max-width: $breakpoint-md) {
  .hero-cta {
    flex-direction: column;
    align-items: center;
    
    .btn {
      width: 100%;
      max-width: 300px;
    }
  }
}
</style>
