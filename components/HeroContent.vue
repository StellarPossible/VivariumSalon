<template>
  <section class="hero-content" id="home">
    <div class="hero-inner">
      <div class="hero-cta">
        <a href="#shop" class="btn btn-primary">Shop Now</a>
        <a href="#specialists" class="btn btn-secondary">Book Services</a>
      </div>
      <div class="hero-logo">
        <img src="/images/vivariumlogo.png" alt="Vivarium Salon" />
      </div>
      <p class="hero-subtitle">Your Premier Destination for Beauty and Wellness</p>
    </div>
    <div class="hero-features">
      <div class="feature-card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="feature-copy">
          <h4>Eco-Friendly</h4>
          <p>Sustainable Beauty Brands</p>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div class="feature-copy">
          <h4>Community</h4>
          <p>Inclusive, Supportive Space</p>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="feature-copy">
          <h4>Independents</h4>
          <p>Professionals with Expertise</p>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div class="feature-copy">
          <h4>Woman-Owned</h4>
          <p>Built by a Stylist</p>
        </div>
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
  justify-content: space-evenly ;
  min-height: 100vh;
  text-align: center;
  position: relative;
  background: url('/images/vivariumhero.png') no-repeat center center;
  background-size: cover;
  scroll-margin-top: $spacing-xl * 3;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba($black, 0.5);
    z-index: 0;
  }
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-lg;
  width: 100%;
  position: relative;
  z-index: 1;
}

.hero-features {
  position: absolute;
  bottom: $spacing-sm;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: $spacing-lg;
  width: 100%;
  background: transparent;
  border: none;
  backdrop-filter: blur(5px);
  box-shadow: 0 10px 30px rgba($black, 0.45);
}

.feature-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm $spacing-md;
  border-radius: 14px;
  background: transparent;
  border: none;
  transition: transform 0.3s ease;
  justify-content: center;

  &:hover {
    transform: translateY(-3px);
  }
}

.feature-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba($accent-color, 0.7) 0%, rgba($accent-color, 0.5) 100%);
  flex-shrink: 0;

  svg {
    width: 22px;
    height: 22px;
    color: $white;
  }
}

.feature-copy h4 {
  margin: 0;
  font-size: 1rem;
  color: $white;
  font-weight: 600;
}

.feature-copy p {
  color: rgba($white, 0.75);
  font-size: 0.85rem;
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

.hero-title {
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  margin-bottom: $spacing-md;
  color: $white;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.hero-subtitle {
  margin: 0 0 $spacing-xl 0;
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
  margin-bottom: $spacing-lg;
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
  .hero-content {
    scroll-margin-top: $spacing-xl * 2;
  }

  .hero-inner {
    margin-top: 8rem;
  }

  .hero-cta {
    flex-direction: column;
    align-items: center;
    
    .btn {
      width: 100%;
      max-width: 300px;
    }
  }

  .hero-features {
    position: static;
    transform: none;
    width: 100%;
    background: transparent;
  }

  .feature-card {
    padding: $spacing-sm;
  }
}
</style>
