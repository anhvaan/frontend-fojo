<script setup lang="ts">
import { computed } from 'vue'
import type { Recipe } from '@/stores/recipe.ts'
import { useRecipeStore } from '@/stores/recipe.ts'

const props = defineProps<{
  recipe: Recipe
}>()

const recipeStore = useRecipeStore()

const formattedDate = computed(() => {
  const date = new Date(props.recipe.updatedAt)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
})

const totalTime = computed(() => {
  return props.recipe.prepTime + props.recipe.cookTime
})

const imageUrl = computed(() => {
  return (
    props.recipe.imageUrl ||
    'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800'
  )
})

const isLoading = computed(() => recipeStore.isLoading)

// Fixed: async function mit proper event handling
const handleToggleFavorite = async (event: Event) => {
  event.stopPropagation()
  event.preventDefault()
  await recipeStore.toggleFavorite(props.recipe.id)
}
</script>

<template>
  <router-link :to="`/recipes/${recipe.id}`" class="recipe-card-link">
    <div class="recipe-card">
      <div class="recipe-image">
        <img :src="imageUrl" :alt="recipe.title" />
        <button
          class="favorite-button"
          :class="{ 'is-favorite': recipe.isFavorite }"
          @click.stop.prevent="handleToggleFavorite"
          :disabled="isLoading"
          :title="recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          ★
        </button>
      </div>
      <div class="recipe-content">
        <h3 class="recipe-title">{{ recipe.title }}</h3>
        <p class="recipe-description">{{ recipe.description }}</p>
        <div class="recipe-meta">
          <span class="recipe-time">
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
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ totalTime }} min
          </span>
          <span class="recipe-servings">
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            {{ recipe.servings }} servings
          </span>
        </div>
        <span class="recipe-date">Updated {{ formattedDate }}</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.recipe-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.recipe-card {
  background-color: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.recipe-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-card:hover .recipe-image img {
  transform: scale(1.05);
}

.favorite-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  color: #ccc;
  transition: all 0.2s ease;
  z-index: 10;
}

.favorite-button:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 1);
}

.favorite-button.is-favorite {
  color: var(--color-primary);
}

.favorite-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.recipe-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recipe-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.recipe-description {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.recipe-time,
.recipe-servings {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.recipe-date {
  font-size: 0.8rem;
  color: var(--color-text-light);
  font-style: italic;
}
</style>
