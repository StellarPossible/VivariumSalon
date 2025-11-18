<template>
  <section class="card">
    <h2>Profile</h2>
    <p>Manage your profile information.</p>
    <div v-if="user" class="form-grid">
      <label>
        <span>Name</span>
        <input v-model="form.name" type="text" />
      </label>
      <label>
        <span>Email</span>
        <input v-model="form.email" type="email" />
      </label>
      <label>
        <span>Description</span>
        <textarea v-model="form.description" rows="4" />
      </label>
      <div>
        <button class="primary" @click="save" :disabled="saving">Save</button>
      </div>
    </div>
    <p v-else>Loading...</p>
  </section>
</template>

<script setup lang="ts">
import type { User } from '~/types/auth'

definePageMeta({ middleware: 'auth' })

const user = useState<User | null>('auth.user')
const form = reactive({
  name: user.value?.name || '',
  email: user.value?.email || '',
  description: user.value?.description || ''
})
const saving = ref(false)

async function save() {
  saving.value = true
  try {
    // TODO: Wire to actual API (WordPress or custom)
    await new Promise(r => setTimeout(r, 600))
    if (user.value) {
      user.value = { ...user.value, name: form.name, email: form.email, description: form.description }
    }
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.card { background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 1rem; }
.form-grid { display: grid; gap: 0.75rem; max-width: 560px; }
label { display: grid; gap: 0.25rem; }
input, textarea { border: 1px solid #dee2e6; border-radius: 8px; padding: 0.5rem 0.75rem; font-size: 1rem; }
.primary { background: #4f46e5; color: #fff; border: none; border-radius: 8px; padding: 0.5rem 0.75rem; cursor: pointer; }
</style>
