<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <p>&copy; {{ currentYear }} Fojo. All rights reserved.</p>
        <p class="tagline">Your personal recipe collection</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-surface);
  padding: 1.5rem 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer p {
  margin: 0;
  color: var(--color-text-light);
}

.tagline {
  font-style: italic;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
