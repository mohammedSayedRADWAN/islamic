<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    :stroke-width="strokeWidth" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    class="lucide-icon"
  >
    <!-- Pointing Index Finger Up -->
    <path d="M12 2v9" />
    <path d="M12 2a2 2 0 0 1 2 2v7.5a.5.5 0 0 0 1 0V9a1.5 1.5 0 0 1 3 0v6a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-3.5a1.5 1.5 0 0 1 3 0V11a.5.5 0 0 0 1 0V4a2 2 0 0 1 2-2z" />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 24
  },
  strokeWidth: {
    type: [Number, String],
    default: 2
  }
});
</script>
