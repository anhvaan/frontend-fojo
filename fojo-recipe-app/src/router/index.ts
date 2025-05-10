import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import RecipeCreateView from '../views/RecipeCreateView.vue'
import RecipeDetailView from '../views/RecipeDetailView.vue'
import RecipeEditView from '../views/RecipeEditView.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/recipes/create',
    name: 'recipe-create',
    component: RecipeCreateView,
    meta: { requiresAuth: true }
  },
  {
    path: '/recipes/:id',
    name: 'recipe-detail',
    component: RecipeDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/recipes/:id/edit',
    name: 'recipe-edit',
    component: RecipeEditView,
    meta: { requiresAuth: true }
  }
]

// Navigation guard
export function setupNavigationGuards(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isLoggedIn = authStore.isLoggedIn

    // Route requires authentication
    if (to.meta.requiresAuth && !isLoggedIn) {
      return next({ name: 'login' })
    }

    // Route requires guest (non-authenticated) user
    if (to.meta.requiresGuest && isLoggedIn) {
      return next({ name: 'home' })
    }

    next()
  })
}

export default routes
