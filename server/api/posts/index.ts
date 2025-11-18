// Types for WordPress data
interface WordPressImage {
  node: {
    sourceUrl: string;
    altText?: string;
  }
}

interface WordPressCategory {
  id: string;
  name: string;
  slug: string;
}

interface WordPressPost {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  date: string;
  featuredImage?: WordPressImage;
  categories?: {
    nodes: WordPressCategory[];
  };
}

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const category = query.category as string
    const perPage = parseInt(query.perPage as string) || 6
    const page = parseInt(query.page as string) || 1
    
    // Set up the GraphQL endpoint
    const { public: { wordPressUrl } } = useRuntimeConfig()
    const graphqlEndpoint = `${wordPressUrl}/graphql`
    
    // Fetch posts by category
    
    // Build GraphQL query
    let graphqlQuery = `
      query GetPostsByCategory($perPage: Int, $page: Int, ${category ? '$categorySlug: String' : ''}) {
        posts(
          first: $perPage,
          after: $page
          where: {
            orderby: { field: DATE, order: DESC }
            ${category ? 'categoryName: $categorySlug' : ''}
          }
        ) {
          nodes {
            id
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            categories {
              nodes {
                id
                name
                slug
              }
            }
          }
        }
      }
    `
    
    // Variables for GraphQL query
    const variables = {
      perPage,
      page,
      ...(category && { categorySlug: category })
    }
    
    // Make the GraphQL request
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: graphqlQuery,
        variables
      }),
    })
    
    if (!response.ok) {
      throw new Error(`WordPress API returned ${response.status}: ${await response.text()}`)
    }
    
    const data = await response.json()
    
    // Handle API error response
    if (data.errors) {
      console.error('[Posts API] GraphQL errors:', data.errors)
      throw new Error('WordPress API returned errors: ' + JSON.stringify(data.errors))
    }
    
    // Format post dates
    const posts = data.data.posts.nodes.map((post: any) => ({
      ...post,
      date: new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }))
    
    // Posts successfully fetched
    
    return {
      posts,
      meta: {
        currentPage: page,
        perPage,
        category
      }
    }
  } catch (err: any) {
    console.error('[Posts API] Error fetching posts:', err)
    
    // Return error with status code
    event.node.res.statusCode = 500
    return {
      error: err.message || 'Failed to fetch posts',
      statusCode: 500
    }
  }
})