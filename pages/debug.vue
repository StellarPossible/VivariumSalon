<template>
  <div class="debug-page">
    <h1>WordPress Debug Page</h1>
    <p>Use this page to verify WordPress connectivity and data retrieval</p>
    
    <WordPressDebug />
    
    <h2>Test Individual APIs</h2>
    <div class="api-tests">
      <div class="test-section">
        <h3>Test GraphQL API</h3>
        <button @click="testGraphQL" :disabled="loading">
          Test GraphQL
        </button>
        
        <div v-if="graphqlLoading">Testing GraphQL...</div>
        <div v-else-if="graphqlError" class="error">
          <h4>Error:</h4>
          <pre>{{ graphqlError }}</pre>
        </div>
        <div v-else-if="graphqlResult" class="result">
          <h4>Result:</h4>
          <pre>{{ JSON.stringify(graphqlResult, null, 2) }}</pre>
        </div>
      </div>
      
      <div class="test-section">
        <h3>Test Posts API</h3>
        <button @click="testPosts" :disabled="loading">
          Test Posts API
        </button>
        
        <div v-if="postsLoading">Testing Posts API...</div>
        <div v-else-if="postsError" class="error">
          <h4>Error:</h4>
          <pre>{{ postsError }}</pre>
        </div>
        <div v-else-if="postsResult" class="result">
          <h4>Result:</h4>
          <pre>{{ JSON.stringify(postsResult, null, 2) }}</pre>
        </div>
      </div>
      
      <div class="test-section">
        <h3>Test Education API</h3>
        <button @click="testEducation" :disabled="loading">
          Test Education API
        </button>
        
        <div v-if="educationLoading">Testing Education API...</div>
        <div v-else-if="educationError" class="error">
          <h4>Error:</h4>
          <pre>{{ educationError }}</pre>
        </div>
        <div v-else-if="educationResult" class="result">
          <h4>Result:</h4>
          <pre>{{ JSON.stringify(educationResult, null, 2) }}</pre>
        </div>
      </div>
    </div>
    
    <div class="environment-info">
      <h2>Environment Information</h2>
      <pre>{{ JSON.stringify({
        baseURL: config.baseURL,
        wpGraphqlEndpoint: config.public.wpGraphqlEndpoint,
        wpRestEndpoint: config.public.wpRestEndpoint,
        wpUser: config.public.wpUser ? '✓ Set' : '✗ Not Set',
        wpAppPassword: wpAppPassword ? '✓ Set' : '✗ Not Set',
      }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
// State for different API tests
const graphqlLoading = ref(false);
const graphqlError = ref<string | null>(null);
const graphqlResult = ref<any | null>(null);

const postsLoading = ref(false);
const postsError = ref<string | null>(null);
const postsResult = ref<any | null>(null);

const educationLoading = ref(false);
const educationError = ref<string | null>(null);
const educationResult = ref<any | null>(null);

// Combined loading state
const loading = computed(() => 
  graphqlLoading.value || postsLoading.value || educationLoading.value
);

// Get runtime config
const config = useRuntimeConfig();
// We can't access the private config directly, but we can check if it exists
const wpAppPassword = computed(() => {
  // We can only check if it's truthy, not its actual value on the client
  return !!process.client ? false : !!config.wpAppPassword;
});

// Test GraphQL API
const testGraphQL = async () => {
  graphqlLoading.value = true;
  graphqlError.value = null;
  graphqlResult.value = null;
  
  try {
    // Using our server proxy to avoid CORS issues
    const response = await $fetch('/api/graphql', {
      method: 'POST',
      body: {
        query: `
          query TestQuery {
            posts(first: 2) {
              nodes {
                id
                title
                date
              }
            }
          }
        `
      }
    });
    
    graphqlResult.value = response;
  } catch (err: any) {
    console.error('GraphQL test error:', err);
    graphqlError.value = err.message || 'GraphQL request failed';
  } finally {
    graphqlLoading.value = false;
  }
};

// Test Posts API
const testPosts = async () => {
  postsLoading.value = true;
  postsError.value = null;
  postsResult.value = null;
  
  try {
    const response = await $fetch('/api/posts', {
      params: {
        perPage: 2
      }
    });
    
    postsResult.value = response;
  } catch (err: any) {
    console.error('Posts API test error:', err);
    postsError.value = err.message || 'Posts API request failed';
  } finally {
    postsLoading.value = false;
  }
};

// Test Education API
const testEducation = async () => {
  educationLoading.value = true;
  educationError.value = null;
  educationResult.value = null;
  
  try {
    const response = await $fetch('/api/education');
    educationResult.value = response;
  } catch (err: any) {
    console.error('Education API test error:', err);
    educationError.value = err.message || 'Education API request failed';
  } finally {
    educationLoading.value = false;
  }
};

// Set page title
useHead({
  title: 'WordPress Debug | StellarPossible'
});
</script>

<style scoped lang="scss">
.debug-page {
  padding: 2rem;
  color: #fff;
  
  h1, h2 {
    margin-bottom: 1.5rem;
  }
  
  h3, h4 {
    margin-bottom: 1rem;
  }
  
  .api-tests {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
    
    .test-section {
      background: rgba(0, 0, 0, 0.2);
      padding: 1.5rem;
      border-radius: 8px;
      
      button {
        background: #0066cc;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 1rem;
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        &:hover:not(:disabled) {
          background: #0055aa;
        }
      }
      
      .error {
        color: #ff6666;
      }
      
      pre {
        white-space: pre-wrap;
        word-break: break-all;
        font-size: 0.9rem;
        background: rgba(0, 0, 0, 0.2);
        padding: 1rem;
        border-radius: 4px;
        max-height: 300px;
        overflow: auto;
      }
    }
  }
  
  .environment-info {
    background: rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
    border-radius: 8px;
    
    pre {
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 0.9rem;
      background: rgba(0, 0, 0, 0.3);
      padding: 1rem;
      border-radius: 4px;
    }
  }
}
</style>