<template>
  <h2>Rezept hinzufügen</h2>
  <form @submit.prevent="saveRecipe">
    <input v-model="title" placeholder="Titel" />
    <input v-model="description" placeholder="Beschreibung" />
    <input v-model="ingredients" placeholder="Zutaten" />
    <input v-model="instructions" placeholder="Anleitung" />
    <button type="submit">Speichern</button>
  </form>

  <h2>Alle Rezepte</h2>
  <ul>
    <li v-for="r in recipes" :key="r.id">
      <strong>{{ r.title }}</strong>: {{ r.description }}
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const title = ref('')
const description = ref('')
const ingredients = ref('')
const instructions = ref('')
const recipes = ref([])

const baseUrl = 'http://localhost:8080'

async function loadRecipes() {
  try {
    const res = await axios.get(`${baseUrl}/api/recipes`)
    recipes.value = res.data
  } catch (error) {
    console.error('Fehler beim Laden:', error)
  }
}

async function saveRecipe() {
  try {
    const newRecipe = {
      title: title.value,
      description: description.value,
      ingredients: ingredients.value,
      instructions: instructions.value
    }
    const res = await axios.post(`${baseUrl}/api/recipes`, newRecipe)
    recipes.value.push(res.data)
    title.value = description.value = ingredients.value = instructions.value = ''
  } catch (error) {
    console.error('Fehler beim Speichern:', error)
  }
}

onMounted(() => {
  loadRecipes()
})
</script>

<style scoped>
input {
  display: block;
  margin-bottom: 0.5rem;
}
</style>

