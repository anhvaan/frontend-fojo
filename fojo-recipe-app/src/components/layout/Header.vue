<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const router = useRouter()
const authStore = useAuthStore()
const isMenuOpen = ref(false)

const isLoggedIn = computed(() => authStore.isLoggedIn)
const currentUser = computed(() => authStore.user)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const logout = async () => {
  authStore.logout()
  await router.push('/login')
  closeMenu()
}
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo" @click="closeMenu">
          <span class="logo-text">Fojo</span>
        </router-link>

        <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav class="nav-desktop" :class="{ active: isMenuOpen }">
          <template v-if="isLoggedIn">
            <router-link to="/" @click="closeMenu">Home</router-link>
            <router-link to="/profile" @click="closeMenu">Profile</router-link>
            <router-link to="/recipes/create" @click="closeMenu">New Recipe</router-link>
            <button class="btn-text" @click="logout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" @click="closeMenu">Login</router-link>
            <router-link to="/register" @click="closeMenu">Register</router-link>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--color-surface);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.nav-desktop {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-desktop a {
  color: var(--color-text);
  font-weight: 600;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition:
    color 0.2s,
    border-color 0.2s;
}

.nav-desktop a:hover,
.nav-desktop a.router-link-active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}

.btn-text {
  background: none;
  border: none;
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  font-size: 1rem;
  font-family: inherit;
  transition: color 0.2s;
}

.btn-text:hover {
  color: var(--color-primary);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.menu-toggle span {
  display: block;
  height: 3px;
  width: 100%;
  background-color: var(--color-text);
  border-radius: 3px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .nav-desktop {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--color-surface);
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
  }

  .nav-desktop.active {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
