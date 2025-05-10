<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import HeaderComponent from './components/layout/Header.vue'
import FooterComponent from './components/layout/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()

// Check local storage for user session on app mount
onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <div id="app">
    <HeaderComponent />
    <main class="container">
      <!-- Route transition with animation -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <FooterComponent />
  </div>
</template>

<style>
/* Route transition animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

main {
  flex: 1;
  padding: 2rem 0;
}
</style>
