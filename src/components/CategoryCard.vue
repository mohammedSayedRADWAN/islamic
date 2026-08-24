<template>
  <router-link :to="`/categories/${category.slug}`" class="category-card glass-card" v-scroll-reveal>
    <div class="card-header">
      <div class="category-icon" :style="{ background: category.color + '1A', color: category.color }">
        <component :is="getCategoryIcon(category.slug)" :size="28" :stroke-width="2" />
      </div>
      <span class="count-badge" :class="category.badgeClass">
        {{ category.count }} درس
      </span>
    </div>
    
    <div class="card-body">
      <h3 class="category-title">{{ category.name }}</h3>
      <p class="category-desc">{{ category.description }}</p>
    </div>

    <div class="card-footer">
      <span class="explore-btn">
        <span>عرض جميع دروس {{ category.name }}</span>
        <ArrowLeft :size="16" :stroke-width="2" class="arrow-icon" />
      </span>
    </div>
  </router-link>
</template>

<script setup>
import { BookOpen, Scroll, Library, ArrowLeft } from 'lucide-vue-next';
import TawheedIcon from './icons/TawheedIcon.vue';

defineProps({
  category: {
    type: Object,
    required: true
  }
});

const getCategoryIcon = (slug) => {
  switch (slug) {
    case 'fiqh': return BookOpen;
    case 'hadith': return Scroll;
    case 'tafsir': return Library;
    case 'tawheed': return TawheedIcon;
    default: return BookOpen;
  }
};
</script>

<style scoped>
.category-card {
  display: flex;
  flex-direction: column;
  padding: 28px;
  text-decoration: none;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.category-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.08);
}

.count-badge {
  font-weight: 700;
}

.card-body {
  flex-grow: 1;
  margin-bottom: 20px;
}

.category-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: var(--primary-emerald);
}

[data-theme="dark"] .category-title {
  color: var(--accent-gold);
}

.category-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.card-footer {
  border-top: 1px dashed var(--border-color);
  padding-top: 14px;
}

.explore-btn {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary-emerald);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s ease;
}

.arrow-icon {
  transition: transform 0.2s ease;
}

.category-card:hover .explore-btn {
  color: var(--accent-gold);
}

.category-card:hover .arrow-icon {
  transform: translateX(-4px);
}
</style>
