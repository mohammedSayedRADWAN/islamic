import { ref, onMounted } from 'vue';

const isDark = ref(false);

export function useTheme() {
  const initTheme = () => {
    const saved = localStorage.getItem('islamic_theme');
    if (saved) {
      isDark.value = saved === 'dark';
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    applyTheme();
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('islamic_theme', isDark.value ? 'dark' : 'light');
    applyTheme();
  };

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return {
    isDark,
    initTheme,
    toggleTheme
  };
}
