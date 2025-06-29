import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import axios from 'axios'
import { useRecipeStore } from '../../stores/recipe'
import { useAuthStore } from '../../stores/auth'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}))

// Direkter Zugriff auf die Mock-Funktionen
const mockAxiosGet = vi.mocked(axios.get)
const mockAxiosPost = vi.mocked(axios.post)
const mockAxiosPut = vi.mocked(axios.put)
const mockAxiosPatch = vi.mocked(axios.patch)
const mockAxiosDelete = vi.mocked(axios.delete)

const mockRecipes = [
  {
    id: '1',
    title: 'Mocked Recipe',
    description: 'This recipe comes from mocked axios',
    ingredients: ['Mocked Ingredient 1', 'Mocked Ingredient 2'],
    instructions: ['Mocked Step 1', 'Mocked Step 2'],
    prepTime: 15,
    cookTime: 25,
    servings: 3,
    userId: 'user1',
    isFavorite: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

describe('Recipe Store with Axios Mock', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    // Setup authenticated user
    const authStore = useAuthStore()
    authStore.user = {
      id: 'test-user',
      username: 'testuser',
      email: 'test@example.com'
    }
  })

  it('loads recipes successfully with axios mock', async () => {
    // Mock axios.get to return mock data
    mockAxiosGet.mockResolvedValueOnce({
      data: mockRecipes,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    })

    const recipeStore = useRecipeStore()
    await recipeStore.loadRecipes()

    expect(recipeStore.recipes).toEqual(mockRecipes)
    expect(recipeStore.isLoading).toBe(false)
    expect(recipeStore.error).toBe(null)
    expect(mockAxiosGet).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/recipes`
    )
  })

  it('creates a recipe successfully with axios mock', async () => {
    const newRecipe = {
      id: '2',
      title: 'New Mocked Recipe',
      description: 'Created with mocked axios',
      ingredients: ['New Ingredient'],
      instructions: ['New Step'],
      prepTime: 5,
      cookTime: 15,
      servings: 2,
      userId: 'test-user',
      isFavorite: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }

    mockAxiosPost.mockResolvedValueOnce({
      data: newRecipe,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {}
    })

    const recipeStore = useRecipeStore()
    const formData = {
      title: 'New Mocked Recipe',
      description: 'Created with mocked axios',
      ingredients: ['New Ingredient'],
      instructions: ['New Step'],
      prepTime: 5,
      cookTime: 15,
      servings: 2
    }

    const result = await recipeStore.createRecipe(formData)

    expect(result).toBeDefined()
    expect(result!.success).toBe(true)
    expect(result!.recipeId).toBe('2')
    expect(recipeStore.recipes).toContainEqual(newRecipe)
    expect(mockAxiosPost).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/recipes`,
      { ...formData, userId: 'test-user' }
    )
  })

  it('handles axios errors correctly', async () => {
    mockAxiosGet.mockRejectedValueOnce(new Error('Network Error'))

    const recipeStore = useRecipeStore()
    await recipeStore.loadRecipes()

    expect(recipeStore.error).toBe('Fehler beim Laden der Rezepte')
    expect(recipeStore.isLoading).toBe(false)
    expect(recipeStore.recipes).toEqual([])
  })

  it('toggles favorite status with axios mock', async () => {
    const recipeStore = useRecipeStore()

    // Setup initial recipe
    recipeStore.recipes = [mockRecipes[0]]

    const updatedRecipe = { ...mockRecipes[0], isFavorite: true }

    mockAxiosPatch.mockResolvedValueOnce({
      data: updatedRecipe,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    })

    // Mock user ownership
    recipeStore.recipes[0].userId = 'test-user'

    const result = await recipeStore.toggleFavorite('1')

    expect(result).toBeDefined()
    expect(result!.success).toBe(true)
    expect(recipeStore.recipes[0].isFavorite).toBe(true)
    expect(mockAxiosPatch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/recipes/1/favorite`,
      { isFavorite: true }
    )
  })

  it('updates recipe with axios mock', async () => {
    const recipeStore = useRecipeStore()

    // Setup initial recipe
    recipeStore.recipes = [mockRecipes[0]]

    const updatedData = {
      title: 'Updated Recipe Title',
      description: 'Updated description',
      ingredients: ['Updated Ingredient'],
      instructions: ['Updated Step'],
      prepTime: 20,
      cookTime: 30,
      servings: 4
    }

    const updatedRecipe = {
      ...mockRecipes[0],
      ...updatedData,
      userId: 'test-user',
      isFavorite: false
    }

    mockAxiosPut.mockResolvedValueOnce({
      data: updatedRecipe,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    })

    // Mock user ownership
    recipeStore.recipes[0].userId = 'test-user'

    const result = await recipeStore.updateRecipe('1', updatedData)

    expect(result).toBeDefined()
    expect(result!.success).toBe(true)
    expect(recipeStore.recipes[0].title).toBe('Updated Recipe Title')
    expect(mockAxiosPut).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/recipes/1`,
      {
        ...updatedData,
        userId: 'test-user',
        isFavorite: false
      }
    )
  })

  it('deletes recipe with axios mock', async () => {
    const recipeStore = useRecipeStore()

    // Setup initial recipe
    recipeStore.recipes = [mockRecipes[0]]

    mockAxiosDelete.mockResolvedValueOnce({
      data: {},
      status: 204,
      statusText: 'No Content',
      headers: {},
      config: {}
    })

    // Mock user ownership
    recipeStore.recipes[0].userId = 'test-user'

    const result = await recipeStore.deleteRecipe('1')

    expect(result).toBeDefined()
    expect(result!.success).toBe(true)
    expect(recipeStore.recipes).toHaveLength(0)
    expect(mockAxiosDelete).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/recipes/1`
    )
  })
})
