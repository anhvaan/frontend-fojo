<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRecipeStore } from '../stores/recipe'
import RecipeCard from '../components/recipe/RecipeCard.vue'

const authStore = useAuthStore()
const recipeStore = useRecipeStore()

const username = computed(() => authStore.user?.username || 'Chef')
const recipes = computed(() => recipeStore.userRecipes)
const hasRecipes = computed(() => recipes.value.length > 0)

onMounted(() => {
  recipeStore.loadRecipes()
})
</script>

<template>
  <div class="home-view">
    <section class="welcome-section">
      <h1>Welcome back, {{ username }}!</h1>
      <p>Your personal recipe collection awaits. What will you cook today?</p>
      <div class="welcome-actions">
        <router-link to="/recipes/create" class="btn btn-primary">Create New Recipe</router-link>
      </div>
    </section>

    <section class="recipes-section">
      <h2 v-if="hasRecipes">Your Recipes</h2>
      <div v-if="hasRecipes" class="recipe-grid">
        <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
      </div>
      <div v-else class="empty-state">
        <div class="empty-message">
          <h2>No recipes yet</h2>
          <p>Your recipe collection is empty. Start by creating your first recipe!</p>
          <router-link to="/recipes/create" class="btn btn-primary mt-2"
            >Create First Recipe</router-link
          >
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.welcome-section {
  margin-bottom: 3rem;
}

.welcome-actions {
  margin-top: 1.5rem;
}

.recipes-section h2 {
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 0.5rem;
  display: inline-block;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
}

.empty-message {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
  border-radius: 8px;
  background-color: var(--color-surface);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }
}
</style>
