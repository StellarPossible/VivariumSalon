<template>
  <div class="wp-test">
    <button @click="runTests" :disabled="loading" class="test-btn">
      {{ loading ? 'Running Tests...' : 'Test WordPress Connection' }}
    </button>
    
    <div v-if="results" class="test-results">
      <h3>WordPress API Test Results</h3>
      <p><strong>Endpoint:</strong> {{ results.endpoint }}</p>
      
      <div v-for="test in results.tests" :key="test.test" class="test-item">
        <div class="test-header" :class="test.status">
          <span class="status-icon">{{ test.status === 'success' ? '✅' : '❌' }}</span>
          <span class="test-name">{{ test.test }}</span>
        </div>
        
        <div v-if="test.data" class="test-data">
          <pre>{{ JSON.stringify(test.data, null, 2) }}</pre>
        </div>
        
        <div v-if="test.error" class="test-error">
          <p><strong>Error:</strong> {{ test.error.message }}</p>
          <p v-if="test.error.status"><strong>Status:</strong> {{ test.error.status }}</p>
          <p v-if="test.error.cause"><strong>Cause:</strong> {{ test.error.cause }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TestError {
  message: string
  status?: number
  statusCode?: number
  cause?: any
  authUser?: string
  passwordFormat?: string
  testedWith?: string
}

interface TestResult {
  test: string
  status: 'success' | 'failed'
  data?: any
  error?: TestError
}

interface TestResults {
  endpoint: string
  tests: TestResult[]
}

const loading = ref(false)
const results = ref<TestResults | null>(null)

async function runTests() {
  loading.value = true
  try {
    results.value = await $fetch<TestResults>('/api/test-wp')
  } catch (error) {
    console.error('Test failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.wp-test {
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.test-btn {
  background: #007cba;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.test-results {
  margin-top: 1rem;
}

.test-item {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
}

.test-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
}

.test-header.success {
  color: #28a745;
}

.test-header.failed {
  color: #dc3545;
}

.test-data {
  margin-top: 0.5rem;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
}

.test-data pre {
  margin: 0;
  font-size: 0.875rem;
}

.test-error {
  margin-top: 0.5rem;
  background: #fff5f5;
  padding: 0.5rem;
  border-radius: 4px;
  border-left: 4px solid #dc3545;
}
</style>