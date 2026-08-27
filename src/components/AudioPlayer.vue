<template>
  <div v-if="currentLesson" class="audio-player-wrapper">
    
    <!-- Floating Circular Icon (Collapsed State) -->
    <button 
      class="floating-audio-btn"
      :class="{ 'is-playing': isPlaying, 'is-hidden': isExpanded }"
      @click="toggleExpand"
      :title="`مشغل الصوت: ${currentLesson.title}`"
      :aria-label="isExpanded ? 'تصغير المشغل' : 'توسيع مشغل الصوت'"
      :aria-expanded="isExpanded"
    >
      <span v-if="isPlaying" class="floating-pulse-ring"></span>
      <Volume2 v-if="isPlaying" :size="24" :stroke-width="2.2" class="floating-icon" />
      <Headphones v-else :size="24" :stroke-width="2.2" class="floating-icon" />
    </button>

    <!-- Full Audio Player Bar (Expanded State) -->
    <div 
      class="audio-player-fixed"
      :class="{ 'is-collapsed': !isExpanded, 'is-expanded': isExpanded }"
      role="region"
      aria-label="مشغل الصوت الكامل"
      :aria-hidden="!isExpanded"
    >
      <div class="container player-container">
        
        <!-- Lesson Title & Meta Info -->
        <div class="player-info">
          <div class="play-icon-badge font-heading">
            <Volume2 v-if="isPlaying" :size="20" :stroke-width="2" />
            <Headphones v-else :size="20" :stroke-width="2" />
          </div>
          <div class="info-text">
            <span class="info-category badge" :class="currentLesson.badgeClass">
              {{ currentLesson.categoryName }} (درس {{ currentLesson.lessonNumber }})
            </span>
            <router-link :to="`/lessons/${currentLesson.id}`" class="info-title" :tabindex="isExpanded ? 0 : -1">
              {{ currentLesson.title }}
            </router-link>
          </div>
        </div>

        <!-- Audio Controls (Skip, Play/Pause, Seek) -->
        <div class="player-controls">
          <div class="buttons-row">
            <!-- Speed Switcher Button -->
            <button 
              class="ctrl-btn speed-btn" 
              @click="cycleRate" 
              :title="`سرعة التشغيل: ${playbackRate}x`"
              :aria-label="`سرعة التشغيل: ${playbackRate}x`"
              :tabindex="isExpanded ? 0 : -1"
            >
              {{ playbackRate }}x
            </button>

            <!-- Skip Backwards 10s -->
            <button 
              class="ctrl-btn flex-btn" 
              @click="skip(-10)" 
              title="تراجع 10 ثواني"
              aria-label="تراجع 10 ثواني"
              :tabindex="isExpanded ? 0 : -1"
            >
              <RotateCcw :size="15" :stroke-width="2" />
              <span>10ث</span>
            </button>

            <!-- Main Play/Pause Button -->
            <button 
              class="ctrl-btn play-main-btn" 
              @click="togglePlay" 
              :title="isPlaying ? 'إيقاف مؤقت' : 'تشغيل'"
              :aria-label="isPlaying ? 'إيقاف مؤقت' : 'تشغيل'"
              :tabindex="isExpanded ? 0 : -1"
            >
              <Pause v-if="isPlaying" :size="20" :stroke-width="2" />
              <Play v-else :size="20" :stroke-width="2" />
            </button>

            <!-- Skip Forward 10s -->
            <button 
              class="ctrl-btn flex-btn" 
              @click="skip(10)" 
              title="تقديم 10 ثواني"
              aria-label="تقديم 10 ثواني"
              :tabindex="isExpanded ? 0 : -1"
            >
              <span>10ث</span>
              <RotateCw :size="15" :stroke-width="2" />
            </button>
          </div>

          <!-- Timeline Slider -->
          <div class="timeline-row">
            <span class="time-label">{{ formatTime(currentTime) }}</span>
            <input 
              type="range" 
              min="0" 
              :max="duration || 100" 
              :value="currentTime" 
              @input="onSeek"
              class="timeline-slider"
              aria-label="مؤشر شريط الصوت"
              :tabindex="isExpanded ? 0 : -1"
            />
            <span class="time-label">{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Volume & Actions -->
        <div class="player-extra">
          <div class="volume-container">
            <button 
              class="ctrl-btn icon-only" 
              @click="toggleMute" 
              title="كتم الصوت"
              aria-label="كتم الصوت"
              :tabindex="isExpanded ? 0 : -1"
            >
              <VolumeX v-if="volume === 0" :size="18" :stroke-width="2" />
              <Volume1 v-else-if="volume < 0.5" :size="18" :stroke-width="2" />
              <Volume2 v-else :size="18" :stroke-width="2" />
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              :value="volume" 
              @input="onVolumeChange"
              class="volume-slider"
              aria-label="مستوى الصوت"
              :tabindex="isExpanded ? 0 : -1"
            />
          </div>

          <router-link :to="`/lessons/${currentLesson.id}`" class="btn btn-outline btn-sm expand-btn" :tabindex="isExpanded ? 0 : -1">
            <span>عرض الدرس</span>
            <BookOpen :size="15" :stroke-width="2" />
          </router-link>
        </div>

        <!-- Collapse Button (Expanded State) -->
        <div class="player-toggle">
          <button 
            class="ctrl-btn toggle-collapse-btn" 
            @click="toggleExpand" 
            title="تصغير المشغل"
            aria-label="تصغير المشغل"
            :tabindex="isExpanded ? 0 : -1"
          >
            <ChevronDown :size="20" :stroke-width="2" />
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { 
  Play, 
  Pause, 
  Headphones, 
  Volume2, 
  Volume1, 
  VolumeX, 
  RotateCcw, 
  RotateCw, 
  BookOpen,
  ChevronDown
} from 'lucide-vue-next';
import { useAudioPlayer } from '../composables/useAudioPlayer';

const {
  currentLesson,
  isPlaying,
  currentTime,
  duration,
  volume,
  playbackRate,
  togglePlay,
  seek,
  skip,
  setRate,
  setVolume,
  formatTime
} = useAudioPlayer();

const isExpanded = ref(true);
const previousVolume = ref(1);

watch(currentLesson, (newLesson) => {
  if (newLesson) {
    isExpanded.value = true;
  }
});

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const onSeek = (e) => {
  seek(parseFloat(e.target.value));
};

const onVolumeChange = (e) => {
  setVolume(parseFloat(e.target.value));
};

const toggleMute = () => {
  if (volume.value > 0) {
    previousVolume.value = volume.value;
    setVolume(0);
  } else {
    setVolume(previousVolume.value || 1);
  }
};

const rates = [0.75, 1, 1.25, 1.5, 2];
const cycleRate = () => {
  const currentIndex = rates.indexOf(playbackRate.value);
  const nextIndex = (currentIndex + 1) % rates.length;
  setRate(rates[nextIndex]);
};
</script>

<style scoped>
/* Floating Circular Button (Collapsed State) */
.floating-audio-btn {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 999;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--primary-emerald);
  color: var(--accent-gold);
  border: 2px solid var(--accent-gold);
  box-shadow: 0 6px 24px rgba(15, 57, 43, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.25s ease,
              visibility 0.3s,
              background-color 0.2s ease,
              box-shadow 0.2s ease;
  opacity: 1;
  transform: scale(1) translateY(0);
  visibility: visible;
  outline: none;
}

.floating-audio-btn:hover {
  transform: scale(1.1) translateY(-2px);
  background: var(--accent-gold);
  color: #0F392B;
  box-shadow: 0 10px 28px rgba(212, 163, 89, 0.45);
}

.floating-audio-btn.is-hidden {
  opacity: 0;
  transform: scale(0.6) translateY(16px);
  visibility: hidden;
  pointer-events: none;
}

.floating-pulse-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  border: 2px solid var(--accent-gold);
  animation: pulse-aura 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
  pointer-events: none;
}

