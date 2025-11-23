<template>
  <section class="shop-section" id="shop">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Shop Beauty by Vivarium</h2>
        <p class="section-subtitle">Discover premium beauty and wellness products</p>
        <div class="featured-brand">
          <span class="featured-label">Featuring</span>
          <div class="featured-content">
            <a
              href="https://davinespro.com/collections/we-sustain-beauty"
              target="_blank"
              rel="noopener noreferrer"
              class="featured-cta"
            >
              <span class="brand-mark">
              <img src="/public/images/site_images/davinesLogo.jpg" alt="Davines Pro" />
            </span>
            <div class="davines-copy"><i>We Sustain</i> Beauty Collection</div>
            </a>
          </div>
        </div>
      </div>

      <div class="category-gallery" role="list">
        <a
          v-for="category in categoryLinks"
          :key="category.name"
          class="category-card"
          :href="category.href"
          target="_blank"
          rel="noopener noreferrer"
          role="listitem"
        >
          <span class="category-name">{{ category.name }}</span>
          <span class="category-arrow" aria-hidden="true">→</span>
        </a>
      </div>

      <div class="shop-content">
        <ShopifyProductGrid :limit="20">
          <template #empty>
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
          </template>
        </ShopifyProductGrid>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const categoryNames = [
  'Alchemic System',
  'Authentic',
  'Essential Haircare',
  'Essential Haircare Shampoo Bars',
  'Hair Refresher',
  'Heart of Glass',
  'Liquid Spell',
  'Naturaltech',
  'Pasta & Love',
  'OI',
  'SU',
  'The Circle Chronicles',
];

const categoryLinks = categoryNames.map((name) => ({
  name,
  href: `https://davinespro.com/search?q=${encodeURIComponent(name)}`,
}));
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
  margin-bottom: $spacing-xl;
}

.section-title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  color: $white;
  font-weight: 700;
  line-height: 1.2;
}

.section-subtitle {
  font-size: clamp(1.5rem, 1.8vw, 1.8rem);
  color: rgba($white, 0.8);
  line-height: 1.4;
}

.featured-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  margin-top: $spacing-lg;
}

.featured-label {
  text-transform: uppercase;
  letter-spacing: 0.25rem;
  font-size: 1rem;
  color: rgba($white, 0.6);
}

.featured-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
}

.brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm * .5;
  border-radius: 999px;
  backdrop-filter: blur(15px);
}

.brand-mark img {
  height: 28px;
  width: auto;
  filter: invert(1);
}
.davines-copy {
  color: $white;
/* Min: 1.5rem | Ideal: 4% of screen width | Max: 3rem */
  font-size: clamp(1rem, 4vw, 1.5rem);  font-weight: 600;
  margin-top: 4px;
  opacity: 0.95;
}

.featured-cta {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-xs $spacing-lg;
  border-radius: 999px;
  border: 1px solid rgba($accent-gold, 0.6);
  color: $white;
  font-weight: 600;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba($accent-gold, 0.4) 0%, rgba($accent-color, 0.35) 100%);
  box-shadow: 0 6px 18px rgba($accent-gold, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba($accent-gold, 0.4);
  }
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
  padding: $spacing-xl;
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

.category-gallery {
  display: flex;
  gap: $spacing-lg;
  overflow-x: auto;
  padding: $spacing-md 0;
  margin: 0 calc(-1 * $spacing-md);
  scroll-snap-type: x mandatory;
  padding-inline: $spacing-md;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba($white, 0.08);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba($accent-gold, 0.6);
    border-radius: 999px;
  }
}

.category-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 220px;
  padding: $spacing-lg;
  border-radius: 18px;
  text-decoration: none;
  color: $white;
  background: linear-gradient(145deg, rgba($accent-color, 0.4) 0%, rgba($primary-color, 0.3) 100%);
  border: 1px solid rgba($white, 0.12);
  backdrop-filter: blur(16px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  scroll-snap-align: center;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.35);
    border-color: rgba($white, 0.3);
  }
}

.category-name {
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.3;
}

.category-arrow {
  margin-top: $spacing-lg;
  font-size: 1.8rem;
  opacity: 0.7;
}

@media (max-width: $breakpoint-md) {
  .shop-section {
    padding: $spacing-xl * .5 $spacing-md * .5;
  }

  .featured-brand {
    gap: $spacing-xs;
  }

  .featured-label {
    letter-spacing: 0.18rem;
  }
  
  .featured-content {
    gap: $spacing-sm;
  }
  
  .category-gallery {
    margin: 0;
    padding-inline: 0;
  }
  
  .category-card {
    min-width: 180px;
    padding: $spacing-md;
  }
}
</style>
