<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="onClose" role="dialog" aria-modal="true" aria-labelledby="contact-title">
      <div class="modal">
        <header class="modal-header">
          <h2 id="contact-title">Contact Us</h2>
          <button class="icon-btn" aria-label="Close" @click="onClose">×</button>
        </header>

        <form class="modal-body" @submit.prevent="onSubmit" novalidate>
          <label>
            <span>Name</span>
            <input v-model.trim="form.name" type="text" required :disabled="submitting" />
          </label>
          <label>
            <span>Email</span>
            <input v-model.trim="form.email" type="email" required :disabled="submitting" />
          </label>
          <label>
            <span>Subject</span>
            <input v-model.trim="form.subject" type="text" :disabled="submitting" />
          </label>
          <label>
            <span>Message</span>
            <textarea v-model.trim="form.message" rows="5" required :disabled="submitting"></textarea>
          </label>

          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="success">Thanks! Your message has been sent.</p>

          <footer class="modal-footer">
            <button type="button" class="btn" @click="onClose" :disabled="submitting">Cancel</button>
            <button type="submit" class="btn primary" :disabled="submitting || !isValid">
              <span v-if="submitting">Sending…</span>
              <span v-else>Send</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  </Teleport>
  
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import type { User } from '~/types/auth'
const { isOpen, close } = useContactModal()
const user = useState<User | null>('auth.user')

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitting = ref(false)
const success = ref(false)
const error = ref('')

// Pre-fill from logged in user
watchEffect(() => {
  if (user.value && isOpen.value && !form.name && !form.email) {
    form.name = user.value.name || user.value.username
    form.email = user.value.email
  }
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isValid = computed(() => !!form.name && emailRegex.test(form.email) && !!form.message)

function onClose() {
  close()
  // Reset after close so we can show success next time
  setTimeout(() => {
    success.value = false
    error.value = ''
    submitting.value = false
  }, 150)
}

async function onSubmit() {
  error.value = ''
  success.value = false
  if (!isValid.value) {
    error.value = 'Please fill all required fields with a valid email.'
    return
  }
  submitting.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { ...form }
    })
    success.value = true
    // Optionally clear message/subject only
    form.subject = ''
    form.message = ''
    // Auto-close after a short delay
    setTimeout(() => onClose(), 1200)
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to send message. Please try again.'
  } finally {
    submitting.value = false
  }
}

// Close on Escape
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) onClose()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(2px);
  display: grid;
  place-items: center;
  z-index: 4000; // above header and footer
}
.modal {
  width: min(680px, 92vw);
  background: #0e0f1a;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.icon-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}
.modal-body {
  display: grid;
  gap: 0.75rem;
  padding: 1rem 1.25rem 1.25rem;
}
label { display: grid; gap: 0.35rem; }
input, textarea {
  background: rgba(255,255,255,0.06);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.btn {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
}
.btn.primary {
  background: #4f46e5;
  border-color: #4f46e5;
}
.error { color: #ff6b6b; }
.success { color: #2ecc71; }

@media (max-width: 520px) {
  .modal { width: 94vw; }
}
</style>
