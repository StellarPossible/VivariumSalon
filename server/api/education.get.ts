export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  // GraphQL query for educational posts
  // This specifically targets posts in the Education category
  const educationPostsQuery = `
    query GetEducationPosts {
      # Featured education posts (with featured tag)
      featuredPosts: posts(
        first: 3,
        where: {
          categoryName: "education",
          tag: "featured"
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
        }
      }
      
      # Popular education posts (could be based on views or another tag)
      popularPosts: posts(
        first: 3,
        where: {
          categoryName: "education"
        }
      ) {
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
      
      # Categories relevant to education
      categories: categories(
        first: 20,
        where: {
          hideEmpty: true
          orderby: COUNT
          order: DESC
        }
      ) {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `;
  
  try {
    // Make GraphQL request to WordPress
    const response = await $fetch(config.public.wpGraphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${config.public.wpUser}:${config.wpAppPassword}`).toString('base64')}`
      },
      body: JSON.stringify({
        query: educationPostsQuery
      })
    }) as any;
    
    // Format the date for each post
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    // Process featured posts
    const featuredPosts = response.data?.featuredPosts?.nodes?.map((post: any) => ({
      ...post,
      date: formatDate(post.date),
      summary: post.excerpt.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
    })) || [];
    
    // Process popular posts
    const popularPosts = response.data?.popularPosts?.nodes?.map((post: any) => ({
      ...post,
      date: formatDate(post.date)
    })) || [];
    
    // Return formatted data
    return {
      featuredPosts,
      popularPosts,
      categories: response.data?.categories?.nodes || []
    };
    
  } catch (error: any) {
    console.error('Error fetching WordPress education content:', error);
    
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Failed to fetch education content'
    });
  }
});