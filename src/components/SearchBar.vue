<template>
  <teleport to="body">
    <transition name="modal-scale">
      <div v-if="isOpen" class="search-modal-backdrop" @click.self="close">
        <div class="search-modal glass-card">
          <!-- Header -->
          <div class="modal-header">
            <h3 class="modal-title font-heading">
              <Search :size="20" :stroke-width="2" class="modal-title-icon" />
              <span>البحث في الدروس والمحاضرات</span>
            </h3>
            <button class="close-btn" @click="close">
              <X :size="20" :stroke-width="2" />
            </button>
          </div>

          <!-- Input -->
          <div class="search-input-wrapper">
            <input 
              ref="searchInputRef"
              type="text" 
              v-model="searchQuery" 
              placeholder="اكتب كلمة للبحث (مثلاً: الطهارة، الصلاة، الفاتحة...)" 
              class="search-input"
              @keyup.esc="close"
            />
            <span v-if="searchQuery" class="clear-icon" @click="searchQuery = ''">
              <X :size="16" :stroke-width="2" />
            </span>
          </div>

          <!-- Results -->
          <div class="search-results">
            <div v-if="filteredLessons.length > 0" class="results-list">
              <div 
                v-for="lesson in filteredLessons" 
                :key="lesson.id" 
                class="search-item"
              >
                <div class="item-meta">
                  <span class="badge" :class="lesson.badgeClass">{{ lesson.categoryName }}</span>
                  <span class="lesson-num">الدرس {{ lesson.lessonNumber }}</span>
                </div>
                <router-link :to="`/lessons/${lesson.id}`" class="item-title" @click="close">
                  {{ lesson.title }}
                </router-link>
                <p class="item-desc">{{ lesson.description }}</p>
                
                <div class="item-actions">
                  <button class="btn btn-gold btn-sm" @click="handlePlay(lesson)">
                    <Play :size="14" :stroke-width="2" />
                    <span>استماع</span>
                  </button>
                  <router-link :to="`/lessons/${lesson.id}`" class="btn btn-outline btn-sm" @click="close">
                    عرض التفاصيل
                  </router-link>
                </div>
              </div>
            </div>

            <div v-else-if="searchQuery.trim()" class="no-results">
              <span>لم يتم العثور على دروس تطابق "{{ searchQuery }}"</span>
            </div>

            <div v-else class="search-placeholder">
              <Sparkles :size="18" :stroke-width="2" class="placeholder-icon" />
              <p>يمكنك البحث باسم الدرس، أو موضوعه، أو العلم الشرعي التابع له.</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { Search, X, Play, Sparkles } from 'lucide-vue-next';
import { lessons } from '../data/staticData';
import { useAudioPlayer } from '../composables/useAudioPlayer';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);
const searchQuery = ref('');
const searchInputRef = ref(null);
const { playLesson } = useAudioPlayer();

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (searchInputRef.value) searchInputRef.value.focus();
    });
  }
});

const close = () => {
  emit('close');
};

const filteredLessons = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return [];
  return lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(query) ||
    lesson.description.toLowerCase().includes(query) ||
    lesson.categoryName.toLowerCase().includes(query)
  );
});

const handlePlay = (lesson) => {
  playLesson(lesson);
  close();
};
</script>

<style scoped>
.search-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(12, 19, 17, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 20px;
}

.search-modal {
  width: 100%;
  max-width: 680px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-gold);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.4rem;
  color: var(--primary-emerald);
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-title-icon {
  color: var(--accent-gold);
}

[data-theme="dark"] .modal-title {
  color: var(--accent-gold);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 14px 44px 14px 18px;
  font-size: 1.05rem;
  font-family: var(--font-ui);
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color);
  background: var(--bg-sand);
  color: var(--text-main);
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: var(--accent-gold);
}

.clear-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
}

.search-results {
  overflow-y: auto;
  flex-grow: 1;
  max-height: 400px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-item {
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--bg-sand);
  border: 1px solid var(--border-color);
}

.item-meta {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.lesson-num {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
}

.item-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--primary-emerald);
  text-decoration: none;
  display: block;
  margin-bottom: 6px;
}

[data-theme="dark"] .item-title {
  color: var(--accent-gold);
}

.item-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 0.82rem;
}

.no-results, .search-placeholder {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.placeholder-icon {
  color: var(--accent-gold);
}
</style>
