<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { LoginCredentials } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = reactive<LoginCredentials>({
  email: '',
  password: '',
})

const validationErrors = reactive({
  email: '',
  password: '',
})

const formError = ref('')
const isSubmitting = ref(false)

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  validationErrors.email = ''
  validationErrors.password = ''
  formError.value = ''

  // Validate email
  if (!loginForm.email.trim()) {
    validationErrors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
    validationErrors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Validate password
  if (!loginForm.password) {
    validationErrors.password = 'Password is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const response = await authStore.login(loginForm)

    if (response.success) {
      router.push('/')
    } else {
      formError.value = response.error || 'Login failed'
    }
  } catch (error) {
    formError.value = 'An unexpected error occurred'
    console.error('Login error:', error)
  } finally {
    isSubmitting.value = false
  }
}

// For demo purposes - prefill the demo account
const fillDemoAccount = () => {
  loginForm.email = 'demo@example.com'
  loginForm.password = 'password'
}
</script>

<template>
  <div class="login-view">
    <div class="auth-container">
      <h1 class="text-center">Welcome to Fojo</h1>
      <p class="auth-subtitle text-center mb-4">Sign in to access your recipes</p>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="formError" class="form-error mb-3">
          {{ formError }}
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="loginForm.email"
            type="email"
            placeholder="your@email.com"
            :class="{ 'input-error': validationErrors.email }"
            autocomplete="email"
          />
          <div v-if="validationErrors.email" class="error-message">
            {{ validationErrors.email }}
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            :class="{ 'input-error': validationErrors.password }"
            autocomplete="current-password"
          />
          <div v-if="validationErrors.password" class="error-message">
            {{ validationErrors.password }}
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="isSubmitting">
          {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
        </button>

        <div class="auth-links">
          <p class="text-center mt-3">
            Don't have an account?
            <router-link to="/register">Sign up</router-link>
          </p>
        </div>

        <!-- Demo account helper - for demonstration purposes only -->
        <div class="demo-helper mt-3">
          <p class="text-center">
            <a href="#" @click.prevent="fillDemoAccount">Use demo account</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px); /* Adjust for header/footer */
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.auth-subtitle {
  color: var(--color-text-light);
}

.auth-form {
  margin-top: 1rem;
}

.form-error {
  background-color: rgba(230, 57, 70, 0.1);
  color: var(--color-error);
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.input-error {
  border-color: var(--color-error);
}

.auth-links {
  margin-top: 1.5rem;
}

.demo-helper {
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--color-text-light);
}
</style>
