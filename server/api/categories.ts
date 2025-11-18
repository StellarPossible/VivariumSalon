// Types for WordPress data
interface WordPressCategory {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export default defineEventHandler(async (event) => {
  try {
    // Set up the GraphQL endpoint
    const { public: { wordPressUrl } } = useRuntimeConfig()
    const graphqlEndpoint = `${wordPressUrl}/graphql`
    
    // Fetching categories from WordPress
    
    // GraphQL query for categories
    const query = `
      query GetCategories {
        categories {
          nodes {
            id
            name
            slug
            count
          }
        }
      }
    `
    
    // Make the GraphQL request
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
    
    if (!response.ok) {
      throw new Error(`WordPress API returned ${response.status}: ${await response.text()}`)
    }
    
    const data = await response.json()
    
    // Handle API error response
    if (data.errors) {
      console.error('[Categories API] GraphQL errors:', data.errors)
      throw new Error('WordPress API returned errors: ' + JSON.stringify(data.errors))
    }
    
    const categories = data.data.categories.nodes as WordPressCategory[]
    
    // Sort categories by post count (descending) and then alphabetically
    const sortedCategories = [...categories].sort((a, b) => {
      // First sort by post count (descending)
      if (a.count && b.count && a.count !== b.count) {
        return b.count - a.count
      }
      
      // Then alphabetically by name
      return a.name.localeCompare(b.name)
    })
    
    // Categories successfully fetched
    
    return {
      categories: sortedCategories
    }
  } catch (err: any) {
    console.error('[Categories API] Error fetching categories:', err)
    
    // Return error with status code
    event.node.res.statusCode = 500
    return {
      error: err.message || 'Failed to fetch categories',
      statusCode: 500
    }
  }
})