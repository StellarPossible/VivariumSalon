<template>
  <div class="our-team-page">
    <section class="hero">
      <div class="hero__overlay">
        <div class="hero__content">
          <p class="hero__eyebrow">Vivarium Salon</p>
          <h1 class="hero__title">Our Team</h1>
          <p class="hero__subtitle">
            Meet the artists, educators, and collaborators who nurture a living space for beauty to thrive.
          </p>
          <div class="hero__actions">
            <a href="#specialists" class="hero__link">Meet the Specialists</a>
            <a href="#available-spaces" class="hero__link hero__link--outline">View Open Chairs</a>
          </div>
        </div>
      </div>
    </section>

    <section class="intro">
      <div class="intro__content">
        <h2>Craftsmanship Rooted in Care</h2>
        <p>
          Our collective is grounded in mindful service and continual growth. Each specialist brings a
          unique perspective, backed by years of training and a dedication to holistic wellbeing. Together,
          we cultivate restorative experiences that honor every guest&#39;s individual rhythm and expression.
        </p>
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
// Components are auto-imported by Nuxt
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
  align-items: stretch;
  justify-content: center;
  background: linear-gradient(135deg, rgba($primary-color, 0.75), rgba($accent-sage, 0.2)),
    url('/images/site_images/monstera2.jpg') center/cover no-repeat;
  padding: $spacing-xl $spacing-lg;
  margin-top: 5rem;
}

.hero__overlay {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
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
  font-size: 0.85rem;
  margin-bottom: $spacing-md;
  color: rgba($white, 0.75);
}

.hero__title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  letter-spacing: 0.08em;
  margin-bottom: $spacing-md;
}

.hero__subtitle {
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0 auto $spacing-xl;
  max-width: 48ch;
  color: rgba($white, 0.85);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: $spacing-md;
}

.hero__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-md $spacing-lg;
  border-radius: 999px;
  background: rgba($accent-color, 0.9);
  color: $white;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  box-shadow: 0 8px 18px rgba($accent-color, 0.4);

  &:hover {
    transform: translateY(-2px);
    background: rgba($accent-color, 1);
    box-shadow: 0 10px 22px rgba($accent-color, 0.55);
  }
}

.hero__link--outline {
  background: transparent;
  border: 2px solid rgba($white, 0.6);
  box-shadow: none;

  &:hover {
    background: rgba($white, 0.15);
    box-shadow: 0 10px 22px rgba($black, 0.25);
  }
}

.intro {
  padding: $spacing-xl * 2 $spacing-lg;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, rgba($white, 0.6) 0%, rgba($white, 0) 100%);
}

.intro__content {
  max-width: 780px;
  text-align: center;
}

.intro__content h2 {
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  letter-spacing: 0.04em;
  color: $primary-color;
}

.intro__content p {
  font-size: 1.1rem;
  line-height: 1.1;
  color: rgba($primary-color, 0.85);
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

  .intro {
    padding: $spacing-xl $spacing-md;
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

  .cta__button {
    width: 100%;
  }
}
</style>
