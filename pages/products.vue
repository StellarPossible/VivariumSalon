<template>
  <section class="products-page">
    <div class="hero">
      <h1>We Build Digital Tools That Empower</h1>
      <p>
        From WooCommerce bundles to HIPAA dashboards, our tools help small businesses,
        educators, and creators thrive.
      </p>
      <NuxtLink class="cta-button" to="/contact">Let's Talk</NuxtLink>
    </div>

    <div class="final-cta">
      <h2>Let’s Build Something Stellar Together</h2>
      <p>
        We specialize in tailored tech, made for humans. Let’s make your next platform unforgettable.
      </p>
      <NuxtLink class="cta-button" to="/contact">Schedule a Free Consult</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
// Simplified product listing for conversion-optimized layout
</script>

<style scoped lang="scss">
.products-page {
  padding: 4rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(3px);
}

.hero {
  max-width: 800px;
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #eee;
  }

  .cta-button {
    padding: 0.75rem 2rem;
    background: #00d1ff;
    color: #000;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
    transition: background 0.3s;

    &:hover {
      background: #00a3cc;
    }
  }
}

.product-showcase {
  display: grid;
  gap: 2rem;
  max-width: 1000px;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  .product-card {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    background: #fff;
    color: #000;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    gap: 1rem;

    .product-icon {
      font-size: 2.5rem;
    }

    .product-text {
      h2 {
        margin: 0 0 1rem;
        font-size: 1.5rem;
        font-weight: 700;
      }

      ul {
        list-style: none;
        padding: 0;
        margin-bottom: 1rem;

        li::before {
          content: '✔';
          margin-right: 0.5rem;
          color: #00d1ff;
        }
      }

      .learn-link {
        font-weight: 600;
        color: #0077cc;
        text-decoration: underline;
        font-size: 0.95rem;
      }
    }
  }
}

.final-cta {
  margin-top: 5rem;
  max-width: 700px;
  text-align: center;

  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    color: #ddd;
  }

  .cta-button {
    padding: 0.75rem 2rem;
    background: #00d1ff;
    color: #000;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
    transition: background 0.3s;

    &:hover {
      background: #00a3cc;
    }
  }
}
</style>