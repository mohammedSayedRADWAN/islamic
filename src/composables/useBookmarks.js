import { ref, watch, onMounted } from 'vue';

const STORAGE_KEY = 'islamic_bookmarks_list';

// Shared Reactive Array for Bookmarked Lesson IDs
const bookmarkedIds = ref([]);

// Initialize from LocalStorage
const loadBookmarks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      bookmarkedIds.value = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load bookmarks from localStorage:', e);
    bookmarkedIds.value = [];
  }
};

// Auto sync changes to localStorage
watch(bookmarkedIds, (newVal) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
  } catch (e) {
    console.error('Failed to save bookmarks to localStorage:', e);
  }
}, { deep: true });

// Load initial bookmarks state
loadBookmarks();

export function useBookmarks() {
  const isBookmarked = (lessonId) => {
    return bookmarkedIds.value.includes(Number(lessonId));
  };

  const toggleBookmark = (lessonId) => {
    const id = Number(lessonId);
    const index = bookmarkedIds.value.indexOf(id);
    if (index > -1) {
      bookmarkedIds.value.splice(index, 1);
    } else {
      bookmarkedIds.value.push(id);
    }
  };

  const clearAllBookmarks = () => {
    bookmarkedIds.value = [];
  };

  const getBookmarkedLessons = (allLessons) => {
    if (!allLessons || !Array.isArray(allLessons)) return [];
    return allLessons.filter(l => bookmarkedIds.value.includes(l.id));
  };

  return {
    bookmarkedIds,
    isBookmarked,
    toggleBookmark,
    clearAllBookmarks,
    getBookmarkedLessons
  };
}
