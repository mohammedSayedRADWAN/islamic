<template>
  <div class="home-view">
    <!-- Hero Section -->
    <HeroSection />

    <!-- Categories Overview Section -->
    <section class="section categories-section">
      <div class="container">
        <div class="section-header">
          <div class="header-titles">
            <span class="section-subtitle">العلوم الشرعية</span>
            <h2 class="section-title font-heading">الأقسام التخصصية للدروس</h2>
          </div>
          <router-link to="/categories" class="btn btn-outline">
            <span>عرض جميع الأقسام ({{ categories.length }})</span>
            <ArrowLeft :size="16" :stroke-width="2" />
          </router-link>
        </div>

        <div class="categories-grid">
          <CategoryCard 
            v-for="cat in categories" 
            :key="cat.slug" 
            :category="cat" 
          />
        </div>
      </div>
    </section>

    <!-- Featured Lesson Spotlight -->
    <section class="section featured-section">
      <div class="container">
        <FeaturedLesson :lesson="featuredLesson" />
      </div>
    </section>

    <!-- Latest Lessons Section -->
    <section class="section latest-lessons-section">
      <div class="container">
        <div class="section-header">
          <div class="header-titles">
            <span class="section-subtitle">أحدث الإضافات</span>
            <h2 class="section-title font-heading">آخر الدروس والمحاضرات الصوتية</h2>
          </div>
          <router-link to="/lessons" class="btn btn-outline">
            <span>جميع الدروس ({{ lessons.length }})</span>
            <ArrowLeft :size="16" :stroke-width="2" />
          </router-link>
        </div>

        <div class="lessons-grid">
          <LessonCard 
            v-for="lesson in latestLessons" 
            :key="lesson.id" 
            :lesson="lesson" 
          />
        </div>
      </div>
    </section>

    <!-- Spiritual Quote Banner -->
    <section class="section quote-section">
      <div class="container">
        <div class="quote-card hero-gradient">
          <BookOpen :size="36" :stroke-width="2" class="quote-icon" />
          <blockquote class="quote-text font-heading">
            «مَن يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ»
          </blockquote>
          <p class="quote-author">- متفق عليه -</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ArrowLeft, BookOpen } from 'lucide-vue-next';
import HeroSection from '../components/HeroSection.vue';
import CategoryCard from '../components/CategoryCard.vue';
import LessonCard from '../components/LessonCard.vue';
import FeaturedLesson from '../components/FeaturedLesson.vue';
import { categories, lessons } from '../data/staticData';

const featuredLesson = computed(() => {
  return lessons.find(l => l.featured) || lessons[0];
});

const latestLessons = computed(() => {
  return lessons.slice(0, 6);
});
</script>

<style scoped>
.section {
  padding: 60px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.section-subtitle {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--accent-gold);
  text-transform: uppercase;
  margin-bottom: 6px;
  display: block;
}

.section-title {
  font-size: 2.2rem;
  line-height: 1.2;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.quote-card {
  text-align: center;
  padding: 50px 30px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-gold);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quote-icon {
  color: var(--accent-gold);
  margin-bottom: 14px;
}

.quote-text {
  font-size: 2rem;
  color: var(--accent-gold);
  margin-bottom: 12px;
}

.quote-author {
  color: #E2E8F0;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .quote-text {
    font-size: 1.5rem;
  }
}
</style>
