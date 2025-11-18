<template>
    <section class="client-highlight">
      <div class="container">
        <div class="highlight-card">
          <div class="logo">
            <NuxtImg
              src="https://personcenteredtech.com/wp-content/uploads/2018/03/pct-full_logo@2x-1.png"
              alt="Person Centered Tech logo"
              width="160"
              height="64"
            />
          </div>
  
          <div class="content">
            <h2>Person Centered Tech</h2>
            <p class="tagline">Ongoing partnership since 2021</p>
            <p>
              For over four years, we've proudly served as the lead technical partner for
              <strong>Person Centered Tech</strong>, a leader in HIPAA compliance education for mental health professionals. From full site architecture overhaul to custom dashboard tools and bulletproof security, our work has touched every pixel and packet.
            </p>
  
            <ul>
              <li>WordPress rehab & legacy plugin modernization</li>
              <li>DevOps, performance tuning, and CI/CD pipelines</li>
              <li>Full site hosting and uptime monitoring</li>
              <li>API development & integration with 3rd-party tools</li>
              <li>Secure email + newsletter system with Mailchimp</li>
              <li>Advanced site security & HIPAA-aligned data protection</li>
              <li>Ongoing UI/UX improvements and accessibility upgrades</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  // No logic needed for static content
  </script>
  
  <style scoped lang="scss">
  
  .client-highlight {
    padding:1rem;
  
    .container {
      max-width: 1100px;
      margin: 0 auto;
    }
  
    .highlight-card {
      background:  $primary;
      border-radius: 16px;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
      border: 2px solid ;
      overflow: hidden;
      max-width: 340px;
      margin: auto;
      transition: all 0.4s ease-in-out;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
  
      &:hover {
        max-width: 100%;
        flex-direction: row;
        padding: 2.5rem;
      }
    }
  
    .logo {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid #ddd;
    }
  
    .content {
      display: none;
      transition: opacity 0.3s ease-in-out;
  
      .highlight-card:hover & {
        display: block;
      }
  
      h2 {
        font-size: 2rem;
        margin-bottom: 0.25rem;
        color: $primary;
      }
  
      .tagline {
        font-style: italic;
        color: $secondary;
        margin-bottom: 1.25rem;
      }
  
      p {
        margin-bottom: 1.25rem;
        line-height: 1.7;
        color: $white;
      }
  
      ul {
        list-style: none;
        padding: 0;
  
        li {
          margin-bottom: 0.75rem;
          padding-left: 1.75rem;
          position: relative;
          font-size: 1rem;
  
          &::before {
            content: '✔';
            position: absolute;
            left: 0;
            color: $secondary;
            font-weight: bold;
          }
        }
      }
    }
  }
  </style>
  