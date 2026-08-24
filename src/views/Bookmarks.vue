<template>
  <div class="bookmarks-page page-padding">
    <div class="container">
      
      <!-- Header -->
      <div class="page-header text-center">
        <span class="badge badge-fiqh badge-lg">المكتبة الشخصية</span>
        <h1 class="page-title font-heading">
          <span>الدروس المحفوظة</span>
          <Heart :size="24" :stroke-width="2" fill="var(--accent-gold)" color="var(--accent-gold)" />
        </h1>
        <p class="page-subtitle">
          قائمة بالدروس والمحاضرات الصوتية التي قمت بحفظها للاستماع والمراجعة لاحقاً.
        </p>
      </div>

      <!-- Action Toolbar -->
      <div v-if="savedLessons.length > 0" class="toolbar-wrapper">
        <span class="count-text font-heading">
          عدد الدروس المحفوظة: ({{ savedLessons.length }})
        </span>

        <button class="btn btn-outline btn-sm clear-btn" @click="clearAllBookmarks">
          <Trash2 :size="15" :stroke-width="2" />
          <span>مسح جميع المحفوظات</span>
        </button>
      </div>

      <!-- Lessons Grid -->
      <div v-if="savedLessons.length > 0" class="lessons-grid">
        <LessonCard 
          v-for="lesson in savedLessons" 
          :key="lesson.id" 
          :lesson="lesson" 
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state glass-card text-center">
        <Heart :size="48" :stroke-width="2" class="empty-icon" />
        <h3 class="font-heading empty-title">لا توجد دروس محفوظة حالياً</h3>
        <p class="empty-text">
          يمكنك إضافة أي درس إلى قائمة المفضلة عبر الضغط على رمز القلب في بطاقات الدروس.
        </p>
        <router-link to="/lessons" class="btn btn-gold mt-4">
          <Headphones :size="18" :stroke-width="2" />
          <span>تصفح مكتبة الدروس الآن</span>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Heart, Trash2, Headphones } from 'lucide-vue-next';
import LessonCard from '../components/LessonCard.vue';
import { lessons } from '../data/staticData';
import { useBookmarks } from '../composables/useBookmarks';

const { getBookmarkedLessons, clearAllBookmarks } = useBookmarks();

const savedLessons = computed(() => {
  return getBookmarkedLessons(lessons);
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 650px;
  margin: 0 auto;
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  background: var(--bg-card);
  padding: 16px 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.count-text {
  font-size: 1.25rem;
  color: var(--primary-emerald);
}

[data-theme="dark"] .count-text {
  color: var(--accent-gold);
}

.clear-btn {
  color: #DC2626;
  border-color: #FCA5A5;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.clear-btn:hover {
  background: #FEE2E2;
  color: #B91C1C;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.empty-state {
  padding: 60px 30px;
  max-width: 550px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  color: var(--text-muted);
  margin-bottom: 16px;
}

.empty-title {
  font-size: 1.6rem;
  margin-bottom: 12px;
}

.empty-text {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 24px;
}
</style>
