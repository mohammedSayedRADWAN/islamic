<template>
  <div class="lesson-card glass-card" :class="{ 'is-playing': isCurrentPlaying }" v-scroll-reveal>
    <!-- Card Header Meta -->
    <div class="card-meta">
      <div class="meta-right">
        <span class="lesson-num">الدرس {{ String(lesson.lessonNumber).padStart(2, '0') }}</span>
        <span class="badge" :class="lesson.badgeClass">{{ lesson.categoryName }}</span>
      </div>
      
      <div class="meta-left">
        <span class="duration">
          <Clock :size="14" :stroke-width="2" />
          <span>{{ lesson.duration }}</span>
        </span>
        
        <!-- Bookmark Toggle Button -->
        <button 
          class="bookmark-btn" 
          :class="{ 'is-active': isBookmarked(lesson.id) }" 
          @click="toggleBookmark(lesson.id)"
          :title="isBookmarked(lesson.id) ? 'إزالة من المحفوظات' : 'حفظ في المحفوظات'"
        >
          <Heart 
            :size="16" 
            :stroke-width="2" 
            :fill="isBookmarked(lesson.id) ? 'var(--accent-gold)' : 'none'"
            :color="isBookmarked(lesson.id) ? 'var(--accent-gold)' : 'currentColor'"
          />
        </button>
      </div>
    </div>

    <!-- Lesson Title & Description -->
    <router-link :to="`/lessons/${lesson.id}`" class="card-content">
      <h3 class="lesson-title">{{ lesson.title }}</h3>
      <p class="lesson-desc">{{ lesson.description }}</p>
    </router-link>

    <!-- Card Action Bar -->
    <div class="card-actions">
      <!-- Audio Play Trigger -->
      <button 
        class="btn play-btn" 
        :class="isCurrentPlaying && isPlaying ? 'btn-gold' : 'btn-emerald'"
        @click="handlePlay"
      >
        <Pause v-if="isCurrentPlaying && isPlaying" :size="16" :stroke-width="2" />
        <Play v-else :size="16" :stroke-width="2" />
        <span v-if="isCurrentPlaying && isPlaying">إيقاف مؤقت</span>
        <span v-else>استماع الآن</span>
      </button>

      <router-link :to="`/lessons/${lesson.id}`" class="btn btn-outline details-btn">
        <span>تفاصيل</span>
        <BookOpen :size="15" :stroke-width="2" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Play, Pause, Clock, Heart, BookOpen } from 'lucide-vue-next';
import { useAudioPlayer } from '../composables/useAudioPlayer';
import { useBookmarks } from '../composables/useBookmarks';

const props = defineProps({
  lesson: {
    type: Object,
    required: true
  }
});

const { currentLesson, isPlaying, playLesson } = useAudioPlayer();
const { isBookmarked, toggleBookmark } = useBookmarks();

const isCurrentPlaying = computed(() => {
  return currentLesson.value && currentLesson.value.id === props.lesson.id;
});

const handlePlay = () => {
  playLesson(props.lesson);
};
</script>

<style scoped>
.lesson-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  position: relative;
}

.lesson-card.is-playing {
  border-color: var(--accent-gold);
  background: var(--accent-gold-light);
}

[data-theme="dark"] .lesson-card.is-playing {
  background: rgba(212, 175, 55, 0.1);
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.meta-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lesson-num {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text-muted);
  background: var(--bg-sand);
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.duration {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.bookmark-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: transform 0.2s ease, color 0.2s ease;
}

.bookmark-btn:hover {
  transform: scale(1.2);
  color: var(--accent-gold);
}

.bookmark-btn.is-active {
  animation: heartPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-content {
  text-decoration: none;
  flex-grow: 1;
  margin-bottom: 20px;
}

.lesson-title {
  font-size: 1.25rem;
  margin-bottom: 10px;
  line-height: 1.4;
  color: var(--text-main);
  transition: color 0.2s ease;
}

.card-content:hover .lesson-title {
  color: var(--accent-gold);
}

.lesson-desc {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.play-btn {
  flex: 1;
}

.details-btn {
  font-size: 0.88rem;
  padding: 8px 16px;
}
</style>
