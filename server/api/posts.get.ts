export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  
  // Default parameters
  const page = Number(query.page) || 1;
  const perPage = Number(query.perPage) || 6;
  const category = query.category as string || '';
  const featured = query.featured === 'true';
  
  // GraphQL query construction
  let postsQuery = `
    query GetPosts($first: Int, $after: String${category ? ', $categorySlug: String' : ''}${featured ? ', $tag: String' : ''}) {
      posts(
        first: $first, 
        after: $after,
        where: {
          ${category ? 'categoryName: $categorySlug,' : ''}
          ${featured ? 'tag: $tag' : ''}
          status: PUBLISH
          orderby: {field: DATE, order: DESC}
        }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          excerpt
          content
          slug
          date
          categories {
            nodes {
              name
              slug
              id
            }
          }
          tags {
            nodes {
              name
              slug
              id
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  // Variables for GraphQL query
  const variables: Record<string, any> = {
    first: perPage,
    after: null, // Implement pagination with cursor if needed
  };
  
  // Add conditional variables
  if (category) {
    variables.categorySlug = category;
  }
  
  if (featured) {
    variables.tag = 'featured';
  }
  
  try {
    // Make GraphQL request to WordPress
    const response: any = await $fetch(config.public.wpGraphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${config.public.wpUser}:${config.wpAppPassword}`).toString('base64')}`
      },
      body: JSON.stringify({
        query: postsQuery,
        variables
      })
    });
    
    // Return formatted response
    return {
      posts: response.data?.posts?.nodes || [],
      pageInfo: response.data?.posts?.pageInfo || { hasNextPage: false, endCursor: null },
    };
    
  } catch (error: any) {
    console.error('Error fetching WordPress posts:', error);
    
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Failed to fetch WordPress posts'
    });
  }
});