<template>
  <section class="shop-section" id="shop">
    <div class="shop-section__shell">
      <div class="shop-banner">
        <video ref="bannerVideo" class="banner-video" :style="{ opacity: videoVisible ? 1 : 0 }" src="https://cdn.shopify.com/videos/c/o/v/187b3c0169694a8391dd3d7e75fcba05.mp4" loop muted playsinline></video>
        <div class="banner-overlay">
          <h2 class="shop-section__title">Discover Curated Favorites
</h2>
          <p class="shop-section__subtitle">
            Explore salon-favorite essentials, mindful treatments, and grooming staples selected to extend the Vivarium
            experience between visits.
          </p>
        </div>
      </div>
      <div class="shop-section__intro">
      </div>

      <div class="shop-section__content">
        <ShopifyProductGrid :view-mode="activeView" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, ref, onMounted } from 'vue'

type ShopView = 'collections' | 'all'

const activeView = ref<ShopView>('collections')
const bannerVideo = ref<HTMLVideoElement | null>(null)
const videoVisible = ref(false)

const scrollToView = (view: ShopView) => {
  if (typeof window === 'undefined') {
    return
  }

  const targetId = view === 'all' ? 'all-products-heading' : 'collection-browser-heading'

  nextTick(() => {
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const setView = (view: ShopView) => {
  if (activeView.value === view) {
    scrollToView(view)
    return
  }

  activeView.value = view
  scrollToView(view)
}

onMounted(() => {
  setTimeout(() => {
    videoVisible.value = true
    bannerVideo.value?.play()
  }, 3000)
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.shop-section {
  position: relative;
  padding: $spacing-md;
  background: linear-gradient(180deg, lighten($white, 4%) 0%, $white 60%, lighten($white, 2%) 100%);
}

.shop-section__shell {
  max-width: 1160px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.shop-section__intro {
  text-align: center;
  display: grid;
  gap: $spacing-sm;
  justify-items: center;
}

.shop-section__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-sm;
  border-radius: 999px;
  background: rgba($accent-sage, 0.12);
  color: $accent-sage;
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.shop-section__title {
  font-size: clamp(2.25rem, 4vw, 3rem);
  color: $accent-sage;
  font-weight: 600;
  line-height: 1.15;
  margin: 0;
}

.shop-section__subtitle {
  max-width: 52ch;
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  color: rgba($accent-sage, 0.75);
  line-height: 1.1;
  margin: 0;
}

.shop-section__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: $spacing-sm;
  margin-top: $spacing-md;
}

.shop-section__cta {
  appearance: none;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  padding: ($spacing-sm + 0.1rem) ($spacing-lg + 0.25rem);
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
  cursor: pointer;

  &--primary {
    background: $accent-sage;
    color: lighten($white, 8%);
    box-shadow: 0 12px 30px rgba($accent-sage, 0.18);
    border: 1px solid rgba($accent-sage, 0.2);

    &:hover,
    &:focus-visible {
      transform: translateY(-2px);
      box-shadow: 0 16px 36px rgba($accent-sage, 0.22);
      color: lighten($white, 12%);
    }
  }

  &--ghost {
    background: rgba($accent-sage, 0.1);
    color: $accent-sage;
    border: 1px solid rgba($accent-sage, 0.18);

    &:hover,
    &:focus-visible {
      transform: translateY(-2px);
      background: rgba($accent-sage, 0.16);
    }
  }
}

.shop-section__content {
  background: rgba($white, 0.92);
  border-radius: 28px;
  border: 1px solid rgba($accent-sage, 0.1);
  padding: $spacing-sm;
  box-shadow: 0 30px 70px rgba($accent-sage, 0.12);
}

.shop-section__content :deep(.shopify-product-grid) {
  margin-top: 0;
}

.shop-banner {
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center;
  background-image: url("//us.davines.com/cdn/shop/files/HOMEPAGE_MOBILE_1x1_opt2_800x.jpg?v=1763135549");
  border-radius: 28px;
  margin-bottom: $spacing-md;
  box-shadow: 0 30px 70px rgba($accent-sage, 0.12);
  overflow: hidden;
}

@media (min-width: 768px) {
  .shop-banner {
    background-image: url("//us.davines.com/cdn/shop/files/HOMEPAGE_2x1_81a2b063-6bd1-4e25-8d0d-02c73010f299_2000x.jpg?v=1763135550");
  }
}

.banner-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 1s ease;
}

.banner-overlay {
  position: absolute;
  top: 2rem;
  right: 2rem;
  color: white;
  max-width: 500px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.6);
  padding: 1rem 1.5rem;
  border-radius: 8px;
}

.banner-overlay .shop-section__title {
  font-size: 1.5rem;
  line-height: 1.1;
  color: $accent-sage;
  margin-bottom: 0.5rem;
}

.banner-overlay .shop-section__subtitle {
  font-size: 0.9rem;
  line-height: 1.05;
  color: rgba($accent-sage, 0.9);
}

@media (max-width: $breakpoint-md) {
  .shop-section__title {
    font-size: clamp(2rem, 6vw, 2.5rem);
  }
}

@media (max-width: $breakpoint-sm) {
 
  .shop-section__actions {
    flex-direction: column;
  }
}
</style>
