export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  
  // Parse parameters
  const limit = Number(query.limit) || 20;
  const excludeEmpty = query.excludeEmpty !== 'false'; // Default to true
  const orderBy = query.orderBy === 'name' ? 'NAME' : 'COUNT';
  const orderDir = query.orderDir === 'asc' ? 'ASC' : 'DESC';
  
  // GraphQL query for categories with parameters
  const categoriesQuery = `
    query GetCategories {
      categories(
        first: ${limit},
        where: {
          hideEmpty: ${excludeEmpty}
          orderby: ${orderBy}
          order: ${orderDir}
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
        query: categoriesQuery
      })
    }) as any;
    
    // Return only the categories array
    return response.data?.categories?.nodes || [];
    
  } catch (error: any) {
    console.error('Error fetching WordPress categories:', error);
    
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Failed to fetch WordPress categories'
    });
  }
});