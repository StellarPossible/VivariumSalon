export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { slug } = getRouterParams(event);
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post slug is required'
    });
  }
  
  // GraphQL query for a single post by slug
  const postQuery = `
    query GetPost($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        content
        excerpt
        date
        slug
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
        tags {
          nodes {
            id
            name
            slug
          }
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
        query: postQuery,
        variables: { slug }
      })
    }) as any;
    
    if (!response.data?.post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      });
    }
    
    // Get the post data
    const postData = response.data.post;
    
    // Process the content to ensure it's properly formatted
    let processedContent = postData.content || '<p>Content unavailable. This post may be empty or under construction.</p>';
    
    // Ensure there's proper paragraph wrapping for content
    if (processedContent && !processedContent.trim().startsWith('<')) {
      processedContent = `<p>${processedContent}</p>`;
    }
    
    // Format the post date
    const post = {
      ...postData,
      date: new Date(postData.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      // Set the processed content
      content: processedContent
    };
    
    return post;
  } catch (error: any) {
    console.error('Error fetching WordPress post:', error);
    
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Failed to fetch WordPress post'
    });
  }
});