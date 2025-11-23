export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxtjs/shopify',  // Add this line
  ],

  // Add Shopify configuration
  shopify: {
    domain: process.env.SHOPIFY_STORE_DOMAIN || '',
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
    apiVersion: process.env.SHOPIFY_API_VERSION || '2024-01',
  },
  css: ['@/assets/scss/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/variables.scss" as *;`,
        },
      },
    },
  },

  devServer: {
    port: 3001,
    host: '0.0.0.0',
  },

  // Full SSR for headless frontend
  ssr: true,

  // Route rules optimized for headless CMS
  routeRules: {
    // Static pages (can be prerendered)
    '/': { prerender: true },
    '/about': { prerender: true },
    '/contact': { prerender: true },
    '/products': { prerender: true },
    
    // Dynamic content from headless CMS
    '/blog': { isr: true },
    '/blog/**': { isr: 3600 }, // Cache for 1 hour
    
    // Authentication pages (client-side)
    '/login': { ssr: false },
    '/register': { ssr: false },
    
    // API routes (server-side only)
    '/api/**': { 
      cors: true,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  },

  nitro: {
    preset: 'node-server',
    
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml'],
      failOnError: false,
      ignore: ['/api/**']
    },
    compatibilityDate: '2025-01-15'
  },

  runtimeConfig: {
    // Private keys (server-side only)
    wpAppPassword: process.env.WP_APP_PASSWORD || '',
    jwtSecret: process.env.JWT_SECRET || '',
    
    // Public keys (client-side accessible)
    public: {
      wpUser: process.env.WP_USER || '',
      // Updated for vivarium subdomain
      wpGraphqlEndpoint: process.env.WP_GRAPHQL_ENDPOINT || 'https://vivarium.stellarpossible.com/cms/graphql',
      wpRestEndpoint: process.env.WP_REST_ENDPOINT || 'https://vivarium.stellarpossible.com/cms/wp-json',
      useJWT: process.env.USE_JWT || 'true',
      
      // Shopify configuration
      shopifyStoreDomain: process.env.SHOPIFY_STORE_DOMAIN || '',
      shopifyStorefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
      shopifyApiVersion: process.env.SHOPIFY_API_VERSION || '2024-01'
    },

    // Email/private server-side config
    emailFrom: process.env.EMAIL_FROM || '',
    emailTo: process.env.EMAIL_TO || '',
    resendApiKey: process.env.RESEND_API_KEY || ''
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true
  },

  compatibilityDate: '2025-01-15'
})