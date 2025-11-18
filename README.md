# Stellar Possible — Headless Nuxt 3 + TypeScript Frontend

This project is a fully headless, API-driven frontend for a **tech solutions website**, built using **Nuxt 3 with TypeScript**. It connects to a secure **WordPress + WPGraphQL** backend and renders content using authenticated GraphQL requests.

- ⚙️ Powered by [Nuxt 3](https://nuxt.com/) + [TypeScript](https://www.typescriptlang.org/)
- 🔐 Authenticated GraphQL via [Apollo Client](https://www.apollographql.com/docs/react/)
- 📸 Optimized image delivery with `@nuxt/image`
- 🎨 SCSS theming with modular variables and global styles
- 🧠 Dynamic content routing via WordPress slugs

---

## 🧱 Tech Stack

| Tech                | Role                                 |
|---------------------|--------------------------------------|
| Nuxt 3              | Application framework (SSR/SSG)      |
| TypeScript          | Type-safe development                |
| WordPress + WPGraphQL| CMS and content API                 |
| Apollo Client       | Secure GraphQL data fetching         |
| SCSS                | Custom styles and theming            |
| @nuxt/image   | Optimized, responsive images         |

---

## 🔐 Authentication

This frontend uses **Basic Auth via WP Application Passwords** to securely query the WordPress GraphQL API.

## 🚀 Deployment

This project uses GitHub Actions for automated deployment. The workflow is configured in `.github/workflows/release.yaml`.

### Manual Deployment
```bash
# Generate static site
npm run generate

# Build Docker image
docker build -t stellarpossible-nuxt .

# Run Docker container
docker run -p 3000:3000 stellarpossible-nuxt
```

### Automated Deployment

The GitHub Actions workflow automates the deployment process using Docker. It:

1. Builds a Docker image for the Nuxt application
2. Tests the container locally
3. Uploads the image to the production server
4. Deploys the application with proper environment variables

#### Required GitHub Secrets

For the automated deployment to work, you need to set up these GitHub repository secrets:

- `VPS_SERVER`: Hostname or IP of your server
- `VPS_USERNAME`: SSH username for server access
- `SSH_PRIVATE_KEY`: Your SSH private key
- `WP_APP_PASSWORD`: WordPress application password
- `JWT_SECRET`: (If using JWT authentication)
- `SLACK_WEBHOOK_URL`: (For deployment notifications)

See `.github/workflows/README.md` for detailed documentation on the deployment process.