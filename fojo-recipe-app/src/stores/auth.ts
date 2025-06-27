import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  username: string
  email: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isLoggedIn = computed(() => !!user.value)

  // Mock user database with passwords (for demo purposes)
  const users = ref<Array<User & { password: string }>>([
    { id: '1', username: 'demo', email: 'demo@example.com', password: 'password' }
  ])

  // Initialize auth from localStorage
  function initializeAuth() {
    const savedUser = localStorage.getItem('fojo-user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        console.error('Failed to parse user from localStorage', e)
        localStorage.removeItem('fojo-user')
      }
    }
  }

  // Login function
  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null

    try {
      // Mock login
      await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate network delay

      // Find user by email and check password
      const foundUser = users.value.find((u) => u.email === credentials.email)

      if (foundUser && foundUser.password === credentials.password) {
        // Create user object without password for storage
        const userToStore: User = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email
        }

        user.value = userToStore
        localStorage.setItem('fojo-user', JSON.stringify(userToStore))
        return { success: true }
      }

      // Authentication failed
      error.value = 'Invalid email or password'
      return { success: false, error: error.value }
    } catch (err) {
      console.error('Login error:', err)
      error.value = 'An unexpected error occurred'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Register function
  async function register(data: RegisterData) {
    isLoading.value = true
    error.value = null

    try {
      // Mock registration
      await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate network delay

      // Check if email is already taken
      if (users.value.some((u) => u.email === data.email)) {
        error.value = 'Email is already taken'
        return { success: false, error: error.value }
      }

      // Create new user with password
      const newUserWithPassword = {
        id: (users.value.length + 1).toString(),
        username: data.username,
        email: data.email,
        password: data.password, // Store password for demo purposes
      }

      // Add to "database"
      users.value.push(newUserWithPassword)

      // Create user object without password for storage
      const newUser: User = {
        id: newUserWithPassword.id,
        username: newUserWithPassword.username,
        email: newUserWithPassword.email,
      }

      // Auto login
      user.value = newUser
      localStorage.setItem('fojo-user', JSON.stringify(newUser))

      return { success: true }
    } catch (err) {
      console.error('Registration error:', err)
      error.value = 'An unexpected error occurred'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  function logout() {
    user.value = null
    localStorage.removeItem('fojo-user')
  }

  return {
    user,
    isLoading,
    error,
    isLoggedIn,
    initializeAuth,
    login,
    register,
    logout,
  }
})
