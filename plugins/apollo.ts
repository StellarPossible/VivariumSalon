import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { DefaultApolloClient } from '@vue/apollo-composable'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('🚀 Apollo plugin initializing...')
  
  const config = useRuntimeConfig()
  
  // Create HTTP link
  const httpLink = createHttpLink({
    uri: config.public.wpGraphqlEndpoint || 'https://stellarpossible.com/graphql',
  })

  // Create auth link
  const authLink = setContext((_, { headers }) => {
    const username = config.public.wpUser
    const password = process.client ? '' : config.wpAppPassword // Only available on server
    
    if (!username) {
      console.warn('⚠️ No WordPress username configured')
      return { headers }
    }

    // On client side, we'll handle auth differently or use a server endpoint
    if (process.client) {
      console.log('🔄 Client-side request - auth will be handled by server')
      return { headers }
    }

    // Server-side auth
    if (password) {
      const authToken = Buffer.from(`${username}:${password}`).toString('base64')
      return {
        headers: {
          ...headers,
          Authorization: `Basic ${authToken}`,
        },
      }
    }

    return { headers }
  })

  // Create Apollo Client
  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    ssrMode: process.server,
  })

  console.log('✅ Apollo client created')
  nuxtApp.vueApp.provide(DefaultApolloClient, apolloClient)
})