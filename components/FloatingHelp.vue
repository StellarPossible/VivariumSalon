<template>
  <button
    v-if="!isContactPage"
    type="button"
    class="floating-help"
    aria-label="Contact or get help"
    @click="open()"
  >
    <Icon icon="mdi:help-circle-outline" />
  </button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
const route = useRoute()
const isContactPage = computed(() => route.path === '/contact')
const { open } = useContactModal()
</script>

<style scoped lang="scss">
.floating-help {
  position: fixed;
  right: 1rem;
  bottom: 4.25rem; // sit just above fixed footer
  z-index: 3500; // higher than footer (3000)
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  backdrop-filter: blur(6px);
  background: rgba(0,0,0,0.45);
  color: #fff;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.25);
  cursor: pointer;
  transition: transform .15s ease, background .2s ease, border-color .2s ease, box-shadow .2s ease;

  :deep(svg) {
    width: 22px;
    height: 22px;
  }

  &:hover {
    transform: translateY(-1px);
    background: rgba(0,0,0,0.55);
    border-color: rgba(255,255,255,0.35);
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  }
}

@media (max-width: 768px) {
  .floating-help {
    bottom: 4rem;
    right: 0.75rem;
    width: 40px;
    height: 40px;
  }
}
</style>
