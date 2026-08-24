<template>
  <div class="lesson-details-page page-padding" v-if="lesson">
    <div class="container">
      
      <!-- Back Link -->
      <div class="back-link-wrapper">
        <router-link :to="`/categories/${lesson.category}`" class="back-link">
          <ArrowRight :size="16" :stroke-width="2" />
          <span>العودة إلى دروس قسم {{ lesson.categoryName }}</span>
        </router-link>
      </div>

      <!-- Main Lesson Card & Player Header -->
      <div class="lesson-hero-card glass-card">
        <div class="hero-header">
          <div class="header-top-row">
            <div class="meta-badges">
              <span class="badge" :class="lesson.badgeClass">قسم {{ lesson.categoryName }}</span>
              <span class="lesson-number-badge">الدرس رقم {{ lesson.lessonNumber }}</span>
              <span class="lesson-date">
                <Calendar :size="14" :stroke-width="2" />
                <span>{{ lesson.date }}</span>
              </span>
            </div>

            <!-- Bookmark Button -->
            <button 
              class="btn btn-outline bookmark-action-btn"
              :class="{ 'is-bookmarked': isBookmarked(lesson.id) }"
              @click="toggleBookmark(lesson.id)"
            >
              <Heart 
                :size="16" 
                :stroke-width="2" 
                :fill="isBookmarked(lesson.id) ? 'var(--accent-gold)' : 'none'"
                :color="isBookmarked(lesson.id) ? 'var(--accent-gold)' : 'currentColor'"
              />
              <span v-if="isBookmarked(lesson.id)">محفـوظ في مكتبتي</span>
              <span v-else>حفظ في المحفوظات</span>
            </button>
          </div>

          <h1 class="lesson-main-title font-heading">{{ lesson.title }}</h1>
          <p class="sheikh-attribution">إلقاء: {{ sheikhInfo.name }}</p>
        </div>

        <!-- Custom Prominent Audio Player -->
        <div class="main-player-box hero-gradient">
          <div class="player-status-row">
            <span class="status-badge">
              <Volume2 v-if="isCurrentPlaying && isPlaying" :size="18" :stroke-width="2" />
              <Headphones v-else :size="18" :stroke-width="2" />
              <span>{{ isCurrentPlaying && isPlaying ? 'جاري التشغيل...' : 'جاهز للاستماع' }}</span>
            </span>
            <span class="duration-label">المدة الإجمالية: {{ lesson.duration }}</span>
          </div>

          <div class="big-controls-row">
            <button class="big-play-btn" @click="handlePlay">
              <Pause v-if="isCurrentPlaying && isPlaying" :size="24" :stroke-width="2" />
              <Play v-else :size="24" :stroke-width="2" />
            </button>

            <div class="progress-col">
              <div class="time-display">
                <span>{{ isCurrentPlaying ? formatTime(currentTime) : '00:00' }}</span>
                <span>{{ isCurrentPlaying ? formatTime(duration) : lesson.duration }}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                :max="isCurrentPlaying ? (duration || 100) : 100" 
                :value="isCurrentPlaying ? currentTime : 0" 
                @input="onSeek"
                class="big-slider"
              />
            </div>
          </div>

          <div class="player-toolbar">
            <div class="toolbar-left">
              <button class="tool-btn flex-btn" @click="skip(-10)">
                <RotateCcw :size="15" :stroke-width="2" />
                <span>10ث</span>
              </button>
              <button class="tool-btn flex-btn" @click="skip(10)">
                <span>10ث</span>
                <RotateCw :size="15" :stroke-width="2" />
              </button>
              <button class="tool-btn rate-btn" @click="cycleRate">السرعة: {{ playbackRate }}x</button>
            </div>
            
            <a :href="lesson.audioUrl" download class="tool-btn download-btn flex-btn">
              <Download :size="15" :stroke-width="2" />
              <span>تحميل التسجيل الصوتِي</span>
            </a>
          </div>
        </div>

        <!-- Lesson Description & Summary Notes -->
        <div class="lesson-body">
          <h3 class="body-title font-heading">
            <FileText :size="20" :stroke-width="2" class="title-icon" />
            <span>ملخص موضوعات الدرس</span>
          </h3>
          <p class="body-text">{{ lesson.description }}</p>

          <div class="lesson-points">
            <h4 class="points-title font-heading">أبرز المحاور والفوائد:</h4>
            <ul>
              <li>
                <Check :size="16" :stroke-width="2" class="check-icon" />
                <span>تأصيل أهمية تعلم هذا الباب الشرعي بالدليل من الكتاب والسنة.</span>
              </li>
              <li>
                <Check :size="16" :stroke-width="2" class="check-icon" />
                <span>تفصيل المسائل الفقهية والضوابط المعتمدة عند أهل العلم.</span>
              </li>
              <li>
                <Check :size="16" :stroke-width="2" class="check-icon" />
                <span>الإجابة على التساؤلات والنوازل الفقهية المعاصرة المتعلقة بالموضوع.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Next / Previous Lesson Navigation -->
        <div class="lesson-nav-footer">
          <router-link 
            v-if="prevLesson" 
            :to="`/lessons/${prevLesson.id}`" 
            class="nav-btn prev-btn glass-card"
          >
            <span class="nav-dir">
              <span>الدرس السابق</span>
              <ArrowRight :size="14" :stroke-width="2" />
            </span>
            <span class="nav-title">{{ prevLesson.title }}</span>
          </router-link>

          <router-link 
            v-if="nextLesson" 
            :to="`/lessons/${nextLesson.id}`" 
            class="nav-btn next-btn glass-card"
          >
            <span class="nav-dir">
              <span>الدرس التالي</span>
              <ArrowLeft :size="14" :stroke-width="2" />
            </span>
            <span class="nav-title">{{ nextLesson.title }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Heart, 
  Volume2, 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Download, 
  FileText, 
  Check 
} from 'lucide-vue-next';
import { lessons, sheikhInfo } from '../data/staticData';
import { useAudioPlayer } from '../composables/useAudioPlayer';
import { useBookmarks } from '../composables/useBookmarks';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});

