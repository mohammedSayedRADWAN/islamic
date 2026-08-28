import { ref, watch, onMounted } from 'vue';
import { api } from '../services/api';

const STORAGE_KEY = 'islamic_bookmarks_list';

// Shared Reactive Array for Bookmarked Lesson IDs
const bookmarkedIds = ref([]);
const getToken = () => localStorage.getItem('access_token');

// Initialize from LocalStorage
const loadBookmarks = () => {
  const token = getToken();
  if (token) {
    api.getBookmarks(token)
      .then((bookmarks) => {
        bookmarkedIds.value = bookmarks.map((bookmark) => String(bookmark.lesson?._id || bookmark.lesson));
      })
      .catch((error) => console.warn('Failed to load API bookmarks:', error.message));
    return;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
    bookmarkedIds.value = JSON.parse(saved).map((id) => String(id));
    }
  } catch (e) {
    console.error('Failed to load bookmarks from localStorage:', e);
    bookmarkedIds.value = [];
  }
};

// Auto sync changes to localStorage
watch(bookmarkedIds, (newVal) => {
  if (getToken()) return;
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
    return bookmarkedIds.value.includes(String(lessonId));
  };

  const toggleBookmark = (lessonId) => {
    const id = String(lessonId);
    const index = bookmarkedIds.value.indexOf(id);
    if (index > -1) {
      bookmarkedIds.value.splice(index, 1);
      const token = getToken();
      if (token) api.removeBookmark(id, token).catch((error) => console.warn('Failed to remove API bookmark:', error.message));
    } else {
      bookmarkedIds.value.push(id);
      const token = getToken();
      if (token) api.addBookmark(id, token).catch((error) => console.warn('Failed to save API bookmark:', error.message));
    }
  };

  const clearAllBookmarks = () => {
    const token = getToken();
    if (token) {
      Promise.all(bookmarkedIds.value.map((id) => api.removeBookmark(id, token)))
        .catch((error) => console.warn('Failed to clear API bookmarks:', error.message));
    }
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
