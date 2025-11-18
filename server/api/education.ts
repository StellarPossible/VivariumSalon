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
  count?: number;
}

interface WordPressPost {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  date: string;
  summary?: string;
  featuredImage?: WordPressImage;
}

interface EducationData {
  featuredPosts: WordPressPost[];
  popularPosts: WordPressPost[];
  categories: WordPressCategory[];
}

export default defineEventHandler(async (event) => {
  try {
    // Set up the GraphQL endpoint and headers
    const { public: { wordPressUrl } } = useRuntimeConfig()
    const graphqlEndpoint = `${wordPressUrl}/graphql`
    
    // GraphQL query to fetch featured posts, popular posts, and categories
    const query = `
      query GetEducationContent {
        # Featured posts (most recent)
        featuredPosts: posts(first: 6, where: { orderby: { field: DATE, order: DESC } }) {
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
        
        # Popular posts (can be customized with tag or category filters)
        popularPosts: posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            id
            title
            slug
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
        
        # All categories with posts count
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
      console.error('[Education API] GraphQL errors:', data.errors)
      throw new Error('WordPress API returned errors: ' + JSON.stringify(data.errors))
    }
    
    // Format post date
    const formatPosts = (posts: any[]): WordPressPost[] => {
      return posts.map(post => ({
        ...post,
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }))
    }
    
    // Prepare the response data
    const educationData: EducationData = {
      featuredPosts: formatPosts(data.data.featuredPosts.nodes),
      popularPosts: formatPosts(data.data.popularPosts.nodes),
      categories: data.data.categories.nodes
    }
    
    // Data successfully fetched
    
    return educationData
  } catch (err: any) {
    console.error('[Education API] Error fetching education content:', err)
    
    // Return error with status code
    event.node.res.statusCode = 500
    return {
      error: err.message || 'Failed to load education content',
      statusCode: 500
    }
  }
})