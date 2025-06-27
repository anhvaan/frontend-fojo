import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'

export interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  imageUrl?: string
  userId: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface RecipeFormData {
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  imageUrl?: string
}

const baseUrl = 'http://localhost:8080'

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref<Recipe[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  const userRecipes = computed(() =>
    recipes.value.filter(recipe => recipe.userId === authStore.user?.id)
  )

  const favoriteRecipes = computed(() =>
    userRecipes.value.filter(recipe => recipe.isFavorite)
  )

  async function loadRecipes() {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.get(`${baseUrl}/api/recipes`)
      recipes.value = response.data
    } catch (err) {
      error.value = 'Fehler beim Laden der Rezepte'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  function getRecipeById(id: string) {
    return recipes.value.find(recipe => recipe.id === id)
  }

  async function toggleFavorite(id: string) {
    const recipe = recipes.value.find(r => r.id === id)
    if (!recipe || recipe.userId !== authStore.user?.id) return

    isLoading.value = true
    error.value = null

    try {
      // API-Call an Backend
      const response = await axios.patch(`${baseUrl}/api/recipes/${id}/favorite`, {
        isFavorite: !recipe.isFavorite
      })

      // Frontend aktualisieren mit Backend-Response
      const index = recipes.value.findIndex(r => r.id === id)
      if (index !== -1) {
        recipes.value[index] = response.data
      }

      return { success: true }
    } catch (err) {
      error.value = 'Fehler beim Aktualisieren der Favoriten'
      console.error(err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function createRecipe(recipeData: RecipeFormData) {
    isLoading.value = true
    error.value = null
    try {
      if (!authStore.user) throw new Error('User not authenticated')

      const payload = {
        ...recipeData,
        userId: authStore.user.id
      }

      const response = await axios.post(`${baseUrl}/api/recipes`, payload)

      const newRecipe: Recipe = response.data
      recipes.value.push(newRecipe)

      return { success: true, recipeId: newRecipe.id }
    } catch (err) {
      error.value = 'Fehler beim Erstellen des Rezepts'
      console.error(err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function updateRecipe(id: string, recipeData: RecipeFormData) {
    isLoading.value = true
    error.value = null
    try {
      const existing = recipes.value.find(r => r.id === id)
      if (!existing) throw new Error('Rezept nicht gefunden')
      if (existing.userId !== authStore.user?.id) {
        throw new Error('Nicht berechtigt zur Bearbeitung')
      }

      const payload = {
        ...recipeData,
        userId: existing.userId,
        isFavorite: existing.isFavorite
      }

      const response = await axios.put(`${baseUrl}/api/recipes/${id}`, payload)

      const index = recipes.value.findIndex(r => r.id === id)
      if (index !== -1) recipes.value[index] = response.data

      return { success: true }
    } catch (err) {
      error.value = 'Fehler beim Aktualisieren'
      console.error(err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function deleteRecipe(id: string) {
    isLoading.value = true
    error.value = null
    try {
      const recipe = recipes.value.find(r => r.id === id)
      if (!recipe) throw new Error('Rezept nicht gefunden')
      if (recipe.userId !== authStore.user?.id) {
        throw new Error('Nicht berechtigt zum Löschen')
      }

      await axios.delete(`${baseUrl}/api/recipes/${id}`)

      recipes.value = recipes.value.filter(r => r.id !== id)

      return { success: true }
    } catch (err) {
      error.value = 'Fehler beim Löschen des Rezepts'
      console.error(err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    recipes,
    userRecipes,
    favoriteRecipes,
    isLoading,
    error,

    // Actions
    loadRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
  }
})
