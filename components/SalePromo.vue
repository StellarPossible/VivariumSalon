<template>
  <div class="sale-promo">
    <div class="sale-promo__section">
      <h3>Gift Card Special</h3>
      <p>Spend $100 on a gift card and receive a <i>FREE</i> Davines travel-size shampoo + conditioner duo! Perfect for gifting.</p>
      <a href="https://vivarium.glossgenius.com/shop/gift-cards" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Get Gift Card</a>
    </div>

    <div class="sale-promo__section">
      <h3>Exclusive Davines Holiday Boxes</h3>
      <p>Popular Davines products bundled at unbeatable discounts! <i>Plus</i> 15% off only on Small Business Saturday through 12/1!</p>
      <NuxtLink to="/shop" class="btn btn-primary">Shop Now</NuxtLink>
    </div>

    <div class="sale-promo__section">
      <h3>Free Consultation</h3>
      <p>Ready to enhance your beauty? Schedule your complimentary consultation and discover personalized treatments tailored just for you.</p>
      <a href="https://vivarium.glossgenius.com/services" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">Book Free Consultation</a>
    </div>
  </div>
</template>

<script setup lang="ts">
// No reactive data needed for this static component
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;


.sale-promo {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  padding: $spacing-md; 
  background: rgba($white, 0.95);
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: $spacing-sm;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba($black, 0.15);
  border: 1px solid rgba($accent-gold, 0.2);
}

.sale-promo__section h3 {
  color: $primary-color;
  margin-bottom: $spacing-sm;
  font-size: 1.8rem;
  font-weight: 700;
  word-break: break-word;
  line-height: 1;
}

.sale-promo__section p {
  color: $text-color;
  line-height: 1;
  margin-bottom: $spacing-sm;
  font-size: 1.1rem;
  word-break: break-word;
}


.btn {
  padding: $spacing-md $spacing-lg;
  border-radius: 30px;
  font-family: $font-family;
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  letter-spacing: 0.5px;

  &-primary {
    background: linear-gradient(135deg, $accent-gold 0%, darken($accent-gold, 10%) 100%);
    color: $white;
    border: 2px solid $accent-gold;
    box-shadow: 0 4px 15px rgba($accent-gold, 0.4);

    &:hover {
      background: linear-gradient(135deg, darken($accent-gold, 10%) 0%, darken($accent-gold, 20%) 100%);
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba($accent-gold, 0.6);
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
      box-shadow: 0 6px 20px rgba($accent-sage, 0.6);
    }
  }
}


@media (min-width: 700px) {
  .sale-promo {
    grid-template-columns: repeat(3, 1fr);
  }
  .sale-promo__section {
    width: 100%;
    margin-bottom: 0;
  }
}

@media (max-width: 600px) {
  .sale-promo {
    grid-template-columns: 1fr;
  }
}
</style>