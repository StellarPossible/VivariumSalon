<template>
  <div class="debug-container">
    <h2>WordPress API Debug</h2>
    
    <div class="action-buttons">
      <button @click="testConnection" :disabled="loading">
        Test Connection
      </button>
      <button @click="fetchPosts" :disabled="loading">
        Fetch Posts
      </button>
      <button @click="fetchCategories" :disabled="loading">
        Fetch Categories
      </button>
      <button @click="fetchPostContent" :disabled="loading || !firstPostSlug">
        Test Post Content
      </button>
    </div>
    
    <div v-if="firstPostSlug" class="post-slug-info">
      <p>First Post Slug: <strong>{{ firstPostSlug }}</strong></p>
    </div>
    
    <div v-if="loading" class="loading">
      Loading...
    </div>
    
    <div v-else-if="error" class="error">
      <h3>Error:</h3>
      <pre>{{ error }}</pre>
    </div>
    
    <div v-else-if="result" class="result">
      <h3>Result:</h3>
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false);
const error = ref<string | null>(null);
const result = ref<any | null>(null);
const firstPostSlug = ref<string | null>(null);

// Test the WordPress connection
const testConnection = async () => {
  loading.value = true;
  error.value = null;
  result.value = null;
  
  try {
    const config = useRuntimeConfig();
    // Simple check to see if we can access WordPress
    const response = await $fetch('/api/test-wp', {
      method: 'GET'
    });
    
    result.value = response;
  } catch (err: any) {
    console.error('Connection test error:', err);
    error.value = err.message || 'Connection failed';
  } finally {
    loading.value = false;
  }
};

// Fetch posts
const fetchPosts = async () => {
  loading.value = true;
  error.value = null;
  result.value = null;
  firstPostSlug.value = null;
  
  try {
    const response = await $fetch('/api/posts', {
      method: 'GET',
      params: {
        perPage: 3
      }
    }) as any;
    
    result.value = response;
    
    // Store the first post slug for content testing
    if (response.posts && Array.isArray(response.posts) && response.posts.length > 0) {
      firstPostSlug.value = response.posts[0].slug;
    }
  } catch (err: any) {
    console.error('Posts fetch error:', err);
    error.value = err.message || 'Failed to fetch posts';
  } finally {
    loading.value = false;
  }
};

// Fetch single post content
const fetchPostContent = async () => {
  if (!firstPostSlug.value) {
    error.value = 'No post slug available. Fetch posts first.';
    return;
  }
  
  loading.value = true;
  error.value = null;
  result.value = null;
  
  try {
    // Fetch post by slug
    const response = await $fetch(`/api/posts/${firstPostSlug.value}`);
    
    // Add content length info for easier debugging
    result.value = {
      ...response,
      _contentLength: response.content ? response.content.length : 0,
      _contentPreview: response.content ? response.content.substring(0, 100) + '...' : null
    };
  } catch (err: any) {
    console.error('Post content fetch error:', err);
    error.value = err.message || `Failed to fetch post content for slug: ${firstPostSlug.value}`;
  } finally {
    loading.value = false;
  }
};

// Fetch categories
const fetchCategories = async () => {
  loading.value = true;
  error.value = null;
  result.value = null;
  
  try {
    const response = await $fetch('/api/categories', {
      method: 'GET'
    });
    
    result.value = response;
  } catch (err: any) {
    console.error('Categories fetch error:', err);
    error.value = err.message || 'Failed to fetch categories';
  } finally {
    loading.value = false;
  }
};

// Initialize with a connection test
onMounted(() => {
  testConnection();
});
</script>

<style scoped lang="scss">
.debug-container {
  padding: 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-bottom: 2rem;
  
  h2 {
    margin-bottom: 1.5rem;
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    button {
      background: #0066cc;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      &:hover:not(:disabled) {
        background: #0055aa;
      }
    }
  }
  
  .loading, .error, .result {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  .error {
    color: #ff6666;
  }
  
  pre {
    white-space: pre-wrap;
    word-break: break-all;
    font-size: 0.9rem;
    max-height: 400px;
    overflow: auto;
  }
}
</style>