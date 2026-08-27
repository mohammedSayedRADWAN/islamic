<template>
  <footer class="footer-wrapper">
    <div class="container footer-grid">
      <!-- Sheikh Info & Bio -->
      <div class="footer-col brand-col">
        <div class="footer-logo">
          <MosqueIcon :size="24" :stroke-width="2" class="footer-logo-icon" />
          <span class="font-heading logo-name">منصة العلوم الشرعية</span>
        </div>
        <p class="footer-bio">
          موقع تعليمي إسلامي منظم يهدف لنشر الدروس والمحاضرات الصوتية للشيخ في مختلف العلوم الشرعية (الفقه، الحديث، التفسير، التوحيد) لطلاب العلم والراغبين في تعلم الفقه الإسلامي.
        </p>
      </div>

      <!-- Quick Navigation -->
      <div class="footer-col">
        <h4 class="footer-title">روابط السريعة</h4>
        <ul class="footer-links">
          <li><router-link to="/">الرئيسية</router-link></li>
          <li><router-link to="/categories">الأقسام العلمية</router-link></li>
          <li><router-link to="/lessons">مكتبة الدروس</router-link></li>
          <li><router-link to="/about">عن الشيخ ومؤلفاته</router-link></li>
        </ul>
      </div>

      <!-- Categories Links -->
      <div class="footer-col">
        <h4 class="footer-title">العلوم الشرعية</h4>
        <ul class="footer-links icon-links">
          <li>
            <router-link to="/categories/fiqh">
              <BookOpen :size="16" :stroke-width="2" />
              <span>علم الفقه والأحكام</span>
            </router-link>
          </li>
          <li>
            <router-link to="/categories/hadith">
              <Scroll :size="16" :stroke-width="2" />
              <span>الحديث وعلوم السنة</span>
            </router-link>
          </li>
          <li>
            <router-link to="/categories/tafsir">
              <Library :size="16" :stroke-width="2" />
              <span>تفسير القرآن الكريم</span>
            </router-link>
          </li>
          <li>
            <router-link to="/categories/tawheed">
              <TawheedIcon :size="16" :stroke-width="2" />
              <span>العقيدة والتوحيد</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Contact & Socials -->
      <div class="footer-col">
        <h4 class="footer-title">تواصل ومتابعة</h4>
        <p class="social-text">تابع جديد الدروس والمحاضرات عبر المنصات التالية:</p>
        <div class="social-icons">
          <a href="https://youtube.com/channel/UCFhHh9-lsLKolez3pKnGC0w?si=igS9oLARFFUUh5w9" target="_blank" class="social-btn" title="يوتيوب">
            <Youtube :size="18" :stroke-width="2" />
          </a>
          <a href="https://t.me/omar_elarby" target="_blank" class="social-btn" title="تيليجرام">
            <Send :size="18" :stroke-width="2" />
          </a>
          
          <a href="#" class="social-btn" title="واتساب">
            <MessageCircle :size="18" :stroke-width="2" />
          </a>
        </div>
      </div>
    </div>

    <!-- Sub-footer copyright -->
    <div class="sub-footer">
      <div class="container sub-footer-content">
        <p>جميع الحقوق محفوظة © {{ currentYear }} - منصة العلوم الشرعية</p>
        <p class="tagline">«من سلك طريقاً يبتغي فيه علماً سهّل الله له به طريقاً إلى الجنة»</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { BookOpen, Scroll, Library, Youtube, Send, Twitter, MessageCircle } from 'lucide-vue-next';
import MosqueIcon from './icons/MosqueIcon.vue';
import TawheedIcon from './icons/TawheedIcon.vue';

const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer-wrapper {
  background: var(--primary-emerald);
  color: #E2E8F0;
  margin-top: auto;
  border-top: 3px solid var(--accent-gold);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  padding: 60px 20px 40px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  margin-bottom: 16px;
}

.footer-logo-icon {
  color: var(--accent-gold);
}

.logo-name {
  color: var(--accent-gold);
}

.footer-bio {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #CBD5E1;
}

.footer-title {
  font-size: 1.15rem;
  color: var(--accent-gold);
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 8px;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 2px;
  background: var(--accent-gold);
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links.icon-links a {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-links a {
  color: #CBD5E1;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.footer-links a:hover {
  color: var(--accent-gold);
  padding-right: 6px;
}

.social-text {
  font-size: 0.9rem;
  margin-bottom: 16px;
  color: #CBD5E1;
}

.social-icons {
  display: flex;
  gap: 12px;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  text-decoration: none;
  transition: all 0.25s ease;
}

.social-btn:hover {
  background: var(--accent-gold);
  color: #0F392B;
  transform: translateY(-3px);
}

.sub-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  padding: 18px 0;
  font-size: 0.88rem;
  color: #94A3B8;
}

.sub-footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tagline {
  font-family: var(--font-heading);
  color: var(--accent-gold);
  font-size: 1.05rem;
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .sub-footer-content {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
