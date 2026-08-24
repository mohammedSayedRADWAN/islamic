<template>
  <div id="app-root">
    <!-- Navbar Header -->
    <Navbar @open-search="isSearchOpen = true" />

    <!-- Main View Content with Smooth Route Transition -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Global Persistent Audio Player -->
    <AudioPlayer />

    <!-- Live Search Modal -->
    <SearchBar :isOpen="isSearchOpen" @close="isSearchOpen = false" />

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import AudioPlayer from './components/AudioPlayer.vue';
import SearchBar from './components/SearchBar.vue';
import { useTheme } from './composables/useTheme';

const isSearchOpen = ref(false);
const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>

<style scoped>
#app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  /* Reserve space so sticky audio player doesn't obscure content */
  padding-bottom: 90px;
}
</style>
