<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import type { RecipeFormData } from '../stores/recipe'
import RecipeForm from '../components/recipe/RecipeForm.vue'

const router = useRouter()
const route = useRoute()
const recipeStore = useRecipeStore()

const recipeId = computed(() => route.params.id as string)
const isLoading = ref(true)
const error = ref<string | null>(null)

const recipe = computed(() => {
  return recipeStore.getRecipeById(recipeId.value)
})

const initialFormData = computed<RecipeFormData | undefined>(() => {
  if (!recipe.value) return undefined

  return {
    title: recipe.value.title,
    description: recipe.value.description,
    ingredients: [...recipe.value.ingredients],
    instructions: [...recipe.value.instructions],
    prepTime: recipe.value.prepTime,
    cookTime: recipe.value.cookTime,
    servings: recipe.value.servings,
    imageUrl: recipe.value.imageUrl,
  }
})

const handleSubmit = async (formData: RecipeFormData) => {
  const result = await recipeStore.updateRecipe(recipeId.value, formData)

  if (result.success) {
    router.push(`/recipes/${recipeId.value}`)
  } else {
    error.value = result.error || 'Failed to update recipe'
  }
}

const handleCancel = () => {
  router.push(`/recipes/${recipeId.value}`)
}

onMounted(() => {
  if (!recipe.value) {
    router.push('/')
  } else {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading" class="loading">
    <p>Loading recipe...</p>
  </div>

  <div v-else-if="error" class="error">
    <p>{{ error }}</p>
    <button @click="router.push('/')" class="btn btn-primary mt-3">Back to Recipes</button>
  </div>

  <div v-else-if="recipe && initialFormData" class="recipe-edit-view">
    <div class="page-header mb-4">
      <h1>Edit Recipe</h1>
      <p class="page-description">Make changes to your recipe</p>
    </div>

    <RecipeForm
      :initial-data="initialFormData"
      :is-editing="true"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
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

.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: 1.2rem;
  color: var(--color-text-light);
}

.error {
  color: var(--color-error);
}
</style>
