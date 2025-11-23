<template>
    <div class="about-page">
        <AboutSection />
    </div>
</template>

<script setup lang="ts">
// Sections are auto-imported
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.about-page {
    padding-top: $spacing-xl * 2.5;
}
@media (max-width: $breakpoint-md) {
    .about-page {
        padding-top: $spacing-xl * 2;
    }
}
</style>