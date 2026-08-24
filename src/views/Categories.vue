<template>
  <div class="categories-page page-padding">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header text-center">
        <span class="badge badge-fiqh badge-lg">العلوم الشرعية</span>
        <h1 class="page-title font-heading">أقسام العلوم والمواد التخصصية</h1>
        <p class="page-subtitle">
          اختر العلم الشرعي الذي ترغب بالاستماع لدروسه ومتابعة سلاسله العلمية مرتبة ومبوبة.
        </p>
      </div>

      <!-- Categories Grid -->
      <div class="categories-grid">
        <CategoryCard 
          v-for="cat in categories" 
          :key="cat.slug" 
          :category="cat" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import CategoryCard from '../components/CategoryCard.vue';
import { categories } from '../data/staticData';
</script>

<style scoped>
.page-padding {
  padding: 60px 0 80px;
}

.text-center {
  text-align: center;
}

.page-header {
  margin-bottom: 50px;
}

.badge-lg {
  font-size: 0.95rem;
  padding: 6px 16px;
  margin-bottom: 16px;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 650px;
  margin: 0 auto;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
}
</style>
