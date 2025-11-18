<script setup>
import HeroContent from '@/components/HeroContent.vue'
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

const GET_SITE_INFO = gql`
  query GetSiteInfo {
    generalSettings {
      title
      description
    }
  }
`

const { result: data, loading: pending, error } = useQuery(GET_SITE_INFO)
</script>

<template>
  <div>
    <header v-if="data?.generalSettings">
      <p v-if="data.generalSettings.description">{{ data.generalSettings.description }}</p>
    </header>
    
    <HeroContent />

    <div v-if="pending">Loading...</div>
    <div v-if="error" class="error">Error: {{ error.message }}</div>

    <main>
      <!-- <HeroPlanets /> -->
    </main>
  </div>
</template>
