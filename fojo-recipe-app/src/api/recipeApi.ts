import axios from 'axios'
import type { Recipe, RecipeFormData } from '@/stores/recipe'

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

export async function fetchRecipes(): Promise<Recipe[]> {
  const response = await axios.get(`${baseUrl}/api/recipes`)
  return response.data
}

export async function postRecipe(data: RecipeFormData): Promise<Recipe> {
  const response = await axios.post(`${baseUrl}/api/recipes`, data)
  return response.data
}

export async function updateRecipe(id: string, data: RecipeFormData): Promise<Recipe> {
  const response = await axios.put(`${baseUrl}/api/recipes/${id}`, data)
  return response.data
}

export async function deleteRecipe(id: string): Promise<void> {
  await axios.delete(`${baseUrl}/api/recipes/${id}`)
}