const {
  currentLesson,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  playLesson,
  togglePlay,
  seek,
  skip,
  setRate,
  formatTime
} = useAudioPlayer();

const { isBookmarked, toggleBookmark } = useBookmarks();

const lesson = computed(() => {
  return lessons.find(l => l.id === Number(props.id));
});

const isCurrentPlaying = computed(() => {
  return currentLesson.value && currentLesson.value.id === lesson.value?.id;
});

const handlePlay = () => {
  if (lesson.value) {
    playLesson(lesson.value);
  }
};

const onSeek = (e) => {
  if (isCurrentPlaying.value) {
    seek(parseFloat(e.target.value));
  } else {
    handlePlay();
  }
};

const rates = [0.75, 1, 1.25, 1.5, 2];
const cycleRate = () => {
  const currentIndex = rates.indexOf(playbackRate.value);
  const nextIndex = (currentIndex + 1) % rates.length;
  setRate(rates[nextIndex]);
};

const categoryLessons = computed(() => {
  if (!lesson.value) return [];
  return lessons.filter(l => l.category === lesson.value.category);
});

const prevLesson = computed(() => {
  if (!lesson.value) return null;
  const index = categoryLessons.value.findIndex(l => l.id === lesson.value.id);
  return index > 0 ? categoryLessons.value[index - 1] : null;
});

const nextLesson = computed(() => {
  if (!lesson.value) return null;
  const index = categoryLessons.value.findIndex(l => l.id === lesson.value.id);
  return index < categoryLessons.value.length - 1 ? categoryLessons.value[index + 1] : null;
});
</script>

<style scoped>
.page-padding {
  padding: 60px 0 80px;
}

.back-link-wrapper {
  margin-bottom: 24px;
}

.back-link {
  color: var(--primary-emerald);
  font-weight: 700;
  text-decoration: none;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.back-link:hover {
  color: var(--accent-gold);
}

.lesson-hero-card {
  padding: 40px;
}

.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-badges {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.lesson-number-badge {
  font-size: 0.85rem;
  font-weight: 800;
  background: var(--bg-sand);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
}

.lesson-date {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.bookmark-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.bookmark-action-btn.is-bookmarked {
  background: var(--accent-gold-light);
  border-color: var(--accent-gold);
  color: var(--primary-emerald);
}

.lesson-main-title {
  font-size: 2.2rem;
  margin-bottom: 8px;
  color: var(--primary-emerald);
}

[data-theme="dark"] .lesson-main-title {
  color: var(--accent-gold);
}

.sheikh-attribution {
  font-size: 1.05rem;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

/* Prominent Player Box */
.main-player-box {
  padding: 32px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-gold);
  margin-bottom: 40px;
  box-shadow: var(--shadow-md);
}

.player-status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: var(--accent-gold);
  font-weight: 700;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.big-controls-row {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.big-play-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-gold);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0F392B;
  box-shadow: var(--shadow-gold);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.big-play-btn:hover {
  transform: scale(1.08);
}

.progress-col {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-display {
  display: flex;
  justify-content: space-between;
  color: #E2E8F0;
  font-size: 0.9rem;
  font-weight: 700;
}

.big-slider {
  height: 8px;
}

.player-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left {
  display: flex;
  gap: 10px;
}

.tool-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.tool-btn.flex-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tool-btn:hover {
  background: var(--accent-gold);
  color: #0F392B;
}

.lesson-body {
  border-top: 1px dashed var(--border-color);
  padding-top: 36px;
  margin-bottom: 40px;
}

.body-title {
  font-size: 1.5rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.body-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.lesson-points {
  background: var(--bg-sand);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 24px;
}

.points-title {
  font-size: 1.15rem;
  margin-bottom: 12px;
}

.lesson-points ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--text-secondary);
}

.lesson-points li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.check-icon {
  color: var(--accent-gold);
  flex-shrink: 0;
}

/* Footer Nav */
.lesson-nav-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.nav-btn {
  padding: 20px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-dir {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--accent-gold);
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
}

@media (max-width: 768px) {
  .lesson-hero-card {
    padding: 24px;
  }
  .lesson-main-title {
    font-size: 1.6rem;
  }
  .lesson-nav-footer {
    grid-template-columns: 1fr;
  }
}
</style>
