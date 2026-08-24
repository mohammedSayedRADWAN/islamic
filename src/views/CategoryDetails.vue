<template>
  <div class="category-details-page page-padding">
    <div class="container" v-if="category">
      <!-- Category Banner Card -->
      <div class="category-banner glass-card" :style="{ borderTopColor: category.color, borderTopWidth: '4px' }">
        <div class="banner-icon" :style="{ background: category.color + '1A', color: category.color }">
          <component :is="getCategoryIcon(category.slug)" :size="36" :stroke-width="2" />
        </div>
        <div class="banner-info">
          <div class="banner-meta">
            <span class="badge" :class="category.badgeClass">قسم {{ category.name }}</span>
            <span class="meta-count">عدد الدروس: {{ categoryLessons.length }}</span>
          </div>
          <h1 class="category-title font-heading">{{ category.name }}</h1>
          <p class="category-desc">{{ category.description }}</p>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="controls-bar">
        <h3 class="lessons-count-title font-heading">
          الدروس المتاحة ({{ sortedLessons.length }})
        </h3>
        
        <div class="sorting-wrapper">
          <span class="sort-label">الترتيب:</span>
          <select v-model="sortBy" class="sort-select">
            <option value="newest">الأحدث أولاً</option>
            <option value="oldest">الأقدم أولاً</option>
            <option value="number">حسب رقم الدرس</option>
          </select>
        </div>
      </div>

      <!-- Lessons Grid -->
      <div v-if="sortedLessons.length > 0" class="lessons-grid">
        <LessonCard 
          v-for="lesson in sortedLessons" 
          :key="lesson.id" 
          :lesson="lesson" 
        />
      </div>

      <div v-else class="empty-state glass-card text-center">
        <BookOpen :size="36" :stroke-width="2" class="empty-icon" />
        <span>لا توجد دروس مضافة لهذا القسم حالياً.</span>
      </div>
    </div>

    <!-- Category Not Found -->
    <div class="container text-center" v-else>
      <h2 class="font-heading">القسم غير موجود</h2>
      <router-link to="/categories" class="btn btn-emerald mt-4">العودة إلى الأقسام</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { BookOpen, Scroll, Library } from 'lucide-vue-next';
import TawheedIcon from '../components/icons/TawheedIcon.vue';
import LessonCard from '../components/LessonCard.vue';
import { categories, lessons } from '../data/staticData';

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
});

const sortBy = ref('number');

const category = computed(() => {
  return categories.find(c => c.slug === props.slug);
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

const categoryLessons = computed(() => {
  return lessons.filter(l => l.category === props.slug);
});

const sortedLessons = computed(() => {
  const list = [...categoryLessons.value];
  if (sortBy.value === 'newest') {
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy.value === 'oldest') {
    return list.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    return list.sort((a, b) => a.lessonNumber - b.lessonNumber);
  }
});
</script>

<style scoped>
.page-padding {
  padding: 60px 0 80px;
}

.category-banner {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 36px;
  margin-bottom: 40px;
}

.banner-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
}

.meta-count {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-muted);
}

.category-title {
  font-size: 2.2rem;
  margin-bottom: 8px;
}

.category-desc {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.lessons-count-title {
  font-size: 1.5rem;
}

.sorting-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-muted);
}

.sort-select {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-sand);
  color: var(--text-main);
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 0.9rem;
  outline: none;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 60px;
  font-size: 1.2rem;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

@media (max-width: 600px) {
  .category-banner {
    flex-direction: column;
    padding: 24px;
  }
}
</style>
