<template>
  <div class="products-page">
    <section class="shop-section" id="shop">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Shop Our Collection</h2>
          <p class="section-subtitle">Discover Premium Beauty & Wellness Products</p>
        </div>

        <ShopifyProductGrid />
      </div>
    </section>
  </div>
</template>

<style scoped>
.products-page {
  min-height: 100vh;
  padding-top: 80px;
}

.shop-section {
  padding: 4rem 1.5rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
}

.section-title {
  color: #e6e3de;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-subtitle {
  color: #e7e4dfcc;
  font-size: clamp(0.95rem, 1.8vw, 1.2rem);
}
</style>
