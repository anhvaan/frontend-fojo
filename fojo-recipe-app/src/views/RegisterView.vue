<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { RegisterData } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const registerForm = reactive<RegisterData>({
  username: '',
  email: '',
  password: '',
})

const confirmPassword = ref('')

const validationErrors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const formError = ref('')
const isSubmitting = ref(false)

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  validationErrors.username = ''
  validationErrors.email = ''
  validationErrors.password = ''
  validationErrors.confirmPassword = ''
  formError.value = ''

  // Validate username
  if (!registerForm.username.trim()) {
    validationErrors.username = 'Username is required'
    isValid = false
  } else if (registerForm.username.length < 3) {
    validationErrors.username = 'Username must be at least 3 characters'
    isValid = false
  }

  // Validate email
  if (!registerForm.email.trim()) {
    validationErrors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
    validationErrors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Validate password
  if (!registerForm.password) {
    validationErrors.password = 'Password is required'
    isValid = false
  } else if (registerForm.password.length < 6) {
    validationErrors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  // Validate confirm password
  if (registerForm.password !== confirmPassword.value) {
    validationErrors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const response = await authStore.register(registerForm)

    if (response.success) {
      router.push('/')
    } else {
      formError.value = response.error || 'Registration failed'
    }
  } catch (error) {
    formError.value = 'An unexpected error occurred'
    console.error('Registration error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="register-view">
    <div class="auth-container">
      <h1 class="text-center">Create an Account</h1>
      <p class="auth-subtitle text-center mb-4">Join Fojo and start saving your favorite recipes</p>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="formError" class="form-error mb-3">
          {{ formError }}
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="registerForm.username"
            type="text"
            placeholder="Your username"
            :class="{ 'input-error': validationErrors.username }"
            autocomplete="username"
          />
          <div v-if="validationErrors.username" class="error-message">
            {{ validationErrors.username }}
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="registerForm.email"
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
            v-model="registerForm.password"
            type="password"
            :class="{ 'input-error': validationErrors.password }"
            autocomplete="new-password"
          />
          <div v-if="validationErrors.password" class="error-message">
            {{ validationErrors.password }}
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            :class="{ 'input-error': validationErrors.confirmPassword }"
            autocomplete="new-password"
          />
          <div v-if="validationErrors.confirmPassword" class="error-message">
            {{ validationErrors.confirmPassword }}
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating account...' : 'Create account' }}
        </button>

        <div class="auth-links">
          <p class="text-center mt-3">
            Already have an account?
            <router-link to="/login">Sign in</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-view {
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
</style>
