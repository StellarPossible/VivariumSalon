<template>
  <section class="specialists-section" id="specialists">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Meet Our Service Specialists</h2>
        <p class="section-subtitle">Expert Professionals Dedicated to Bringing Out Your Best</p>
      </div>
      
      <div class="specialists-grid">
        <div 
          v-for="(specialist, index) in specialists" 
          :key="specialist.id"
          class="specialist-card"
          :id="index === firstAvailableIndex ? 'available-spaces' : undefined"
        >
          <div
            class="specialist-image"
            :class="{ 'is-available': specialist.isAvailable || !shouldShowImage(specialist) }"
          >
            <img v-if="shouldShowImage(specialist)" :src="specialist.image" :alt="specialist.name" />
            <span
              v-if="specialist.isAvailable || !shouldShowImage(specialist)"
              class="specialist-placeholder-label"
            >
              {{ specialist.name }}
            </span>
          </div>
          <div class="specialist-info">
            <h3 class="specialist-name">{{ specialist.name }}</h3>
            <p class="specialist-title">{{ specialist.title }}</p>
            <div class="specialties">
              <span 
                v-for="(specialty, index) in specialist.specialties" 
                :key="index"
                class="specialty-tag"
              >
                {{ specialty }}
              </span>
            </div>
            <div class="booking-options">
              <a 
                v-if="specialist.isAvailable" 
                href="mailto:booking@vivariumsalon.com?subject=Chair Rental Inquiry"
                class="booking-btn booking-inquiry"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Inquire About Rental
              </a>
              <a 
                v-if="specialist.bookingPhone" 
                :href="`sms:${specialist.bookingPhone}`"
                class="booking-btn booking-text"
                :class="{ revealed: isPhoneRevealed(specialist.id) }"
                @click="handleTextClick($event, specialist.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span class="booking-text__content" aria-live="polite">
                  <span
                    class="booking-text__label"
                    :aria-hidden="isPhoneRevealed(specialist.id) ? 'true' : 'false'"
                  >
                    Text to Book
                  </span>
                  <span
                    class="booking-text__phone"
                    :aria-hidden="isPhoneRevealed(specialist.id) ? 'false' : 'true'"
                  >
                    {{ specialist.bookingPhone }}
                  </span>
                </span>
              </a>
              <a 
                v-if="specialist.bookingUrl" 
                :href="specialist.bookingUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="booking-btn booking-online"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Online
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const specialists = ref([
  {
    id: 1,
    name: 'Jessie Dean',
    title: 'Owner / Stylist',
    image: '/images/staff/vivariumjessica.jpg',
    bookingPhone: '443-717-3313',
    bookingUrl: 'https://vivarium.glossgenius.com/services',
    specialties: ['Salon Owner', 'Hair Styling', 'Color Services']
  },
  {
    id: 2,
    name: 'Molly Pinder',
    title: 'Stylist',
    image: '/images/staff/vivariummolly.jpg',
    bookingPhone: '303-862-2812',
    specialties: ['Hair Styling', 'Color', 'Cuts']
  },
  {
    id: 3,
    name: 'Andi Heilman',
    title: 'Stylist',
    image: '/images/staff/vivariumandi.png',
    bookingPhone: '717-332-0724',
    specialties: ['Hair Styling', 'Color', 'Cuts']
  },
  {
    id: 4,
    name: 'Hannah Connolly',
    title: 'Stylist',
    image: '/images/staff/vivariumhannah.png',
    bookingPhone: '410-533-3782',
    specialties: ['Hair Styling', 'Color', 'Cuts']
  },
  {
    id: 5,
    name: 'Jamie Bohns',
    title: 'Stylist',
    image: '/images/staff/vivariumjamie.png',
    bookingPhone: '219-669-0103',
    specialties: ['Hair Styling', 'Color', 'Cuts']
  },
  {
    id: 6,
    name: 'Emma Wingert',
    title: 'Stylist',
    image: '/images/staff/vivariumemma.png',
    bookingUrl: 'https://vivarium.glossgenius.com/services',
    specialties: ['Hair Styling', 'Color', 'Cuts']
  },
  {
    id: 7,
    name: 'Chair Available',
    title: 'Aesthetician',
    image: '/images/staff/placeholder-aesthetician.jpg',
    isAvailable: true,
    specialties: ['Chair Rental', 'Independent Professional']
  },
  {
    id: 8,
    name: 'Space Available',
    title: 'Stylist',
    image: '/images/staff/placeholder-stylist.jpg',
    isAvailable: true,
    specialties: ['Chair Rental', 'Hair Services']
  },
  {
    id: 9,
    name: 'Join Our Team',
    title: 'Beauty Professional',
    image: '/images/staff/placeholder-open.jpg',
    isAvailable: true,
    specialties: ['Chair Rental', 'Various Services']
  }
])

const firstAvailableIndex = computed(() =>
  specialists.value.findIndex((specialist) => specialist.isAvailable)
)

const revealedPhones = ref<Record<number, boolean>>({})

function isPhoneRevealed(id: number) {
  return Boolean(revealedPhones.value[id])
}

