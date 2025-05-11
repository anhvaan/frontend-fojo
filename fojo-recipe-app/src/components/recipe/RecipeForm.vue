<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import type { RecipeFormData } from '@/stores/recipe.ts'

const props = defineProps<{
  initialData?: RecipeFormData
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: RecipeFormData): void
  (e: 'cancel'): void
}>()

// Default form data
const defaultFormData: RecipeFormData = {
  title: '',
  description: '',
  ingredients: [''],
  instructions: [''],
  prepTime: 10,
  cookTime: 20,
  servings: 4,
  imageUrl: '',
}

// Initialize form data with either provided data or defaults
const formData = reactive<RecipeFormData>({
  ...defaultFormData,
  ...props.initialData,
})

// Form validation
const validationErrors = reactive({
  title: '',
  description: '',
  ingredients: [] as string[],
  instructions: [] as string[],
  prepTime: '',
  cookTime: '',
  servings: '',
  imageUrl: '',
})

const isSubmitting = ref(false)

// Handle adding and removing dynamic fields (ingredients and instructions)
const addIngredient = () => {
  formData.ingredients.push('')
}

const removeIngredient = (index: number) => {
  if (formData.ingredients.length > 1) {
    formData.ingredients.splice(index, 1)
  }
}

const addInstruction = () => {
  formData.instructions.push('')
}

const removeInstruction = (index: number) => {
  if (formData.instructions.length > 1) {
    formData.instructions.splice(index, 1)
  }
}

// Validate the form
const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  validationErrors.title = ''
  validationErrors.description = ''
  validationErrors.ingredients = []
  validationErrors.instructions = []
  validationErrors.prepTime = ''
  validationErrors.cookTime = ''
  validationErrors.servings = ''
  validationErrors.imageUrl = ''

  // Title validation
  if (!formData.title.trim()) {
    validationErrors.title = 'Recipe title is required'
    isValid = false
  }

  // Description validation
  if (!formData.description.trim()) {
    validationErrors.description = 'Recipe description is required'
    isValid = false
  }

  // Ingredients validation
  formData.ingredients.forEach((ingredient, index) => {
    if (!ingredient.trim()) {
      if (!validationErrors.ingredients[index]) {
        validationErrors.ingredients[index] = ''
      }
      validationErrors.ingredients[index] = 'Ingredient cannot be empty'
      isValid = false
    }
  })

  // Instructions validation
  formData.instructions.forEach((instruction, index) => {
    if (!instruction.trim()) {
      if (!validationErrors.instructions[index]) {
        validationErrors.instructions[index] = ''
      }
      validationErrors.instructions[index] = 'Instruction cannot be empty'
      isValid = false
    }
  })

  // Prep time validation
  if (formData.prepTime <= 0) {
    validationErrors.prepTime = 'Prep time must be greater than 0'
    isValid = false
  }

  // Cook time validation
  if (formData.cookTime <= 0) {
    validationErrors.cookTime = 'Cook time must be greater than 0'
    isValid = false
  }

  // Servings validation
  if (formData.servings <= 0) {
    validationErrors.servings = 'Servings must be greater than 0'
    isValid = false
  }

  // Image URL validation (optional field)
  if (formData.imageUrl && !/^https?:\/\/.+/.test(formData.imageUrl)) {
    validationErrors.imageUrl = 'Please enter a valid URL starting with http:// or https://'
    isValid = false
  }

  return isValid
}

// Handle form submission
const handleSubmit = () => {
  if (!validateForm()) return

  isSubmitting.value = true

  // Clean any empty values at the end of arrays
  const cleanedData = {
    ...formData,
    ingredients: formData.ingredients.filter((item) => item.trim() !== ''),
    instructions: formData.instructions.filter((item) => item.trim() !== ''),
  }

  emit('submit', cleanedData)
  isSubmitting.value = false
}

// Handle cancellation
const handleCancel = () => {
  emit('cancel')
}

