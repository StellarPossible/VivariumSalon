<template>
    <section class="contact-page">
      <h1>Contact Us</h1>
      <p>Have a project or a question? We'd love to hear from you.</p>
  
      <form @submit.prevent="submitForm">
        <input v-model="name" type="text" placeholder="Your Name" required />
        <input v-model="email" type="email" placeholder="Your Email" required />
        <textarea v-model="message" placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
  
      <p v-if="success" class="success">✅ Message sent!</p>
    </section>
  </template>
  
  <script setup lang="ts">
  const name = ref('')
  const email = ref('')
  const message = ref('')
  const success = ref(false)
  
  function submitForm() {
    // TODO: Connect to a backend/email service (Netlify Forms, WP REST API, etc.)
    console.log('Form submitted:', { name: name.value, email: email.value, message: message.value })
    success.value = true
  
    // Clear form
    name.value = ''
    email.value = ''
    message.value = ''
  }
  </script>
  
  <style scoped lang="scss">
  .contact-page {
    max-width: 600px;
    margin: 5rem auto;
    padding: 2rem;
    text-align: center;
  
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
  
    p {
      margin-bottom: 2rem;
      color: #555;
    }
  
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
  
      input,
      textarea {
        padding: 0.75rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
  
      textarea {
        resize: vertical;
        min-height: 120px;
      }
  
      button {
        background: var(--primary, #007bff);
        color: white;
        font-weight: bold;
        border: none;
        padding: 0.75rem;
        border-radius: 6px;
        cursor: pointer;
  
        &:hover {
          background: darken(#007bff, 8%);
        }
      }
    }
  
    .success {
      margin-top: 1rem;
      color: #3c763d;
      font-weight: bold;
    }
  }
  </style>
  