<template>
  <div class="debug-panel">
    <button @click="toggleDebug" class="debug-toggle">
      🔍 Test Shopify Connection
    </button>
    
    <div v-if="showDebug" class="debug-content">
      <h3>Shopify API Connection Test</h3>
      
      <button @click="runTest" :disabled="testing" class="test-button">
        {{ testing ? 'Testing...' : 'Run Test' }}
      </button>

      <div
        v-if="testResult"
        class="test-result"
        :class="testResult.success ? 'success' : 'error'"
      >
        <h4>{{ testResult.success ? '✅ Success' : '❌ Failed' }}</h4>
        <p><strong>Message:</strong> {{ testResult.message }}</p>
        
        <div class="details">
          <h5>Configuration Check:</h5>
          <ul>
            <li>Store Domain: {{ testResult.checks?.storeDomain }}</li>
            <li>API Version: {{ testResult.checks?.apiVersion }}</li>
            <li>Has Token: {{ testResult.checks?.hasAccessToken ? 'Yes' : 'No' }}</li>
            <li v-if="testResult.checks?.tokenPreview">
              Token Preview: {{ testResult.checks.tokenPreview }}
            </li>
          </ul>

          <div v-if="testResult.shopInfo">
            <h5>Shop Information:</h5>
            <ul>
              <li>Name: {{ testResult.shopInfo.name }}</li>
              <li>URL: {{ testResult.shopInfo.primaryDomain?.url }}</li>
              <li>Description: {{ testResult.shopInfo.description || 'None' }}</li>
            </ul>
          </div>

          <div v-if="testResult.error" class="error-details">
            <h5>Error Details:</h5>
            <pre>{{ JSON.stringify(testResult.error, null, 2) }}</pre>
          </div>

          <div v-if="testResult.errors" class="error-details">
            <h5>GraphQL Errors:</h5>
            <pre>{{ JSON.stringify(testResult.errors, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const showDebug = ref(false)
const testing = ref(false)
const testResult = ref<any>(null)

const toggleDebug = () => {
  showDebug.value = !showDebug.value
}

const runTest = async () => {
  testing.value = true
  testResult.value = null

  try {
    const response = await $fetch('/api/shopify/test')
    testResult.value = response
  } catch (error: any) {
    testResult.value = {
      success: false,
      message: 'Failed to reach test endpoint',
      error: error.message,
    }
  } finally {
    testing.value = false
  }
}
</script>

<style scoped lang="scss">
.debug-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.debug-toggle {
  padding: 12px 20px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #4f46e5;
  }
}

.debug-content {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 500px;
  max-height: 600px;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 20px;
  color: #1f2937;

  h3 {
    margin: 0 0 15px 0;
    color: #111827;
  }

  h4 {
    margin: 15px 0 10px 0;
  }

  h5 {
    margin: 10px 0 5px 0;
    font-size: 14px;
    color: #4b5563;
  }
}

.test-button {
  width: 100%;
  padding: 10px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 15px;

  &:hover:not(:disabled) {
    background: #059669;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
}

.test-result {
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;

  &.success {
    background: #d1fae5;
    border: 2px solid #10b981;
  }

  &.error {
    background: #fee2e2;
    border: 2px solid #ef4444;
  }

  p {
    margin: 5px 0;
  }

  ul {
    margin: 5px 0;
    padding-left: 20px;
    
    li {
      margin: 3px 0;
      font-size: 13px;
    }
  }
}

.details {
  margin-top: 15px;
  font-size: 13px;
}

.error-details {
  margin-top: 10px;
  
  pre {
    background: #f3f4f6;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 11px;
    max-height: 200px;
    overflow-y: auto;
  }
}

@media (max-width: 768px) {
  .debug-content {
    width: calc(100vw - 40px);
    right: -20px;
  }
}
</style>
