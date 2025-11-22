<template>
  <div class="our-team-page">
    <section class="hero">
      <div class="hero__overlay">
        <div class="hero__content">
          <p class="hero__eyebrow">Vivarium</p>
          <h1 class="hero__title">Our Team</h1>
          <div class="hero__actions">
            <a href="#specialists" class="hero__link">Meet the Specialists</a>
            <a href="#available-spaces" class="hero__link hero__link--outline">Join Vivarium</a>
          </div>
        </div>
      </div>
      <div class="hero__banner">
        <div class="hero__banner-content">
          <h2>Craftsmanship Rooted in Care</h2>
          <p>
            Our collective is grounded in mindful service and continual growth. Each specialist brings a unique perspective,
            backed by years of training and a dedication to holistic wellbeing. Together, we cultivate restorative experiences
            that honor every guest&#39;s individual rhythm and expression.
          </p>
        </div>
      </div>
    </section>

    <ServiceSpecialists />

    <section class="cta">
      <div class="cta__content">
        <h2>Join the Vivarium Collective</h2>
        <p>
          Ready to bring your passion for beauty into a supportive, independent environment? Reach out to learn
          about chair availability, collaboration opportunities, and how we can grow together.
        </p>
        <a href="mailto:booking@vivariumsalon.com?subject=Vivarium Team Inquiry" class="cta__button">
          Connect With Us
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRoute, onMounted, watch, nextTick } from '#imports'

const route = useRoute()

const scrollToHash = async () => {
  if (!route.hash) return
  await nextTick()
  const target = document.getElementById(route.hash.slice(1))
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(scrollToHash)

watch(
  () => route.hash,
  () => {
    scrollToHash()
  }
)
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.our-team-page {
  background-color: $background-color;
  color: $text-color;
}

.hero {
  position: relative;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba($primary-color, 0.9), rgba($accent-color, 0.85)),
    url('/images/site_images/monstera2.jpg') center/cover no-repeat;
  padding: $spacing-xl $spacing-lg;
  margin-top: 5rem;
  gap: $spacing-xl;
}

.hero__overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  z-index: 1;
}

.hero__content {
  max-width: 640px;
  background: rgba($white, 0.12);
  border: 1px solid rgba($white, 0.3);
  border-radius: 28px;
  padding: $spacing-xl * 1.5;
  color: $white;
  text-align: center;
  box-shadow: 0 20px 40px rgba($black, 0.25);
}

.hero__eyebrow {
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-size: 1.5rem;
  margin-bottom: $spacing-sm;
  color: rgba($white, 0.75);
}

.hero__title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  letter-spacing: 0.08em;
  margin-bottom: $spacing-md;
}

.hero__subtitle {
  font-size: 1.1rem;
  line-height: 1.1;
  margin: 0 auto $spacing-xl;
  max-width: 48ch;
  color: rgba($white, 0.85);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: $spacing-md;
  font-size: 1.2rem;
}

.hero__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem .9rem;
  border-radius: 999px;
  background: rgba($primary-color, 0.9);
  color: $white;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  box-shadow: 0 12px 30px rgba($black, 0.35);

  &:hover {
    transform: translateY(-2px);
    background: rgba($primary-color, 1);
    box-shadow: 0 16px 34px rgba($black, 0.45);
  }
}

.hero__banner {
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba($black, 0.35);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: rgba($white, 0.8);
}

.hero__banner-content {
  padding: $spacing-lg $spacing-xl;
  text-align: center;
  line-height: 1;
}

.hero__banner-content h2 {
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  margin-bottom: $spacing-sm;
  letter-spacing: 0.04em;
}

.hero__banner-content p {
  font-size: 1.05rem;
  line-height: 1;
  margin: 0;
}

.hero__link--outline {
  background: rgba($white, 0.95);
  border: 2px solid rgba($white, 0.6);
  color: rgba($primary-color, 0.85);
  box-shadow: 0 12px 30px rgba($black, 0.2);

  &:hover {
    background: rgba($white, 1);
    border-color: rgba($white, 0.75);
    box-shadow: 0 14px 32px rgba($black, 0.3);
  }
}

.cta {
  padding: $spacing-xl * 2 $spacing-lg $spacing-xl * 2.5;
  display: flex;
  justify-content: center;
  background: linear-gradient(135deg, rgba($accent-color, 0.15) 0%, rgba($accent-gold, 0.2) 100%);
}

.cta__content {
  max-width: 720px;
  text-align: center;
  background: rgba($white, 0.65);
  padding: $spacing-md;
  border-radius: 28px;
  border: 1px solid rgba($accent-gold, 0.3);
  box-shadow: 0 18px 36px rgba($accent-gold, 0.2);
  line-height: 2rem;
}

.cta__content h2 {
  font-size: clamp(2rem, 4vw, 2.6rem);
  margin-bottom: $spacing-md;
  letter-spacing: 0.05em;
  color: $primary-color;
}

.cta__content p {
  font-size: 1.05rem;
  line-height: 1.1;
  margin-bottom: $spacing-xl;
  color: rgba($primary-color, 0.85);
}

.cta__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-md $spacing-xl;
  border-radius: 999px;
  background: linear-gradient(135deg, $accent-gold 0%, $accent-color 100%);
  color: $white;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 10px 22px rgba($accent-gold, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba($accent-gold, 0.45);
  }
}

@media (max-width: $breakpoint-md) {
  .hero {
    min-height: 70vh;
    padding: $spacing-xl;
  }

  .hero__content {
    padding: $spacing-xl;
  }
  .hero__banner-content {
    padding: $spacing-lg;
  }

  .cta {
    padding: $spacing-xl * 1.5 $spacing-md;
  }

  .cta__content {
    padding: $spacing-sm;
  }
}

@media (max-width: $breakpoint-sm) {
  .hero__content {
    padding: $spacing-lg $spacing-md * 1.5;
  }

  .hero__actions {
    flex-direction: column;
  }

  .hero__banner-content {
    padding: $spacing-md $spacing-lg;
  }

  .cta__button {
    width: 100%;
  }
}
</style>