@keyframes pulse-aura {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  70% {
    transform: scale(1.35);
    opacity: 0;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

/* Full Audio Player Bar (Expanded State) */
.audio-player-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: var(--bg-card);
  border-top: 2px solid var(--accent-gold);
  box-shadow: 0 -8px 30px rgba(15, 57, 43, 0.15);
  padding: 12px 0;
  backdrop-filter: blur(12px);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.25s ease,
              visibility 0.3s;
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.audio-player-fixed.is-collapsed {
  transform: translateY(100%);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.player-container {
  display: grid;
  grid-template-columns: 1.2fr 2fr 1fr auto;
  align-items: center;
  gap: 16px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.play-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--primary-emerald);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-gold);
  flex-shrink: 0;
}

.info-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.info-category {
  font-size: 0.75rem;
  width: fit-content;
  margin-bottom: 2px;
}

.info-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  transition: color 0.2s ease;
}

.info-title:hover {
  color: var(--accent-gold);
}

/* Controls */
.player-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.buttons-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ctrl-btn {
  background: transparent;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  color: var(--text-main);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.ctrl-btn.flex-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ctrl-btn:hover {
  color: var(--accent-gold);
  background: var(--bg-sand);
}

.play-main-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--primary-emerald);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.25s ease, background-color 0.2s ease;
}

.play-main-btn:hover {
  background: var(--accent-gold);
  color: #0F392B;
  transform: scale(1.05);
}

.speed-btn {
  font-weight: 800;
  font-size: 0.82rem;
  background: var(--primary-light);
  color: var(--primary-emerald);
  border-radius: var(--radius-full);
  padding: 2px 10px;
}

.timeline-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.time-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  min-width: 42px;
  text-align: center;
}

.timeline-slider {
  flex-grow: 1;
}

/* Extra Volume & Actions */
.player-extra {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.volume-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 120px;
}

.volume-slider {
  width: 80px;
}

.expand-btn {
  font-size: 0.82rem;
  padding: 6px 12px;
}

/* Collapse Toggle Button in Expanded State */
.player-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-collapse-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-sand);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;
}

.toggle-collapse-btn:hover {
  background: var(--primary-light);
  color: var(--primary-emerald);
  transform: scale(1.08);
}

/* Media Queries & Responsive Design */
@media (max-width: 900px) {
  .player-container {
    grid-template-columns: 1fr 1fr auto;
  }
  .player-extra {
    display: none;
  }
}

@media (max-width: 600px) {
  .player-container {
    grid-template-columns: 1fr auto auto;
    gap: 10px;
  }
  .info-title {
    font-size: 0.85rem;
  }
  .floating-audio-btn {
    bottom: 18px;
    left: 18px;
    width: 48px;
    height: 48px;
  }
}

/* Reduced Motion Accessibility */
@media (prefers-reduced-motion: reduce) {
  .audio-player-fixed,
  .floating-audio-btn,
  .floating-pulse-ring,
  .toggle-collapse-btn,
  .ctrl-btn,
  .play-main-btn {
    transition: none !important;
    animation: none !important;
  }
}
</style>