// Computed for button text
const submitButtonText = computed(() => {
  if (isSubmitting.value) {
    return props.isEditing ? 'Saving...' : 'Creating...'
  }
  return props.isEditing ? 'Save Recipe' : 'Create Recipe'
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="recipe-form">
    <div class="form-section">
      <h3>Basic Information</h3>

      <div class="form-group">
        <label for="title">Recipe Title*</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          placeholder="e.g., Classic Spaghetti Carbonara"
          :class="{ 'input-error': validationErrors.title }"
        />
        <div v-if="validationErrors.title" class="error-message">
          {{ validationErrors.title }}
        </div>
      </div>

      <div class="form-group">
        <label for="description">Description*</label>
        <textarea
          id="description"
          v-model="formData.description"
          rows="3"
          placeholder="Briefly describe your recipe"
          :class="{ 'input-error': validationErrors.description }"
        ></textarea>
        <div v-if="validationErrors.description" class="error-message">
          {{ validationErrors.description }}
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="prepTime">Prep Time (minutes)*</label>
          <input
            id="prepTime"
            v-model.number="formData.prepTime"
            type="number"
            min="1"
            :class="{ 'input-error': validationErrors.prepTime }"
          />
          <div v-if="validationErrors.prepTime" class="error-message">
            {{ validationErrors.prepTime }}
          </div>
        </div>

        <div class="form-group">
          <label for="cookTime">Cook Time (minutes)*</label>
          <input
            id="cookTime"
            v-model.number="formData.cookTime"
            type="number"
            min="1"
            :class="{ 'input-error': validationErrors.cookTime }"
          />
          <div v-if="validationErrors.cookTime" class="error-message">
            {{ validationErrors.cookTime }}
          </div>
        </div>

        <div class="form-group">
          <label for="servings">Servings*</label>
          <input
            id="servings"
            v-model.number="formData.servings"
            type="number"
            min="1"
            :class="{ 'input-error': validationErrors.servings }"
          />
          <div v-if="validationErrors.servings" class="error-message">
            {{ validationErrors.servings }}
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="imageUrl">Image URL (optional)</label>
        <input
          id="imageUrl"
          v-model="formData.imageUrl"
          type="text"
          placeholder="https://example.com/image.jpg"
          :class="{ 'input-error': validationErrors.imageUrl }"
        />
        <div v-if="validationErrors.imageUrl" class="error-message">
          {{ validationErrors.imageUrl }}
        </div>
        <small class="form-hint">Enter a URL for an image of your completed recipe</small>
      </div>
    </div>

    <div class="form-section">
      <h3>Ingredients</h3>

      <div
        v-for="(ingredient, index) in formData.ingredients"
        :key="`ingredient-${index}`"
        class="dynamic-input-row"
      >
        <div class="form-group mb-2">
          <label :for="`ingredient-${index}`">Ingredient {{ index + 1 }}*</label>
          <div class="input-with-button">
            <input
              :id="`ingredient-${index}`"
              v-model="formData.ingredients[index]"
              type="text"
              placeholder="e.g., 2 tbsp olive oil"
              :class="{ 'input-error': validationErrors.ingredients[index] }"
            />
            <button
              v-if="formData.ingredients.length > 1"
              type="button"
              class="btn-icon"
              @click="removeIngredient(index)"
              aria-label="Remove ingredient"
            >
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div v-if="validationErrors.ingredients[index]" class="error-message">
            {{ validationErrors.ingredients[index] }}
          </div>
        </div>
      </div>

      <button type="button" class="btn btn-outline btn-sm mb-3" @click="addIngredient">
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
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Ingredient
      </button>
    </div>

    <div class="form-section">
      <h3>Instructions</h3>

      <div
        v-for="(instruction, index) in formData.instructions"
        :key="`instruction-${index}`"
        class="dynamic-input-row"
      >
        <div class="form-group mb-2">
          <label :for="`instruction-${index}`">Step {{ index + 1 }}*</label>
          <div class="input-with-button">
            <textarea
              :id="`instruction-${index}`"
              v-model="formData.instructions[index]"
              rows="2"
              placeholder="Describe this step"
              :class="{ 'input-error': validationErrors.instructions[index] }"
            ></textarea>
            <button
              v-if="formData.instructions.length > 1"
              type="button"
              class="btn-icon"
              @click="removeInstruction(index)"
              aria-label="Remove instruction"
            >
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div v-if="validationErrors.instructions[index]" class="error-message">
            {{ validationErrors.instructions[index] }}
          </div>
        </div>
      </div>

      <button type="button" class="btn btn-outline btn-sm mb-3" @click="addInstruction">
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
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Step
      </button>
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-outline" @click="handleCancel">Cancel</button>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        {{ submitButtonText }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.recipe-form {
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.form-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.form-section h3 {
  margin-bottom: 1.25rem;
  color: var(--color-primary);
  font-size: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.dynamic-input-row {
  margin-bottom: 0.5rem;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.input-with-button input,
.input-with-button textarea {
  flex: 1;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(230, 57, 70, 0.1);
  color: var(--color-error);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: rgba(230, 57, 70, 0.2);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
