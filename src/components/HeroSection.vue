<template>
  <section class="hero-section hero-gradient">
    <div class="container hero-container">
      <!-- Text Info -->
      <div class="hero-content">
        <div class="welcome-badge hero-stagger">
          <Sparkles :size="15" :stroke-width="2" class="badge-icon" />
          <span>أهلاً بكم في منصة دروس الشيخ</span>
        </div>

        <h1 class="hero-title hero-stagger delay-1">
          العلوم الشرعية والدروس العلمية
        </h1>

        <p class="hero-subtitle hero-stagger delay-2">
          مكتبة صوتية منظمة تجمع دروس المحاضرات الشرعية في الفقه، الحديث، التفسير والتوحيد لطلاب العلم بأعلى جودة واستماع مباشر.
        </p>

        <!-- Stat Badges -->
        <div class="hero-stats hero-stagger delay-3">
          <div class="stat-item">
            <span class="stat-num">{{ sheikhInfo.totalLessons }}</span>
            <span class="stat-label">درس صوتي</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">{{ sheikhInfo.totalCategories }}</span>
            <span class="stat-label">أقسام علمية</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">{{ sheikhInfo.totalHours }}</span>
            <span class="stat-label">محتوى صوتي</span>
          </div>
        </div>

        <!-- Buttons CTA -->
        <div class="hero-cta hero-stagger delay-4">
          <router-link to="/lessons" class="btn btn-gold">
            <Headphones :size="18" :stroke-width="2" />
            <span>استمع إلى الدروس</span>
          </router-link>
          <router-link to="/about" class="btn btn-outline hero-btn-outline">
            <BookOpen :size="18" :stroke-width="2" />
            <span>عن الشيخ والمؤلفات</span>
          </router-link>
        </div>
      </div>

      <!-- Sheikh Profile Card -->
      <div class="hero-avatar-card hero-stagger delay-4">
        <div class="avatar-frame">
          <img :src="avatarImg" alt="الشيخ د. عمر العربي" class="avatar-img" />
        </div>
        <div class="sheikh-card-meta">
          <h3 class="sheikh-name">{{ sheikhInfo.name }}</h3>
          <p class="sheikh-role">{{ sheikhInfo.title }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Sparkles, Headphones, BookOpen } from 'lucide-vue-next';
import { sheikhInfo } from '../data/staticData';
import avatarImg from '../assets/portofolio.jpeg';
</script>

<style scoped>
.hero-section {
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.hero-container {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  align-items: center;
  gap: 50px;
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: var(--radius-full);
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid var(--accent-gold);
  color: var(--accent-gold);
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 2.8rem;
  color: #FFFFFF;
  line-height: 1.2;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: #E2E8F0;
  line-height: 1.8;
  margin-bottom: 32px;
  max-width: 580px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  background: rgba(255, 255, 255, 0.08);
  padding: 16px 28px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.12);
  margin-bottom: 36px;
  width: fit-content;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--accent-gold);
}

.stat-label {
  font-size: 0.85rem;
  color: #CBD5E1;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
}

.hero-cta {
  display: flex;
  gap: 16px;
}

.hero-btn-outline {
  border-color: rgba(255, 255, 255, 0.4);
  color: #FFFFFF;
}

.hero-btn-outline:hover {
  background: rgba(255, 255, 255, 0.15);
  color: var(--accent-gold);
}

/* Sheikh Profile Graphic */
.hero-avatar-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-lg);
  padding: 36px;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-lg);
  text-align: center;
  animation: heroFadeUp 500ms var(--ease-out-expo) forwards, floatGentle 4s ease-in-out infinite 600ms;
}

.avatar-frame {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 4px solid var(--accent-gold);
  padding: 6px;
  margin-bottom: 20px;
  background: rgba(212, 175, 55, 0.15);
  box-shadow: var(--shadow-gold);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.sheikh-name {
  color: var(--accent-gold);
  font-size: 1.4rem;
  margin-bottom: 6px;
}

.sheikh-role {
  color: #E2E8F0;
  font-size: 0.95rem;
}

@media (max-width: 900px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-subtitle {
    margin: 0 auto 32px;
  }
  .hero-stats {
    margin: 0 auto 36px;
  }
  .hero-cta {
    justify-content: center;
  }
}
</style>
