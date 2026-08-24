<template>
  <div class="lessons-page page-padding">
    <div class="container">
      <!-- Header -->
      <div class="page-header text-center">
        <span class="badge badge-fiqh badge-lg">مكتبة التسجيلات</span>
        <h1 class="page-title font-heading">جميع الدروس والمحاضرات الصوتية</h1>
        <p class="page-subtitle">
          تصفح الدروس العلمية المسجلة، يمكنك الفلترة حسب العلم الشرعي أو مدة الدرس، وترتيبها حسب الأحدث والقديم.
        </p>
      </div>

      <!-- Filter & Sort Bar -->
      <CategoryFilter 
        v-model:selectedCategory="selectedCategory"
        v-model:durationFilter="durationFilter"
        v-model:sortBy="sortBy"
      />

      <!-- Lessons Grid -->
      <div v-if="filteredLessons.length > 0" class="lessons-grid">
        <LessonCard 
          v-for="lesson in filteredLessons" 
          :key="lesson.id" 
          :lesson="lesson" 
        />
      </div>

      <div v-else class="empty-state glass-card text-center">
        <p>🔍 لا توجد دروس تطابق خيارات الفلترة والمدة المحددة.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import LessonCard from '../components/LessonCard.vue';
import CategoryFilter from '../components/CategoryFilter.vue';
import { lessons } from '../data/staticData';

const selectedCategory = ref('all');
const durationFilter = ref('all');
const sortBy = ref('newest');

// Utility to parse duration string "MM:SS" into minutes integer
const parseMinutes = (durationStr) => {
  if (!durationStr) return 0;
  const parts = durationStr.split(':');
  return parseInt(parts[0], 10) || 0;
};

const filteredLessons = computed(() => {
  let list = [...lessons];
  
  // Category Filter
  if (selectedCategory.value !== 'all') {
    list = list.filter(l => l.category === selectedCategory.value);
  }

  // Duration Filter
  if (durationFilter.value === 'short') {
    list = list.filter(l => parseMinutes(l.duration) < 35);
  } else if (durationFilter.value === 'medium') {
    list = list.filter(l => {
      const m = parseMinutes(l.duration);
      return m >= 35 && m <= 45;
    });
  } else if (durationFilter.value === 'long') {
    list = list.filter(l => parseMinutes(l.duration) > 45);
  }

  // Sorting
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

.text-center {
  text-align: center;
}

.page-header {
  margin-bottom: 40px;
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

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.empty-state {
  padding: 60px;
  font-size: 1.1rem;
  color: var(--text-muted);
}
</style>
