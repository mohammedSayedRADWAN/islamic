<template>
  <div v-if="lesson" class="featured-card hero-gradient" v-scroll-reveal>
    <div class="featured-badge">
      <Star :size="15" :stroke-width="2" fill="currentColor" class="badge-icon" />
      <span>درس مميز لهذا الأسبوع</span>
    </div>
    
    <div class="featured-content">
      <div class="featured-meta">
        <span class="badge badge-gold">الدرس {{ String(lesson.lessonNumber).padStart(2, '0') }}</span>
        <span class="category-name">قسم {{ lesson.categoryName }}</span>
        <span class="duration">
          <Clock :size="14" :stroke-width="2" />
          <span>{{ lesson.duration }}</span>
        </span>
      </div>

      <h2 class="featured-title font-heading">
        {{ lesson.title }}
      </h2>

      <p class="featured-desc">
        {{ lesson.description }}
      </p>

      <div class="featured-actions">
        <button 
          class="btn btn-gold btn-lg" 
          @click="playLesson(lesson)"
        >
          <Pause v-if="isCurrentPlaying && isPlaying" :size="18" :stroke-width="2" />
          <Play v-else :size="18" :stroke-width="2" />
          <span v-if="isCurrentPlaying && isPlaying">إيقاف الاستماع</span>
          <span v-else>استمع للدرس المميز</span>
        </button>

        <router-link :to="`/lessons/${lesson.id}`" class="btn btn-outline featured-btn-outline">
          <span>قراءة التفاصيل والملخص</span>
          <BookOpen :size="18" :stroke-width="2" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Star, Clock, Play, Pause, BookOpen } from 'lucide-vue-next';
import { useAudioPlayer } from '../composables/useAudioPlayer';

const props = defineProps({
  lesson: {
    type: Object,
    required: true
  }
});

const { currentLesson, isPlaying, playLesson } = useAudioPlayer();

const isCurrentPlaying = computed(() => {
  return currentLesson.value && currentLesson.value.id === props.lesson.id;
});
</script>

<style scoped>
.featured-card {
  border-radius: var(--radius-lg);
  padding: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-gold);
}

.featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--accent-gold);
  color: #0F392B;
  padding: 4px 14px;
  border-radius: var(--radius-full);
  font-weight: 800;
  font-size: 0.85rem;
  margin-bottom: 20px;
}

.featured-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #E2E8F0;
  font-size: 0.9rem;
  margin-bottom: 14px;
}

.duration {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-gold {
  background: rgba(212, 175, 55, 0.2);
  color: var(--accent-gold);
  border: 1px solid var(--accent-gold);
}

.featured-title {
  font-size: 2.2rem;
  color: #FFFFFF;
  line-height: 1.3;
  margin-bottom: 16px;
}

.featured-desc {
  font-size: 1.05rem;
  color: #CBD5E1;
  line-height: 1.8;
  max-width: 750px;
  margin-bottom: 28px;
}

.featured-actions {
  display: flex;
  gap: 16px;
}

.btn-lg {
  padding: 12px 28px;
  font-size: 1.05rem;
}

.featured-btn-outline {
  border-color: rgba(255, 255, 255, 0.3);
  color: #FFFFFF;
}

.featured-btn-outline:hover {
  background: rgba(255, 255, 255, 0.15);
  color: var(--accent-gold);
}

@media (max-width: 768px) {
  .featured-card {
    padding: 24px;
  }
  .featured-title {
    font-size: 1.6rem;
  }
  .featured-actions {
    flex-direction: column;
  }
}
</style>
