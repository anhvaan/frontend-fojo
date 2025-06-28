<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const recipeStore = useRecipeStore()
const authStore = useAuthStore()

// String beibehalten für Store, aber konvertieren für Vergleiche
const recipeId = computed(() => route.params.id as string)

const isLoading = ref(true)
const error = ref<string | null>(null)

const recipe = computed(() => {
  console.log('Original Recipe ID from URL:', recipeId.value, typeof recipeId.value)

  // Debugging: Store state checken
  if (recipeStore.recipes && recipeStore.recipes.length > 0) {
    console.log('First recipe ID in store:', recipeStore.recipes[0].id, typeof recipeStore.recipes[0].id)
  }

  const foundRecipe = recipeStore.getRecipeById(recipeId.value)
  console.log('Found recipe:', foundRecipe ? 'YES' : 'NO')
  return foundRecipe
})

const isOwner = computed(() => {
  if (!recipe.value || !authStore.user) return false
  return recipe.value.userId === authStore.user.id
})

const totalTime = computed(() => {
  if (!recipe.value) return 0
  return recipe.value.prepTime + recipe.value.cookTime
})

const imageUrl = computed(() => {
  if (!recipe.value) return ''
  return (
    recipe.value.imageUrl ||
    'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800'
  )
})

const confirmDelete = () => {
  if (confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
    deleteRecipe()
  }
}

const deleteRecipe = async () => {
  const result = await recipeStore.deleteRecipe(recipeId.value)

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error || 'Failed to delete recipe'
  }
}

const editRecipe = () => {
  router.push(`/recipes/${recipeId.value}/edit`)
}

onMounted(() => {
  console.log('Component mounted, checking recipe...')

  // Debugging: Store state checken
  console.log('All recipes in store:', recipeStore.recipes?.length || 0)
  if (recipeStore.recipes && recipeStore.recipes.length > 0) {
    console.log('First recipe ID type:', typeof recipeStore.recipes[0].id)
    console.log('All recipe IDs:', recipeStore.recipes.map(r => `${r.id} (${typeof r.id})`))
  }

  if (!recipe.value) {
    console.log('Recipe not found, redirecting to home')
    router.push('/')
  } else {
    console.log('Recipe found successfully')
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

  <div v-else-if="recipe" class="recipe-detail">
    <div class="recipe-header">
      <div class="recipe-image">
        <img :src="imageUrl" :alt="recipe.title" />
      </div>
      <div class="recipe-header-content">
        <h1>{{ recipe.title }}</h1>
        <p class="recipe-description">{{ recipe.description }}</p>

        <div class="recipe-meta">
          <div class="recipe-meta-item">
            <span class="meta-label">Prep Time</span>
            <span class="meta-value">{{ recipe.prepTime }} min</span>
          </div>
          <div class="recipe-meta-item">
            <span class="meta-label">Cook Time</span>
            <span class="meta-value">{{ recipe.cookTime }} min</span>
          </div>
          <div class="recipe-meta-item">
            <span class="meta-label">Total Time</span>
            <span class="meta-value">{{ totalTime }} min</span>
          </div>
          <div class="recipe-meta-item">
            <span class="meta-label">Servings</span>
            <span class="meta-value">{{ recipe.servings }}</span>
          </div>
        </div>

        <div v-if="isOwner" class="recipe-actions">
          <button @click="editRecipe" class="btn btn-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Recipe
          </button>
          <button @click="confirmDelete" class="btn btn-danger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              ></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <div class="recipe-content">
      <div class="recipe-section ingredients-section">
        <h2>Ingredients</h2>
        <ul class="ingredients-list">
          <li v-for="(ingredient, index) in recipe.ingredients" :key="`ingredient-${index}`">
            {{ ingredient }}
          </li>
        </ul>
      </div>

      <div class="recipe-section instructions-section">
        <h2>Instructions</h2>
        <ol class="instructions-list">
          <li v-for="(instruction, index) in recipe.instructions" :key="`instruction-${index}`">
            {{ instruction }}
          </li>
        </ol>
      </div>
    </div>

    <div class="back-link mt-4">
      <router-link to="/" class="btn btn-outline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Recipes
      </router-link>
    </div>
  </div>
</template>

<style scoped>
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

.recipe-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  background-color: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.recipe-image {
  height: 100%;
  min-height: 400px;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-header-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.recipe-description {
  color: var(--color-text-light);
  margin-bottom: 2rem;
  font-size: 1.1rem;
  flex-grow: 1;
}

.recipe-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.recipe-meta-item {
  background-color: rgba(0, 0, 0, 0.03);
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.meta-label {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.meta-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.recipe-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.recipe-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.recipe-section {
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recipe-section h2 {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-accent);
  color: var(--color-text);
}

.ingredients-list,
.instructions-list {
  padding-left: 1.5rem;
}

.ingredients-list li,
.instructions-list li {
  margin-bottom: 1rem;
  position: relative;
}

.ingredients-list li::marker {
  color: var(--color-primary);
}

.instructions-list li::marker {
  color: var(--color-primary);
  font-weight: 700;
}

.back-link {
  display: flex;
  justify-content: center;
}

.btn svg {
  margin-right: 0.5rem;
}

@media (max-width: 992px) {
  .recipe-header {
    grid-template-columns: 1fr;
  }

  .recipe-image {
    min-height: 300px;
  }

  .recipe-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .recipe-meta {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .recipe-actions {
    flex-direction: column;
  }

  .recipe-actions button {
    width: 100%;
  }
}
</style>
