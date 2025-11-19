<template>
  <section class="shop-section" id="shop">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Shop Our Collection</h2>
        <p class="section-subtitle">Discover premium beauty and wellness products</p>
      </div>
      
      <div class="shop-content">
        <div class="shop-message">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3>Coming Soon</h3>
          <p>Our exclusive product collection will be available soon. Stay tuned for premium hair care, beauty products, and wellness essentials.</p>
          <div class="features">
            <div class="feature-item">
              <span class="check-icon">✓</span>
              <span>Professional-grade products</span>
            </div>
            <div class="feature-item">
              <span class="check-icon">✓</span>
              <span>Exclusive salon brands</span>
            </div>
            <div class="feature-item">
              <span class="check-icon">✓</span>
              <span>Personalized recommendations</span>
            </div>
          </div>
        </div>
        
        <!-- Placeholder for future product grid -->
        <div class="shop-grid">
          <div class="product-card placeholder">
            <div class="product-image"></div>
            <div class="product-info">
              <h4>Premium Hair Care</h4>
              <p>Coming Soon</p>
            </div>
          </div>
          <div class="product-card placeholder">
            <div class="product-image"></div>
            <div class="product-info">
              <h4>Styling Products</h4>
              <p>Coming Soon</p>
            </div>
          </div>
          <div class="product-card placeholder">
            <div class="product-image"></div>
            <div class="product-info">
              <h4>Wellness Essentials</h4>
              <p>Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// This component will be integrated with Shopify API in the future
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.shop-section {
  padding: $spacing-xl * .5 $spacing-lg * .5 $spacing-xl * .5;
  position: relative;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: $spacing-xl * 2.5;
}

.section-title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  color: $white;
  margin-bottom: $spacing-md;
  font-weight: 700;
  line-height: 1.2;
}

.section-subtitle {
  font-size: clamp(1.5rem, 1.8vw, 1.8rem);
  color: rgba($white, 0.8);
  line-height: 1.4;
}

.shop-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl * 2;
}

.shop-message {
  background: rgba($white, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba($white, 0.1);
  border-radius: 20px;
  padding: $spacing-xl * 2;
  text-align: center;
  
  .icon {
    width: 80px;
    height: 80px;
    margin: 0 auto $spacing-xl;
    background: linear-gradient(135deg, $primary-color 0%, darken($primary-color, 5%) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 40px;
      height: 40px;
      color: $white;
    }
  }
  
  h3 {
    font-size: 2rem;
    color: $white;
    margin-bottom: $spacing-md;
  }
  
  p {
    font-size: 1.1rem;
    color: rgba($white, 0.8);
    margin-bottom: $spacing-xl;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}

.features {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  max-width: 500px;
  margin: $spacing-xl auto 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  font-size: 1.1rem;
  color: rgba($white, 0.9);
  
  .check-icon {
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, $accent-color 0%, darken($accent-color, 5%) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
  }
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-xl;
}

.product-card {
  background: rgba($white, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba($white, 0.1);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba($white, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  &.placeholder {
    opacity: 0.6;
  }
}

.product-image {
  width: 100%;
  height: 250px;
  background: linear-gradient(135deg, rgba($primary-color, 0.2) 0%, rgba($accent-color, 0.2) 100%);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
}

.product-info {
  padding: $spacing-lg;
  
  h4 {
    font-size: 1.3rem;
    color: $white;
    margin-bottom: $spacing-sm;
  }
  
  p {
    color: rgba($white, 0.7);
    font-size: 1rem;
  }
}

@media (max-width: $breakpoint-md) {
  .shop-section {
    padding: $spacing-xl * .5 $spacing-md * .5;
  }
  
  .shop-message {
    padding: $spacing-xl;
  }
  
  .shop-grid {
    grid-template-columns: 1fr;
  }
}
</style>
