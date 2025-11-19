<template>
  <section class="about-section" id="about">
    <div class="container">
      <div class="about-content">
        <div class="about-text">
          <h2 class="section-title">Welcome to Vivarium</h2>
          <div class="about-description">
            <p class="lead">
              A modern, full-service salon offering chair rentals with a fresh take on beauty. Located in the heart of Annapolis, MD, we provide a warm and stylish space where creativity thrives.
            </p>
            <p>
              At Vivarium, we're not just about style — we're about sustainability. Our talented team of independent professionals use the best eco-friendly and sustainable beauty brands, ensuring you get exceptional results while caring for the planet. We invite you to experience a space where beauty, community, and the environment come together.
            </p>
            <div class="highlight-box">
              <h3>Join Our Community</h3>
              <p>
                We're always excited to welcome new stylists to the Vivarium community. As a woman-owned salon built by a stylist for stylists, we're focused on empowering independents in an inclusive, supportive space. Here, everyone is celebrated, and we're committed to helping you thrive on your own terms.
              </p>
            </div>
          </div>
        </div>
        
        <div class="about-features">
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4>Eco-Friendly</h4>
            <p>Sustainable beauty brands for exceptional results</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4>Community</h4>
            <p>Where beauty, community, and environment unite</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4>Independent Professionals</h4>
            <p>Talented stylists with unique expertise</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4>Woman-Owned</h4>
            <p>Built by a stylist for stylists</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.about-section {
  padding: $spacing-xl * 5 $spacing-lg $spacing-xl * 4;
  position: relative;
  background: linear-gradient(180deg, transparent 0%, rgba($black, 0.2) 100%);
}

.container {
  max-width: 1300px;
  margin: 0 auto;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-xl * 2.5;
  align-items: start;
}

.about-text {
  .section-title {
    font-size: clamp(2.2rem, 4.5vw, 3rem);
    color: $white;
    margin-bottom: $spacing-xl * 1.5;
    font-weight: 700;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    line-height: 1.2;
  }
}

.about-description {
  p {
    font-size: clamp(0.95rem, 1.4vw, 1.1rem);
    line-height: 1.2;
    color: rgba($white, 0.95);
    margin-bottom: $spacing-lg;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    
    &.lead {
      font-size: clamp(1.05rem, 1.6vw, 1.25rem);
      font-weight: 500;
      color: $white;
      margin-bottom: $spacing-xl;
    }
  }
}

.highlight-box {
  background: linear-gradient(135deg, rgba($accent-color, 0.2) 0%, rgba($accent-color, 0.15) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba($accent-color, 0.4);
  border-radius: 20px;
  padding: $spacing-xl * 1.5;
  margin-top: $spacing-xl * 2;
  
  h3 {
    font-size: clamp(1.3rem, 2vw, 1.6rem);
    color: $white;
    margin-bottom: $spacing-md;
    font-weight: 700;
  }
  
  p {
    margin-bottom: 0;
    font-size: clamp(1rem, 1.5vw, 1.1rem);
  }
}

.about-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-xl;
}

.feature-card {
  background: rgba($white, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba($white, 0.1);
  border-radius: 15px;
  padding: $spacing-xl;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba($primary-color, 0.4);
    background: rgba($white, 0.08);
    box-shadow: 0 10px 30px rgba($black, 0.3);
  }
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba($accent-color, 0.4) 0%, rgba($accent-color, 0.3) 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-lg;
  
  svg {
    width: 32px;
    height: 32px;
    color: $white;
  }
}

.feature-card h4 {
  font-size: 1.2rem;
  color: $white;
  margin-bottom: $spacing-sm;
  font-weight: 600;
}

.feature-card p {
  font-size: 1rem;
  color: rgba($white, 0.8);
  line-height: 1.4;
  margin: 0;
}

@media (max-width: $breakpoint-lg) {
  .about-content {
    grid-template-columns: 1fr;
    gap: $spacing-xl * 2;
  }
  
  .about-features {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: $breakpoint-md) {
  
  .about-features {
    grid-template-columns: 1fr;
  }
  
  .highlight-box {
    padding: $spacing-xl;
  }
}
</style>
