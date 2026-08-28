const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API request failed: ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  getCategories: () => request('/categories'),
  getBooks: () => request('/books'),
  getLessons: () => request('/lessons'),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (user) => request('/auth/register', { method: 'POST', body: JSON.stringify(user) }),
  getBookmarks: (token) => request('/bookmarks', { token }),
  addBookmark: (lessonId, token) => request(`/bookmarks/${lessonId}`, { method: 'POST', token }),
  removeBookmark: (lessonId, token) => request(`/bookmarks/${lessonId}`, { method: 'DELETE', token })
};
