<template>
  <div class="sale-promo">
    <div class="sale-promo__section">
      <div class="section-icon">
        <Icon name="mdi:gift-outline" size="48" />
      </div>
      <h3>Davines Holiday Boxes</h3>
      <p>Popular Davines products bundled at discount. Additional 15% off on Small Business Saturday through 12/1!</p>
      <NuxtLink to="/shop" class="btn btn-primary">Shop Now</NuxtLink>
    </div>

    <div class="sale-promo__section">
      <div class="section-icon">
        <Icon name="mdi:credit-card-outline" size="48" />
      </div>
      <h3>Gift Card Special</h3>
      <p>$100 gift card = Free Davines travel-size shampoo + conditioner duo!</p>
      <a href="https://vivarium.glossgenius.com/shop/gift-cards" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Get Gift Card</a>
    </div>

    <div class="sale-promo__section">
      <div class="section-icon">
        <Icon name="mdi:calendar-check-outline" size="48" />
      </div>
      <h3>Extension Sale</h3>
      <p>Book/pay deposit 12/1 for discounts + free Davines gifts on new installs.</p>
      <NuxtLink to="/our-team#specialists" class="btn btn-primary">Book Consultation</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;


.sale-promo {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: $spacing-md;
  padding: $spacing-sm;
  background: transparent;
  width: 100%;
  align-items: stretch;
  justify-content: space-evenly;
}

.sale-promo__section {
  width: 100%;
  padding: $spacing-lg;
  background: linear-gradient(135deg, rgba($white, 0.95) 0%, rgba($white, 0.85) 100%);
  border-radius: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: $spacing-md;
  box-sizing: border-box;
  box-shadow: 0 8px 32px rgba($black, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba($white, 0.2);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, $accent-gold, $accent-sage);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 48px rgba($black, 0.15);
  }
}

.section-icon {
  margin-bottom: $spacing-md;
  color: $accent-sage;
  transition: transform 0.3s ease;

  .sale-promo__section:hover & {
    transform: scale(1.1);
  }
}

.sale-promo__section h3 {
  color: $primary-color;
  margin-bottom: $spacing-sm;
  font-size: 1.25rem;
  word-break: break-word;
  font-weight: 700;
}

.sale-promo__section p {
  color: $text-color;
  line-height: 1.6;
  margin-bottom: $spacing-lg;
  font-size: 0.9rem;
  word-break: break-word;
}


.btn {
  padding: $spacing-sm $spacing-md;
  border-radius: 50px;
  font-family: $font-family;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba($white, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &-primary {
    background: linear-gradient(135deg, $accent-gold 0%, darken($accent-gold, 10%) 100%);
    color: $white;
    border: 2px solid $accent-gold;
    box-shadow: 0 4px 15px rgba($accent-gold, 0.4);

    &:hover {
      background: linear-gradient(135deg, darken($accent-gold, 10%) 0%, darken($accent-gold, 20%) 100%);
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba($accent-gold, 0.6);
    }
  }

  &-secondary {
    background: linear-gradient(135deg, $accent-sage 0%, darken($accent-sage, 10%) 100%);
    color: $white;
    border: 2px solid $accent-sage;
    box-shadow: 0 4px 15px rgba($accent-sage, 0.4);

    &:hover {
      background: linear-gradient(135deg, darken($accent-sage, 10%) 0%, darken($accent-sage, 20%) 100%);
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba($accent-sage, 0.6);
    }
  }
}


@media (min-width: 700px) {
  .sale-promo {
    flex-direction: row;
    flex-wrap: wrap;
    gap: $spacing-md;
  }
  .sale-promo__section {
    width: calc(33.333% - #{$spacing-md});
    margin-bottom: 0;
    animation: slideUp 0.6s ease-out forwards;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: $breakpoint-md) {
  .sale-promo {
    flex-direction: column;
    padding: $spacing-md;
  }
  .sale-promo__section {
    width: 100%;
    padding: $spacing-md;
    margin-bottom: $spacing-md;
    animation: fadeIn 0.6s ease-out forwards;
  }
  .sale-promo__section h3 {
    font-size: 1.1rem;
  }
  .sale-promo__section p {
    font-size: 0.85rem;
    margin-bottom: $spacing-md;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>