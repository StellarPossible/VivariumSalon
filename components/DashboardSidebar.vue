<template>
  <aside class="dashboard-sidebar">
    <div class="user-profile">
      <img :src="avatarSrc" :alt="user?.name || user?.username || 'User'" />
      <h3>{{ user?.name || user?.username }}</h3>
      <p>{{ user?.email }}</p>
    </div>
    
    <nav class="dashboard-nav">
      <NuxtLink to="/dashboard" class="nav-item" exact-active-class="active">
        <Icon icon="mdi:view-dashboard" />
        <span>Overview</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/profile" class="nav-item" active-class="active">
        <Icon icon="mdi:account" />
        <span>Profile</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/settings" class="nav-item" active-class="active">
        <Icon icon="mdi:cog" />
        <span>Settings</span>
      </NuxtLink>
      <div v-if="isAdmin" class="admin-section">
        <h4>Admin</h4>
        <NuxtLink to="/dashboard/users" class="nav-item" active-class="active">
          <Icon icon="mdi:account-group" />
          <span>Users</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/content" class="nav-item" active-class="active">
          <Icon icon="mdi:file-document" />
          <span>Content</span>
        </NuxtLink>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { User } from '~/types/auth'
const user = useState<User | null>('auth.user')
const isAdmin = computed(() => user.value?.roles?.includes('administrator'))
const avatarSrc = computed(() => user.value?.avatar || '/default-avatar.png')
</script>

<style scoped lang="scss">
.user-profile {
  display: grid;
  gap: 0.5rem;
  text-align: center;
  margin-bottom: 2rem;

  img {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 0.5rem;
    border: 2px solid #e9ecef;
  }

  h3 {
    margin: 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    color: #6c757d;
    font-size: 0.9rem;
  }
}

.dashboard-nav {
  display: grid;
  gap: 0.25rem;

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    color: #212529;
    text-decoration: none;

    &.active, &:hover {
      background: #f1f3f5;
    }

    :deep(svg) {
      width: 20px;
      height: 20px;
    }
  }

  .admin-section {
    margin-top: 1rem;
    border-top: 1px solid #e9ecef;
    padding-top: 1rem;

    h4 {
      margin: 0 0 0.5rem;
      font-size: 0.9rem;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
  }
}
</style>
