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
    <!-- Crescent Moon on Top Dome -->
    <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5c0 .41-.17.78-.44 1.05A1.5 1.5 0 1 1 12 2z" />
    <!-- Main Center Dome -->
    <path d="M6 13a6 6 0 0 1 12 0v7H6v-7z" />
    <!-- Center Arch Entrance -->
    <path d="M10 20v-3a2 2 0 0 1 4 0v3" />
    <!-- Left Minaret -->
    <path d="M3 10v10M2 10h2M3 7v1" />
    <!-- Right Minaret -->
    <path d="M21 10v10M20 10h2M21 7v1" />
    <!-- Base Foundation Line -->
    <path d="M1 20h22" />
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
