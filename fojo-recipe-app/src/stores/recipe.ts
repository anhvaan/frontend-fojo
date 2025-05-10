import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

export const useRecipeStore = defineStore('recipe', () => {
  // State
  const recipes = ref<Recipe[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  // Computed
  const userRecipes = computed(() => {
    return recipes.value.filter((recipe) => recipe.userId === authStore.user?.id)
  })

  const favoriteRecipes = computed(() => {
    return userRecipes.value.filter((recipe) => recipe.isFavorite)
  })

  // Initialize recipes from localStorage
  function initializeRecipes() {
    const savedRecipes = localStorage.getItem('fojo-recipes')
    if (savedRecipes) {
      try {
        recipes.value = JSON.parse(savedRecipes)
      } catch (e) {
        console.error('Failed to parse recipes from localStorage', e)
        localStorage.removeItem('fojo-recipes')
      }
    }
  }

  // Save recipes to localStorage
  function saveRecipes() {
    localStorage.setItem('fojo-recipes', JSON.stringify(recipes.value))
  }

  // Get recipe by ID
  function getRecipeById(id: string) {
    return recipes.value.find((recipe) => recipe.id === id)
  }

  // Toggle favorite status
  function toggleFavorite(id: string) {
    const recipe = recipes.value.find((r) => r.id === id)
    if (recipe && recipe.userId === authStore.user?.id) {
      recipe.isFavorite = !recipe.isFavorite
      saveRecipes()
    }
  }

  // Create recipe
  function createRecipe(recipeData: RecipeFormData) {
    isLoading.value = true
    error.value = null

    try {
      if (!authStore.user) {
        throw new Error('User not authenticated')
      }

      const newRecipe: Recipe = {
        id: Date.now().toString(),
        ...recipeData,
        userId: authStore.user.id,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      recipes.value.push(newRecipe)
      saveRecipes()

      return { success: true, recipeId: newRecipe.id }
    } catch (err) {
      console.error('Recipe creation error:', err)
      error.value = 'Failed to create recipe'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Update recipe
  function updateRecipe(id: string, recipeData: RecipeFormData) {
    isLoading.value = true
    error.value = null

    try {
      const index = recipes.value.findIndex((recipe) => recipe.id === id)

      if (index === -1) {
        throw new Error('Recipe not found')
      }

      const recipe = recipes.value[index]

      // Check ownership
      if (recipe.userId !== authStore.user?.id) {
        throw new Error('Not authorized to update this recipe')
      }

      // Update recipe
      recipes.value[index] = {
        ...recipe,
        ...recipeData,
        updatedAt: new Date().toISOString(),
      }

      saveRecipes()

      return { success: true }
    } catch (err) {
      console.error('Recipe update error:', err)
      error.value = err instanceof Error ? err.message : 'Failed to update recipe'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Delete recipe
  function deleteRecipe(id: string) {
    isLoading.value = true
    error.value = null

    try {
      const recipe = recipes.value.find((recipe) => recipe.id === id)

      if (!recipe) {
        throw new Error('Recipe not found')
      }

      // Check ownership
      if (recipe.userId !== authStore.user?.id) {
        throw new Error('Not authorized to delete this recipe')
      }

      // Delete recipe
      recipes.value = recipes.value.filter((recipe) => recipe.id !== id)
      saveRecipes()

      return { success: true }
    } catch (err) {
      console.error('Recipe deletion error:', err)
      error.value = err instanceof Error ? err.message : 'Failed to delete recipe'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Initialize store
  initializeRecipes()

  return {
    recipes,
    userRecipes,
    favoriteRecipes,
    isLoading,
    error,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
  }
})
