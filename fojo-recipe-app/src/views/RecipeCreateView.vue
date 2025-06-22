<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import type { RecipeFormData } from '../stores/recipe'
import RecipeForm from '../components/recipe/RecipeForm.vue'

const router = useRouter()
const recipeStore = useRecipeStore()

const handleSubmit = async (formData: RecipeFormData) => {
  const result = await recipeStore.createRecipe(formData)

  if (result.success) {
    router.push(`/recipes/${result.recipeId}`)
  } else {
    // Optional: Fehlerbehandlung
    console.error(result.error || 'Failed to create recipe')
  }
}

const handleCancel = () => {
  router.push('/')
}
</script>

<template>
  <div class="recipe-create-view">
    <div class="page-header mb-4">
      <h1>Create New Recipe</h1>
      <p class="page-description">Share your culinary masterpiece with the world</p>
    </div>

    <RecipeForm @submit="handleSubmit" @cancel="handleCancel" />
  </div>
</template>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-description {
  color: var(--color-text-light);
  max-width: 600px;
  margin: 0 auto;
}
</style>
