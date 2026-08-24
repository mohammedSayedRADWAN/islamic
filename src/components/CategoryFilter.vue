<template>
  <div class="filter-bar-wrapper glass-card">
    <!-- Categories Pills -->
    <div class="categories-pills">
      <button 
        class="filter-pill"
        :class="{ active: selectedCategory === 'all' }"
        @click="$emit('update:selectedCategory', 'all')"
      >
        <BookOpen :size="16" :stroke-width="2" />
        <span>الكل</span>
      </button>

      <button 
        v-for="cat in categories" 
        :key="cat.slug"
        class="filter-pill"
        :class="{ active: selectedCategory === cat.slug }"
        @click="$emit('update:selectedCategory', cat.slug)"
      >
        <component :is="getCategoryIcon(cat.slug)" :size="16" :stroke-width="2" />
        <span>{{ cat.name }}</span>
      </button>
    </div>

    <!-- Duration & Sorting Controls -->
    <div class="controls-right">
      <!-- Duration Filter -->
      <div class="filter-group">
        <span class="control-label">
          <Clock :size="15" :stroke-width="2" />
          <span>المدة:</span>
        </span>
        <select 
          :value="durationFilter" 
          @change="$emit('update:durationFilter', $event.target.value)"
          class="control-select"
        >
          <option value="all">جميع الأوقات</option>
          <option value="short">قصيرة (&lt; 35 دقيقة)</option>
          <option value="medium">متوسطة (35-45 دقيقة)</option>
          <option value="long">طويلة (&gt; 45 دقيقة)</option>
        </select>
      </div>

      <!-- Sorting Selector -->
      <div class="filter-group">
        <span class="control-label">الترتيب:</span>
        <select 
          :value="sortBy" 
          @change="$emit('update:sortBy', $event.target.value)"
          class="control-select"
        >
          <option value="newest">الأحدث أولاً</option>
          <option value="oldest">الأقدم أولاً</option>
          <option value="number">حسب رقم الدرس</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BookOpen, Scroll, Library, Clock } from 'lucide-vue-next';
import TawheedIcon from './icons/TawheedIcon.vue';
import { categories } from '../data/staticData';

defineProps({
  selectedCategory: {
    type: String,
    default: 'all'
  },
  durationFilter: {
    type: String,
    default: 'all'
  },
  sortBy: {
    type: String,
    default: 'newest'
  }
});

defineEmits(['update:selectedCategory', 'update:durationFilter', 'update:sortBy']);

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
.filter-bar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.categories-pills {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-pill {
  border: 1px solid var(--border-color);
  background: var(--bg-sand);
  color: var(--text-secondary);
  font-family: var(--font-ui);
  font-weight: 700;
  font-size: 0.9rem;
  padding: 8px 18px;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.filter-pill:hover {
  border-color: var(--accent-gold);
  color: var(--primary-emerald);
}

.filter-pill.active {
  background: var(--primary-emerald);
  color: #FFFFFF;
  border-color: var(--primary-emerald);
  box-shadow: var(--shadow-sm);
}

[data-theme="dark"] .filter-pill.active {
  background: var(--accent-gold);
  color: #0F392B;
  border-color: var(--accent-gold);
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.control-select {
  padding: 8px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-sand);
  color: var(--text-main);
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 0.88rem;
  outline: none;
  cursor: pointer;
}
</style>
