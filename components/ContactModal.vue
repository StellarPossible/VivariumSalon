<template>
  <div v-if="isOpen" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="close">×</button>
      <h2>Book Your Appointment</h2>
      
      <div class="contact-options">
        <a href="tel:443-717-3313" class="contact-option phone">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <div>
            <strong>Call Us</strong>
            <span>443-717-3313</span>
          </div>
        </a>
      </div>

      <div class="divider">
        <span>or</span>
      </div>
      
      <p class="form-intro">Fill out the form below and we'll get back to you shortly</p>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name *</label>
          <input id="name" v-model="form.name" type="text" required placeholder="Your full name" />
        </div>
        <div class="form-group">
          <label for="email">Email *</label>
          <input id="email" v-model="form.email" type="email" required placeholder="your@email.com" />
        </div>
        <div class="form-group">
          <label for="phone">Phone</label>
          <input id="phone" v-model="form.phone" type="tel" placeholder="(123) 456-7890" />
        </div>
        <div class="form-group">
          <label for="service">Preferred Service</label>
          <select id="service" v-model="form.service">
            <option value="">Select a service</option>
            <option value="haircut">Haircut</option>
            <option value="color">Color Services</option>
            <option value="styling">Styling</option>
            <option value="treatment">Hair Treatment</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label for="date">Preferred Date</label>
          <input id="date" v-model="form.date" type="date" />
        </div>
        <div class="form-group">
          <label for="message">Additional Notes</label>
          <textarea id="message" v-model="form.message" rows="4" placeholder="Any specific requests or questions?"></textarea>
        </div>
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Request Appointment</span>
          <span v-else>Sending...</span>
        </button>
        <p v-if="submitMessage" class="submit-message" :class="{ error: submitError }">
          {{ submitMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const isOpen = ref(false)
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitError = ref(false)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  service: '',
  date: '',
  message: ''
})

function open() {
  isOpen.value = true
  submitMessage.value = ''
  submitError.value = false
}

function close() {
  isOpen.value = false
}

async function handleSubmit() {
  isSubmitting.value = true
  submitMessage.value = ''
  submitError.value = false
  
  try {
    const response = await fetch('/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        to: 'booking@vivariumsalon.com'
      })
    })
    
    if (response.ok) {
      submitMessage.value = 'Thank you! Your appointment request has been received. We\'ll contact you soon.'
      submitError.value = false
      // Reset form
      Object.keys(form).forEach(key => form[key as keyof typeof form] = '')
      setTimeout(() => {
        close()
      }, 3000)
    } else {
      throw new Error('Failed to submit')
    }
  } catch (error) {
    submitMessage.value = 'Sorry, there was an error sending your request. Please call us at 443-717-3313.'
    submitError.value = true
  } finally {
    isSubmitting.value = false
  }
}

defineExpose({ open, close })
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: $spacing-lg;
  overflow-y: auto;
}

.modal-content {
  background: $background-color;
  padding: $spacing-xl * 2;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba($black, 0.5);

  h2 {
    margin-bottom: $spacing-lg;
    color: $text-color;
    font-size: 2rem;
    text-align: center;
  }

  .close-btn {
    position: absolute;
    top: $spacing-lg;
    right: $spacing-lg;
    background: rgba($secondary-color, 0.1);
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: $secondary-color;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background: rgba($secondary-color, 0.2);
      color: $text-color;
    }
  }

  .contact-options {
    margin-bottom: $spacing-xl;
  }

  .contact-option {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: linear-gradient(135deg, rgba($accent-gold, 0.15) 0%, rgba($accent-gold, 0.1) 100%);
    border: 2px solid rgba($accent-gold, 0.3);
    border-radius: 12px;
    text-decoration: none;
    color: $text-color;
    transition: all 0.3s ease;

    svg {
      width: 32px;
      height: 32px;
      color: $accent-gold;
      flex-shrink: 0;
    }

    div {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;

      strong {
        font-size: 1.1rem;
      }

      span {
        color: $secondary-color;
        font-size: 1.1rem;
      }
    }

    &:hover {
      background: linear-gradient(135deg, rgba($accent-gold, 0.25) 0%, rgba($accent-gold, 0.2) 100%);
      border-color: rgba($accent-gold, 0.5);
      transform: translateY(-2px);
    }
  }

  .divider {
    text-align: center;
    margin: $spacing-xl 0;
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: rgba($secondary-color, 0.3);
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }

    span {
      background: $background-color;
      padding: 0 $spacing-md;
      color: $secondary-color;
      font-weight: 500;
    }
  }

  .form-intro {
    text-align: center;
    color: $secondary-color;
    margin-bottom: $spacing-xl;
  }

  .form-group {
    margin-bottom: $spacing-lg;

    label {
      display: block;
      margin-bottom: $spacing-sm;
      font-weight: 600;
      color: $text-color;
    }

    input,
    textarea,
    select {
      width: 100%;
      padding: $spacing-md;
      border: 2px solid rgba($secondary-color, 0.3);
      border-radius: 8px;
      font-family: inherit;
      font-size: 1rem;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 3px rgba($primary-color, 0.15);
      }

      &::placeholder {
        color: rgba($secondary-color, 0.5);
      }
    }

    select {
      cursor: pointer;
    }
  }

  .submit-btn {
    width: 100%;
    background: linear-gradient(135deg, $accent-gold 0%, darken($accent-gold, 10%) 100%);
    color: $white;
    border: none;
    padding: $spacing-md $spacing-xl;
    border-radius: 50px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 700;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba($accent-gold, 0.4);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($accent-gold, 0.6);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .submit-message {
    margin-top: $spacing-md;
    padding: $spacing-md;
    border-radius: 8px;
    text-align: center;
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
    font-weight: 500;

    &.error {
      background: rgba(220, 53, 69, 0.1);
      color: #dc3545;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .modal-content {
    padding: $spacing-xl;
  }
}
</style>
