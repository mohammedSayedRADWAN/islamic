<template>
  <transition name="slide-up">
    <div v-if="currentLesson" class="audio-player-fixed">
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
            <router-link :to="`/lessons/${currentLesson.id}`" class="info-title">
              {{ currentLesson.title }}
            </router-link>
          </div>
        </div>

        <!-- Audio Controls (Skip, Play/Pause, Seek) -->
        <div class="player-controls">
          <div class="buttons-row">
            <!-- Speed Switcher Button -->
            <button class="ctrl-btn speed-btn" @click="cycleRate" :title="`سرعة التشغيل: ${playbackRate}x`">
              {{ playbackRate }}x
            </button>

            <!-- Skip Backwards 10s -->
            <button class="ctrl-btn flex-btn" @click="skip(-10)" title="تراجع 10 ثواني">
              <RotateCcw :size="15" :stroke-width="2" />
              <span>10ث</span>
            </button>

            <!-- Main Play/Pause Button -->
            <button class="ctrl-btn play-main-btn" @click="togglePlay" :title="isPlaying ? 'إيقاف مؤقت' : 'تشغيل'">
              <Pause v-if="isPlaying" :size="20" :stroke-width="2" />
              <Play v-else :size="20" :stroke-width="2" />
            </button>

            <!-- Skip Forward 10s -->
            <button class="ctrl-btn flex-btn" @click="skip(10)" title="تقديم 10 ثواني">
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
            />
            <span class="time-label">{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Volume & Actions -->
        <div class="player-extra">
          <div class="volume-container">
            <button class="ctrl-btn icon-only" @click="toggleMute" title="كتم الصوت">
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
            />
          </div>

          <router-link :to="`/lessons/${currentLesson.id}`" class="btn btn-outline btn-sm expand-btn">
            <span>عرض الدرس</span>
            <BookOpen :size="15" :stroke-width="2" />
          </router-link>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { Play, Pause, Headphones, Volume2, Volume1, VolumeX, RotateCcw, RotateCw, BookOpen } from 'lucide-vue-next';
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

const previousVolume = ref(1);

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
}

.player-container {
  display: grid;
  grid-template-columns: 1.2fr 2fr 1fr;
  align-items: center;
  gap: 20px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
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

/* Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 900px) {
  .player-container {
    grid-template-columns: 1fr 1fr;
  }
  .player-extra {
    display: none;
  }
}

@media (max-width: 600px) {
  .player-container {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .info-title {
    font-size: 0.85rem;
  }
}
</style>
