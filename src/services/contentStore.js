import { api } from './api';
import { categories, lessons } from '../data/staticData';

let loadPromise;

function replaceItems(target, items) {
  target.splice(0, target.length, ...items);
}

function normalizeCategories(items, lessonItems) {
  return items.map((category) => ({
    ...category,
    id: category._id,
    count: lessonItems.filter((lesson) => lesson.book?.category?.slug === category.slug).length
  }));
}

function normalizeLessons(items) {
  return items.map((lesson) => ({
    ...lesson,
    id: lesson._id,
    category: lesson.book?.category?.slug || '',
    categoryName: lesson.book?.category?.name || '',
    categoryColor: lesson.book?.category?.color || '',
    bookId: lesson.book?._id || '',
    bookTitle: lesson.book?.title || '',
    date: lesson.publishedAt ? lesson.publishedAt.slice(0, 10) : '',
    duration: formatDuration(lesson.durationSeconds),
    featured: lesson.isFeatured,
    badgeClass: `badge-${lesson.book?.category?.slug || 'fiqh'}`
  }));
}

function formatDuration(seconds = 0) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

export function loadContent() {
  if (!loadPromise) {
    loadPromise = Promise.all([api.getCategories(), api.getLessons()])
      .then(([categoryItems, lessonItems]) => {
        const normalizedLessons = normalizeLessons(lessonItems);
        replaceItems(lessons, normalizedLessons);
        replaceItems(categories, normalizeCategories(categoryItems, lessonItems));
        return { categories, lessons };
      })
      .catch((error) => {
        loadPromise = undefined;
        console.warn('API unavailable; using local fallback content:', error.message);
        return { categories, lessons };
      });
  }

  return loadPromise;
}
