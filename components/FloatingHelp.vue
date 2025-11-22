<template>
  <NuxtLink
    to="/our-team#specialists"
    class="floating-book-now"
    title="Book an appointment"
    @click.prevent="handleClick"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <span>Book Now</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useRoute, useRouter, nextTick } from '#imports'

const route = useRoute()
const router = useRouter()

const scrollToSpecialists = async () => {
  await nextTick()
  const target = document.getElementById('specialists')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleClick = async () => {
  if (route.path === '/our-team') {
    await scrollToSpecialists()
    return
  }

  try {
    await router.push({ path: '/our-team', hash: '#specialists' })
  } catch (error) {
    // Ignore navigation errors such as navigating to the same route
  }

  requestAnimationFrame(() => {
    scrollToSpecialists()
  })
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.floating-book-now {
  position: fixed;
  bottom: $spacing-xl;
  right: $spacing-xl;
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, rgba($primary-color, 0.85) 0%, rgba($primary-color, 0.35) 100%);
  color: $white;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba($black, 0.35);
  transition: all 0.3s ease;
  z-index: 1500;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 34px rgba($black, 0.45);
  }

  &:active {
    transform: translateY(-2px);
  }
}

@media (max-width: $breakpoint-md) {
  .floating-book-now {
    bottom: $spacing-lg;
    right: $spacing-lg;
    padding: $spacing-md $spacing-lg;

    svg {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
