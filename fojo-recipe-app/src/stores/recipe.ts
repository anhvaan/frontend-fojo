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

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

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

  // Rezepte vom Backend laden
  async function loadRecipes() {
    isLoading.value = true
    error.value = null
    try {
      const res = await axios.get(`${baseUrl}/api/recipes`)
      recipes.value = res.data
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

  function toggleFavorite(id: string) {
    const recipe = recipes.value.find(r => r.id === id)
    if (recipe && recipe.userId === authStore.user?.id) {
      recipe.isFavorite = !recipe.isFavorite
    }
  }

  async function createRecipe(recipeData: RecipeFormData) {
    isLoading.value = true
    error.value = null
    try {
      if (!authStore.user) throw new Error('User not authenticated')

      const newRecipePayload = {
        ...recipeData,
        userId: authStore.user.id,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const res = await axios.post(`${baseUrl}/api/recipes`, newRecipePayload)
      recipes.value.push(res.data)
      return { success: true, recipeId: res.data.id }
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
      const recipe = recipes.value.find(r => r.id === id)
      if (!recipe) throw new Error('Rezept nicht gefunden')

      if (recipe.userId !== authStore.user?.id) {
        throw new Error('Nicht berechtigt zur Bearbeitung')
      }

      const updatedRecipe = {
        ...recipe,
        ...recipeData,
        updatedAt: new Date().toISOString(),
      }

      const res = await axios.put(`${baseUrl}/api/recipes/${id}`, updatedRecipe)

      const index = recipes.value.findIndex(r => r.id === id)
      if (index !== -1) recipes.value[index] = res.data

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
    recipes,
    userRecipes,
    favoriteRecipes,
    isLoading,
    error,
    loadRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
  }
})
