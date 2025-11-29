<template>
  <div class="sale-promo">
    <div class="sale-promo__section">
      <h3>Davines Holiday Boxes</h3>
      <p>Popular Davines products bundled at discount. Additional 15% off on Small Business Saturday!</p>
      <NuxtLink to="/shop" class="btn btn-primary">Shop Now</NuxtLink>
    </div>

    <div class="sale-promo__section">
      <h3>Gift Card Special</h3>
      <p>$100 gift card = Free travel-size shampoo + conditioner duo!</p>
      <NuxtLink to="/shop" class="btn btn-secondary">Get Gift Card</NuxtLink>
    </div>

    <div class="sale-promo__section">
      <h3>Extension Sale</h3>
      <p>Book/pay deposit 11/29 for discounts + free Davines gifts on new installs.</p>
      <NuxtLink to="/our-team#specialists" class="btn btn-primary">Book Consultation</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// No reactive data needed for this static component
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
  box-shadow: 0 2px 4px rgba($black, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 100%;
  align-items: stretch;
  justify-content: space-evenly;
}

.sale-promo__section {
  width: 100%;
  padding: $spacing-lg;
  background: rgba($white, 0.9);
  border-radius: 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: $spacing-md;
  box-sizing: border-box;
}

.sale-promo__section h3 {
  color: $primary-color;
  margin-bottom: $spacing-sm;
  font-size: 1.25rem;
  word-break: break-word;
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
  border-radius: 25px;
  font-family: $font-family;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-block;
  text-align: center;

  &-primary {
    background: $accent-gold;
    color: $white;
    border: 2px solid $accent-gold;

    &:hover {
      background: darken($accent-gold, 10%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba($accent-gold, 0.3);
    }
  }

  &-secondary {
    background: $accent-sage;
    color: $white;
    border: 2px solid $accent-sage;

    &:hover {
      background: darken($accent-sage, 10%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba($accent-sage, 0.3);
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
  }
  .sale-promo__section h3 {
    font-size: 1.1rem;
  }
  .sale-promo__section p {
    font-size: 0.85rem;
    margin-bottom: $spacing-md;
  }
}
</style>