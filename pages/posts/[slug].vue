<script setup lang="ts">
// Import the WordPress content component
import WordPressContent from '~/components/WordPressContent.vue';

// Define types for blog post data
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

interface WordPressTag {
  id: string;
  name: string;
  slug: string;
}

interface WordPressPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  date: string;
  featuredImage?: WordPressImage;
  categories?: {
    nodes: WordPressCategory[];
  };
  tags?: {
    nodes: WordPressTag[];
  };
}

const route = useRoute();
const slug = route.params.slug as string;
const post = ref<WordPressPost | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

// Function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// GraphQL query for post
const POST_QUERY = `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
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

// Fetch the post data
const fetchPost = async (): Promise<void> => {
  try {
    loading.value = true;
    error.value = null;
    
    // Using the dedicated API endpoint for individual posts
    // Use explicit typing with the $fetch generic parameter
    const postData = await $fetch<WordPressPost>(`/api/posts/${slug}`);
    
    // Set the post data
    post.value = postData;
    
    // Set page title
    useHead({
      title: `${post.value.title} | StellarPossible`,
      meta: [
        { name: 'description', content: post.value.excerpt?.replace(/<[^>]*>/g, '') || post.value.title }
      ]
    });
  } catch (err: any) {
    error.value = err.message || 'Failed to load post';
    console.error('Error fetching post:', err);
  } finally {
    loading.value = false;
  }
};

// Fetch on component mount
onMounted(() => {
  fetchPost();
});
</script>

<template>
  <div class="post-container">
    <template v-if="loading">
      <div class="loading-state">
        <p>Loading post...</p>
      </div>
    </template>
    
    <template v-else-if="error">
      <div class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchPost" class="retry-button">Try Again</button>
        <NuxtLink to="/blog" class="back-btn">
          Back to Education
        </NuxtLink>
      </div>
    </template>
    
    <template v-else-if="post">
      <div class="post-header">
        <div class="meta">
          <div v-if="post.categories?.nodes && post.categories.nodes.length" class="categories">
            <NuxtLink 
              v-for="category in post.categories.nodes" 
              :key="category.id"
              :to="`/blog?category=${category.slug}`" 
              class="category"
            >
              {{ category.name }}
            </NuxtLink>
          </div>
          <div class="date">{{ post.date }}</div>
        </div>
      </div>
      
      <div v-if="post.content" class="post-content">
        <!-- Use our WordPress content component with title and featured image -->
        <WordPressContent 
          :content="post.content" 
          :title="post.title"
          :featuredImage="post.featuredImage?.node?.sourceUrl || ''"
          :debug="false" 
        />
      </div>
      <div v-else class="post-content-empty">
        <p>No content available for this post.</p>
      </div>
      
      <div v-if="post.tags?.nodes && post.tags.nodes.length" class="post-tags">
        <span class="tag-label">Tags:</span>
        <NuxtLink 
          v-for="tag in post.tags.nodes" 
          :key="tag.id"
          :to="`/blog?tag=${tag.slug}`" 
          class="tag"
        >
          {{ tag.name }}
        </NuxtLink>
      </div>
      
      <div class="post-navigation">
        <NuxtLink to="/blog" class="back-btn">
          <Icon icon="mdi:arrow-left" /> Back to Education
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.post-container {
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 1rem;
  
  .loading-state,
  .error-state {
    text-align: center;
    padding: 4rem 0;
    
    p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 1.5rem;
    }
    
    .retry-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.8rem 2rem;
      font-size: 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 1rem;
      
      &:hover {
        background: darken(#007bff, 10%);
      }
    }
    
    .back-btn {
      display: inline-block;
      margin-top: 1rem;
      color: #007bff;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .post-header {
    margin-bottom: 2rem;
    
    .meta {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      
      .categories {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      .category {
        display: inline-block;
        background: #007bff;
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 4px;
        font-size: 0.9rem;
        text-decoration: none;
        transition: background 0.2s;
        
        &:hover {
          background: darken(#007bff, 10%);
        }
      }
      
      .date {
        color: #666;
        font-size: 0.9rem;
      }
    }
    
    .post-title {
      font-size: 2.5rem;
      line-height: 1.2;
      margin-bottom: 1.5rem;
    }
    
    .featured-image {
      margin-bottom: 2rem;
      
      img {
        width: 100%;
        border-radius: 8px;
        object-fit: cover;
      }
    }
  }
  
  .post-content,
  .post-content-empty {
    line-height: 1.7;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    min-height: 200px; /* Ensure there's at least some space */
    color: #333;
  }
  
  .post-content-empty {
    padding: 2rem;
    background: rgba(0,0,0,0.05);
    border-radius: 8px;
    
    p {
      margin-bottom: 1rem;
    }
    
    details {
      margin-top: 1rem;
      
      summary {
        cursor: pointer;
        color: #007bff;
      }
      
      pre {
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(0,0,0,0.1);
        border-radius: 4px;
        overflow: auto;
        font-size: 0.8rem;
      }
    }
  }
  
  .post-content {
    color: #333; /* Ensure text is visible */
    // WordPress content styles have been moved to the WordPressContent component
  }
  
  .post-tags {
    margin-top: 3rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    
    .tag-label {
      font-weight: 500;
    }
    
    .tag {
      background: #f0f0f0;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.9rem;
      text-decoration: none;
      color: #333;
      transition: background 0.2s;
      
      &:hover {
        background: #e0e0e0;
      }
    }
  }
  
  .post-navigation {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
    
    .back-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: #007bff;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .post-container {
    margin: 2rem auto;
    
    .post-header {
      .post-title {
        font-size: 2rem;
      }
    }
  }
}
</style>