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
              <div class="highlight-actions">
                <a href="#available-spaces" class="cta-button">View Available Spaces</a>
              </div>
            </div>
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
  padding: $spacing-xl $spacing-lg $spacing-xl;
  position: relative;
  background: linear-gradient(180deg, transparent 0%, rgba($black, 0.2) 100%);
}

.container {
  max-width: 1300px;
  margin: 0 auto;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl * 2;
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
  padding: $spacing-xl * .75;
  margin-top: $spacing-xl;
  
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

  .highlight-actions {
    margin-top: $spacing-lg;
    display: flex;
    justify-content: center;
  }

  .cta-button {
    padding: $spacing-sm $spacing-xl;
    border-radius: 40px;
    font-size: 1rem;
    font-weight: 600;
    color: $white;
    text-decoration: none;
    background: linear-gradient(135deg, $accent-gold 0%, darken($accent-gold, 10%) 100%);
    box-shadow: 0 4px 15px rgba($accent-gold, 0.3);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($accent-gold, 0.5);
    }

    &:focus-visible {
      outline: 2px solid rgba($white, 0.9);
      outline-offset: 3px;
    }
  }
}
</style>
