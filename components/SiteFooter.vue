<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Vivarium Salon</h3>
          <p class="tagline">Your Premier Destination for Beauty and Wellness</p>
          <div class="social-links">
            <a 
              href="https://www.instagram.com/vivariumsalon" 
              target="_blank" 
              rel="noopener noreferrer"
              class="social-link instagram"
              aria-label="Follow us on Instagram @vivariumsalon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
        <div class="footer-section">
          <h4>Visit Us</h4>
          <address>
            <p>165 Defense Hwy</p>
            <p>Annapolis, MD 21401</p>
          </address>
          <a 
            href="https://maps.google.com/?q=165+Defense+Hwy,+Annapolis,+MD+21401" 
            target="_blank"
            rel="noopener noreferrer"
            class="directions-link"
          >
            Get Directions →
          </a>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <p>
            <a href="mailto:booking@vivariumsalon.com">booking@vivariumsalon.com</a>
          </p>
          <p>
            <a href="tel:443-717-3313">443-717-3313</a>
          </p>
          <p>
            <a 
              href="https://vivarium.glossgenius.com" 
              target="_blank"
              rel="noopener noreferrer"
              class="book-link"
            >
              Book Online
            </a>
          </p>
        </div>
        <div class="footer-section footer-links">
          <h4>Explore</h4>
          <ul>
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/our-team">Our Team</NuxtLink></li>
            <li><NuxtLink to="/shop">Shop</NuxtLink></li>
            <li><NuxtLink to="/about">About</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} Vivarium Salon. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '@/assets/scss/variables.scss' as *;

.site-footer {
  background: linear-gradient(180deg, rgba($black, 0.9) 0%, rgba($black, 0.98) 100%);
  backdrop-filter: blur(20px);
  color: $white;
  padding: $spacing-xl 0 $spacing-lg;
  margin-top: auto;
  border-top: 1px solid rgba($accent-color, 0.3);
  position: relative;
  z-index: 10;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-lg;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $spacing-xl * 1.5;
    margin-bottom: $spacing-xl;
  }

  .footer-section {
    h3 {
      font-size: 1.8rem;
      margin-bottom: $spacing-sm;
      background: linear-gradient(135deg, $white 0%, $accent-color 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    h4 {
      margin-bottom: 0;
      font-size: 1.2rem;
      font-weight: 600;
    }

    p {
      opacity: 0.9;
      margin-bottom: 0;
      line-height: 1.4;
    }

    .tagline {
      font-family: 'Charm', cursive;
    }

    address {
      font-style: normal;
      
      p {
        margin-bottom: 0;
      }
    }

    a {
      color: rgba($white, 0.9);
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-block;

      &:hover {
        color: $white;
        transform: translateX(2px);
      }
    }

    .directions-link,
    .book-link {
      color: $accent-gold;
      font-weight: 600;
      margin-top: $spacing-sm;
      display: inline-block;

      &:hover {
        color: $accent-color;
      }
    }
  }

  .footer-links {
    ul {
      list-style: none;
      padding: 0;
      margin: $spacing-sm 0 0;
      display: grid;
    }

    li a {
      letter-spacing: 0.08rem;
      text-transform: uppercase;
      font-size: 0.85rem;
    }
  }

  .social-links {
    display: flex;
    gap: $spacing-md;
    margin-top: $spacing-lg;
  }

  .social-link {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba($white, 0.1);
    transition: all 0.3s ease;

    &.instagram:hover {
      background: linear-gradient(135deg, $accent-gold 0%, $accent-color 100%);
      transform: translateY(-3px);
    }
  }

  .footer-bottom {
    text-align: center;
    padding-top: $spacing-xl;
    border-top: 1px solid rgba($white, 0.1);

    p {
      opacity: 0.6;
      font-size: 0.9rem;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .site-footer {
    padding: $spacing-xl * 2 0 $spacing-xl;

    .footer-content {
      grid-template-columns: 1fr;
      gap: $spacing-xl;
    }
  }
}
</style>