function handleTextClick(event: MouseEvent, id: number) {
  if (isPhoneRevealed(id)) {
    return
  }

  event.preventDefault()
  revealedPhones.value = { ...revealedPhones.value, [id]: true }
}

function shouldShowImage(specialist: { image?: string; isAvailable?: boolean }) {
  if (!specialist?.image) {
    return false
  }

  if (specialist.isAvailable) {
    return false
  }

  return !/placeholder/i.test(specialist.image)
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.specialists-section {
  padding: $spacing-xl $spacing-lg $spacing-xl;
  position: relative;
  background: rgba(68, 83, 71, 0.8);
}

.container {
  max-width: 1300px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: $spacing-xl;
}

.section-title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  color: $white;
  margin-bottom: $spacing-sm;
  font-weight: 700;
  line-height: 1.2;
}

.section-subtitle {
  font-family: 'Charm', cursive;
  font-size: clamp(1.2rem, 1.8vw, 1.2rem);
  color: rgba($white, 0.8);
  line-height: 1.2;
}

.specialists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 280px));
  justify-content: center;
  gap: 1rem;
}

.specialist-card {
  background: rgba(68, 83, 71, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba($white, 0.12);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  max-width: 14rem;
  
  &:hover {
    transform: translateY(-10px);
    border-color: rgba($white, 0.2);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    
    .specialist-image img {
      transform: scale(1.1);
    }
  }
}

#available-spaces {
  scroll-margin-top: $spacing-xl * 2.5;
}

.specialist-image {
  width: 100%;
  height: 260px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, rgba($primary-color, 0.3) 0%, rgba($accent-color, 0.3) 100%);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    position: relative;
    z-index: 1;
  }
  
  // Placeholder pattern when image is missing
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ffffff' fill-opacity='0.1'/%3E%3Cpath d='M30 75 Q30 60 50 60 Q70 60 70 75 L70 85 L30 85 Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 60%;
    z-index: 0;
  }
}

.specialist-placeholder-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 $spacing-md;
  font-size: 1.05rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba($white, 0.9);
  opacity: 0.8;
  z-index: 2;
  pointer-events: none;
}

.specialist-info {
  padding: calc(#{$spacing-lg} * 0.75) calc(#{$spacing-xl} * 0.75) calc(#{$spacing-xl} * 0.75);
}

.specialist-name {
  font-size: 1.05rem;
  color: $white;
  margin-bottom: $spacing-xs;
  font-weight: 700;
  line-height: 1.3;
}

.specialist-title {
  font-size: 0.85rem;
  color: rgba($white, 0.7);
  margin-bottom: calc(#{$spacing-md} * 0.75);
  font-style: italic;
}

.specialties {
  display: flex;
  flex-wrap: wrap;
  gap: calc(#{$spacing-xs} * 0.75);
  margin-bottom: calc(#{$spacing-md} * 0.75);
}

.specialty-tag {
  padding: calc(#{$spacing-xs} * 0.75) calc(#{$spacing-md} * 0.75);
  background: rgba($primary-color, 0.6);
  border: 1px solid rgba($accent-color, 0.4);
  border-radius: 20px;
  font-size: 0.75rem;
  color: $white;
}

.booking-options {
  display: flex;
  flex-direction: column;
  gap: calc(#{$spacing-md} * 0.75);
  margin-top: calc(#{$spacing-lg} * 0.75);
}

.booking-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: calc(#{$spacing-md} * 0.75) calc(#{$spacing-lg} * 0.75);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &.booking-text {
    background: rgba($primary-color, 0.85);
    color: $white;
    box-shadow: 0 12px 30px rgba($black, 0.35);
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 34px rgba($black, 0.45);
    }

    &.revealed {
      background: linear-gradient(135deg, rgba($primary-color, 0.85) 0%, rgba($accent-color, 0.7) 100%);
    }

    .booking-text__content {
      display: grid;
      position: relative;
      min-width: 8.5rem;
    }

    .booking-text__label,
    .booking-text__phone {
      grid-area: 1 / 1 / 2 / 2;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .booking-text__phone {
      opacity: 0;
      transform: translateY(10px);
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    &.revealed {
      .booking-text__label {
        opacity: 0;
        transform: translateY(-10px);
      }

      .booking-text__phone {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
  
  &.booking-online {
    background: rgba($white, 0.9);
    color: $black;
    border: 2px solid rgba($white, 0.4);
    
    &:hover {
      background: rgba($white, 1);
      border-color: rgba($white, 0.6);
      transform: translateY(-2px);
    }
  }
  
  &.booking-inquiry {
    background: linear-gradient(135deg, $accent-color 0%, darken($accent-color, 5%) 100%);
    color: $white;
    box-shadow: 0 4px 15px rgba($accent-color, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($accent-color, 0.6);
    }
  }
}

@media (max-width: $breakpoint-lg) {
  .specialists-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 240px));
  }
}

@media (max-width: $breakpoint-md) {
  
  .specialists-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 200px));
    gap: calc(#{$spacing-xl} * 0.75);
  }
  
  .specialist-image {
    height: 220px;
  }
}
</style>
