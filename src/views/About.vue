<template>
  <div class="about-page page-padding">
    <div class="container">
      
      <!-- Sheikh Hero Card -->
      <div class="about-hero hero-gradient">
        <div class="avatar-frame">
          <div class="avatar-placeholder font-heading">
            الشيخ عمر العربي
          </div>
        </div>

        <div class="sheikh-info-col">
          <span class="badge badge-gold">السيرة الذاتية والعلمية</span>
          <h1 class="sheikh-name font-heading">{{ sheikhInfo.name }}</h1>
          <p class="sheikh-title">{{ sheikhInfo.title }}</p>
          <p class="sheikh-bio">{{ sheikhInfo.bio }}</p>

          <div class="socials-row">
            <a :href="sheikhInfo.socials.youtube" target="_blank" class="social-badge">
              <Youtube :size="16" :stroke-width="2" />
              <span>قناة اليوتيوب</span>
            </a>
            <a :href="sheikhInfo.socials.telegram" target="_blank" class="social-badge">
              <Send :size="16" :stroke-width="2" />
              <span>قناة التليجرام</span>
            </a>
            <a :href="sheikhInfo.socials.twitter" target="_blank" class="social-badge">
              <Twitter :size="16" :stroke-width="2" />
              <span>منصة إكس</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Qualifications & Books Grid -->
      <div class="details-grid">
        <!-- Qualifications Card -->
        <div class="detail-card glass-card">
          <h3 class="card-title font-heading">
            <GraduationCap :size="22" :stroke-width="2" class="title-icon" />
            <span>المؤهلات والأعمال العلمية</span>
          </h3>
          <ul class="check-list">
            <li v-for="(item, i) in sheikhInfo.qualifications" :key="i">
              <Check :size="16" :stroke-width="2" class="check-icon" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- Books Taught Card -->
        <div class="detail-card glass-card">
          <h3 class="card-title font-heading">
            <BookOpen :size="22" :stroke-width="2" class="title-icon" />
            <span>العلوم والمتون المشروحة</span>
          </h3>
          <ul class="check-list">
            <li v-for="(book, i) in sheikhInfo.booksTaught" :key="i">
              <BookOpen :size="16" :stroke-width="2" class="check-icon" />
              <span>{{ book }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Teaching Methodology Banner -->
      <div class="methodology-card glass-card">
        <h3 class="card-title font-heading">
          <span>منهج الشيخ في التدريس والتعليم</span>
        </h3>
        <p class="method-text">
          يعتمد الشيخ في دروشه على المنهج العلمي التأصيلي القائم على ربط المسائل الشرعية بالدليل من الكتاب والسنة وفهم السلف الصالح، مع الحرص على التيسير والوضوح لطلاب العلم والرد على التساؤلات المعاصرة بأسلوب علمي رصين.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Youtube, Send, Twitter, GraduationCap, BookOpen, Check, Sparkles } from 'lucide-vue-next';
import { sheikhInfo } from '../data/staticData';
</script>

<style scoped>
.page-padding {
  padding: 60px 0 80px;
}

.about-hero {
  border-radius: var(--radius-lg);
  padding: 48px;
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 40px;
  border: 1px solid var(--border-gold);
  box-shadow: var(--shadow-lg);
}

.avatar-frame {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 4px solid var(--accent-gold);
  padding: 6px;
  background: rgba(212, 175, 55, 0.2);
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #0F392B 0%, #1E5645 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-gold);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.sheikh-info-col {
  color: #FFFFFF;
}

.badge-gold {
  background: rgba(212, 175, 55, 0.2);
  color: var(--accent-gold);
  border: 1px solid var(--accent-gold);
  margin-bottom: 12px;
}

.sheikh-name {
  font-size: 2.4rem;
  color: #FFFFFF;
  margin-bottom: 6px;
}

.sheikh-title {
  font-size: 1.1rem;
  color: var(--accent-gold);
  margin-bottom: 16px;
  font-weight: 700;
}

.sheikh-bio {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #CBD5E1;
  margin-bottom: 24px;
}

.socials-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.social-badge {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.social-badge:hover {
  background: var(--accent-gold);
  color: #0F392B;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 40px;
}

.detail-card {
  padding: 32px;
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: var(--primary-emerald);
  display: flex;
  align-items: center;
  gap: 8px;
}

[data-theme="dark"] .card-title {
  color: var(--accent-gold);
}

.check-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.check-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.check-icon {
  color: var(--accent-gold);
  flex-shrink: 0;
  margin-top: 4px;
}

.methodology-card {
  padding: 36px;
}

.method-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .about-hero {
    flex-direction: column;
    text-align: center;
    padding: 28px;
  }
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
