<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRecipeStore } from '../stores/recipe'
import RecipeCard from '../components/recipe/RecipeCard.vue'

const authStore = useAuthStore()
const recipeStore = useRecipeStore()

const user = computed(() => authStore.user)
const recipes = computed(() => recipeStore.userRecipes)
const favoriteRecipes = computed(() => recipeStore.favoriteRecipes)

const recipeCount = computed(() => recipes.value.length)
const favoriteCount = computed(() => favoriteRecipes.value.length)
</script>

<template>
  <div class="profile-view">
    <div class="profile-header">
      <div class="profile-info">
        <h1>My Profile</h1>
        <div class="user-details">
          <p class="username">{{ user?.username }}</p>
          <p class="email">{{ user?.email }}</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ recipeCount }}</span>
          <span class="stat-label">Recipes Created</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ favoriteCount }}</span>
          <span class="stat-label">Favorite Recipes</span>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <section class="my-recipes">
        <h2>My Recipe Collection</h2>
        <div v-if="recipes.length > 0" class="recipe-grid">
          <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
        </div>
        <div v-else class="empty-state">
          <p>You haven't created any recipes yet.</p>
          <router-link to="/recipes/create" class="btn btn-primary"
            >Create Your First Recipe</router-link
          >
        </div>
      </section>

      <section v-if="favoriteRecipes.length > 0" class="favorite-recipes mt-4">
        <h2>My Favorites</h2>
        <div class="recipe-grid">
          <RecipeCard v-for="recipe in favoriteRecipes" :key="recipe.id" :recipe="recipe" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.profile-header {
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-info {
  margin-bottom: 2rem;
}

.profile-info h1 {
  margin-bottom: 1rem;
}

.user-details {
  color: var(--color-text-light);
}

.username {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.email {
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background-color: rgba(0, 0, 0, 0.03);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.profile-content {
  margin-top: 2rem;
}

.my-recipes h2,
.favorite-recipes h2 {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-accent);
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .profile-header {
    padding: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .recipe-grid {
    grid-template-columns: 1fr;
  }
}
</style>
