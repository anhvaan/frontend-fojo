import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './assets/style.css'
import App from './App.vue'
import routes, { setupNavigationGuards } from './router'

// Create pinia (store)
const pinia = createPinia()

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Setup navigation guards
setupNavigationGuards(router)

// Create and mount the app
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
