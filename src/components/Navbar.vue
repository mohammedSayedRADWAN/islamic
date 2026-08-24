<template>
  <header class="navbar-wrapper">
    <div class="container navbar">
      <!-- Logo Brand -->
      <router-link to="/" class="logo-brand">
        <div class="logo-icon">
          <MosqueIcon :size="24" :stroke-width="2" />
        </div>
        <div class="logo-text">
          <span class="logo-title">العلوم الشرعية</span>
          <span class="logo-subtitle">دروس ومحاضرات الشيخ</span>
        </div>
      </router-link>

      <!-- Desktop Navigation Links -->
      <nav class="nav-links desktop-nav">
        <router-link to="/" class="nav-link">الرئيسية</router-link>
        <router-link to="/categories" class="nav-link">الأقسام</router-link>
        <router-link to="/lessons" class="nav-link">جميع الدروس</router-link>
        <router-link to="/bookmarks" class="nav-link bookmark-nav-link">
          <Heart :size="18" :stroke-width="2" class="nav-icon" />
          <span>محفوظاتي</span>
          <span v-if="bookmarkedIds.length > 0" class="nav-badge">{{ bookmarkedIds.length }}</span>
        </router-link>
        <router-link to="/about" class="nav-link">عن الشيخ</router-link>
      </nav>

      <!-- Action Items (Search, Theme, Mobile Toggle) -->
      <div class="nav-actions">
        <!-- Search Trigger Button with shortcut key indicator -->
        <button class="btn btn-outline search-trigger-btn" @click="$emit('open-search')" title="بحث في الدروس (Ctrl + K)">
          <Search :size="18" :stroke-width="2" />
          <span class="search-text desktop-only">بحث...</span>
          <span class="kbd-shortcut desktop-only">Ctrl K</span>
        </button>

        <!-- Theme Switcher -->
        <button class="btn btn-outline btn-icon" @click="toggleTheme" :title="isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'">
          <Sun v-if="isDark" :size="18" :stroke-width="2" />
          <Moon v-else :size="18" :stroke-width="2" />
        </button>

        <!-- Mobile Menu Toggle -->
        <button class="btn btn-outline btn-icon mobile-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
          <X v-if="mobileMenuOpen" :size="20" :stroke-width="2" />
          <Menu v-else :size="20" :stroke-width="2" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <transition name="slide-fade">
      <div v-if="mobileMenuOpen" class="mobile-drawer">
        <nav class="mobile-nav-links">
          <router-link to="/" class="mobile-link" @click="mobileMenuOpen = false">الرئيسية</router-link>
          <router-link to="/categories" class="mobile-link" @click="mobileMenuOpen = false">الأقسام العلمية</router-link>
          <router-link to="/lessons" class="mobile-link" @click="mobileMenuOpen = false">جميع الدروس</router-link>
          <router-link to="/bookmarks" class="mobile-link" @click="mobileMenuOpen = false">
            المحفوظات ({{ bookmarkedIds.length }})
          </router-link>
          <router-link to="/about" class="mobile-link" @click="mobileMenuOpen = false">عن الشيخ</router-link>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Search, Sun, Moon, Menu, X, Heart } from 'lucide-vue-next';
import MosqueIcon from './icons/MosqueIcon.vue';
import { useTheme } from '../composables/useTheme';
import { useBookmarks } from '../composables/useBookmarks';

const emit = defineEmits(['open-search']);
const { isDark, toggleTheme } = useTheme();
const { bookmarkedIds } = useBookmarks();
const mobileMenuOpen = ref(false);

const handleKeyDown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    emit('open-search');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 76px;
}

.logo-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-emerald) 0%, var(--primary-sage) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-gold);
  box-shadow: var(--shadow-sm);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--primary-emerald);
  line-height: 1.2;
}

[data-theme="dark"] .logo-title {
  color: var(--accent-gold);
}

.logo-subtitle {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 22px;
}

.nav-link {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-emerald);
  background: var(--primary-light);
}

[data-theme="dark"] .nav-link:hover,
[data-theme="dark"] .nav-link.router-link-active {
  color: var(--accent-gold);
  background: rgba(212, 175, 55, 0.1);
}

.nav-icon {
  flex-shrink: 0;
}

.nav-badge {
  background: var(--accent-gold);
  color: #0F392B;
  font-size: 0.75rem;
  font-weight: 900;
  padding: 2px 7px;
  border-radius: var(--radius-full);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-trigger-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
}

.kbd-shortcut {
  font-size: 0.72rem;
  background: var(--bg-sand);
  border: 1px solid var(--border-color);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--text-muted);
  font-weight: 700;
}

.mobile-toggle {
  display: none;
}

/* Mobile Drawer */
.mobile-drawer {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 20px;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-link {
  padding: 12px 16px;
  font-weight: 700;
  color: var(--text-main);
  border-radius: var(--radius-sm);
  background: var(--bg-sand);
}

.mobile-link.router-link-active {
  background: var(--primary-emerald);
  color: #FFFFFF;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 860px) {
  .desktop-nav {
    display: none;
  }
  .desktop-only {
    display: none;
  }
  .mobile-toggle {
    display: inline-flex;
  }
}
</style>
