# Front-End to Database Entity Mapping

This document maps every front-end feature, page, and component to the database tables and fields they require.

---

## Page-Level Mapping

### Home Page (`/` — `Home.vue`)

| Section | Component | Required Tables | Key Fields | Query Pattern |
|---|---|---|---|---|
| Hero Section | `HeroSection.vue` | `sheikhs` | `name`, `title`, `avatar_url`, `total_audio_hours` | `SELECT * FROM sheikhs LIMIT 1` |
| Hero Stats | `HeroSection.vue` | `sheikhs`, `categories`, `lessons` | Aggregate: `COUNT(lessons)`, `COUNT(categories)` | `SELECT COUNT(*) FROM lessons; SELECT COUNT(*) FROM categories` |
| Categories Grid | `CategoryCard.vue` | `categories` | `id`, `name`, `slug`, `description`, `icon`, `color` | `SELECT * FROM categories ORDER BY sort_order` |
| Categories Count | `CategoryCard.vue` | `lessons` | `COUNT(*) GROUP BY category_id` | Subquery or JOIN for lesson count per category |
| Featured Lesson | `FeaturedLesson.vue` | `lessons`, `categories` | `title`, `description`, `duration`, `audio_url`, `is_featured`, `lesson_number`, category `name` | `SELECT l.*, c.name FROM lessons l JOIN categories c ON l.category_id = c.id WHERE l.is_featured = TRUE ORDER BY l.published_date DESC LIMIT 1` |
| Latest Lessons | `LessonCard.vue` | `lessons`, `categories`, `bookmarks` | All lesson fields, category `name`, bookmark status | `SELECT l.*, c.name FROM lessons l JOIN categories c ON l.category_id = c.id ORDER BY l.published_date DESC LIMIT 6` |
| Quote Banner | (static) | None | — | Hardcoded content, no DB needed |

---

### Categories Page (`/categories` — `Categories.vue`)

| Section | Component | Required Tables | Key Fields | Query Pattern |
|---|---|---|---|---|
| Categories Grid | `CategoryCard.vue` | `categories`, `lessons` | All category fields + lesson count | `SELECT c.*, COUNT(l.id) as lesson_count FROM categories c LEFT JOIN lessons l ON c.id = l.category_id GROUP BY c.id ORDER BY c.sort_order` |

---

### Category Details Page (`/categories/:slug` — `CategoryDetails.vue`)

| Section | Component | Required Tables | Key Fields | Query Pattern |
|---|---|---|---|---|
| Category Banner | — | `categories` | `name`, `slug`, `description`, `color`, `icon` | `SELECT * FROM categories WHERE slug = :slug` |
| Lesson Count | — | `lessons` | `COUNT(*)` | `SELECT COUNT(*) FROM lessons WHERE category_id = :category_id` |
| Lessons Grid (sorted) | `LessonCard.vue` | `lessons`, `categories`, `bookmarks` | All lesson fields | `SELECT * FROM lessons WHERE category_id = :id ORDER BY [sort_field]` |
| Sort Controls | — | — | — | `ORDER BY published_date DESC/ASC` or `ORDER BY lesson_number ASC` |

---

### Lessons Page (`/lessons` — `Lessons.vue`)

| Section | Component | Required Tables | Key Fields | Query Pattern |
|---|---|---|---|---|
| Category Filter | `CategoryFilter.vue` | `categories` | `name`, `slug` | `SELECT id, name, slug FROM categories ORDER BY sort_order` |
| Duration Filter | `CategoryFilter.vue` | `lessons` | `duration_seconds` | `WHERE duration_seconds < 2100 / BETWEEN 2100 AND 2700 / > 2700` |
| Sort Controls | `CategoryFilter.vue` | — | — | `ORDER BY published_date DESC/ASC` or `ORDER BY lesson_number` |
| Lessons Grid | `LessonCard.vue` | `lessons`, `categories`, `bookmarks` | All lesson fields, category `name` | Combined filters + sorting + optional pagination |

**Full Query Example:**
```sql
SELECT l.*, c.name as category_name, c.slug as category_slug
FROM lessons l
JOIN categories c ON l.category_id = c.id
WHERE (:category = 'all' OR c.slug = :category)
  AND (:duration = 'all' 
       OR (:duration = 'short' AND l.duration_seconds < 2100)
       OR (:duration = 'medium' AND l.duration_seconds BETWEEN 2100 AND 2700)
       OR (:duration = 'long' AND l.duration_seconds > 2700))
ORDER BY 
  CASE WHEN :sort = 'newest' THEN l.published_date END DESC,
  CASE WHEN :sort = 'oldest' THEN l.published_date END ASC,
  CASE WHEN :sort = 'number' THEN l.lesson_number END ASC
```

---

### Lesson Details Page (`/lessons/:id` — `LessonDetails.vue`)

| Section | Component | Required Tables | Key Fields | Query Pattern |
|---|---|---|---|---|
| Lesson Meta | — | `lessons`, `categories` | `title`, `lesson_number`, `published_date`, `duration`, category `name` | `SELECT l.*, c.name, c.slug FROM lessons l JOIN categories c ON l.category_id = c.id WHERE l.id = :id` |
| Sheikh Attribution | — | `sheikhs` | `name` | `SELECT name FROM sheikhs WHERE id = :sheikh_id` |
| Audio Player | — | `lessons` | `audio_url`, `duration` | Included in main lesson query |
| Download Link | — | `lessons` | `audio_url` | Included in main lesson query |
| Bookmark Toggle | — | `bookmarks` | `user_id`, `lesson_id` | `SELECT COUNT(*) FROM bookmarks WHERE user_id = :uid AND lesson_id = :lid` |
| Lesson Description | — | `lessons` | `description` | Included in main lesson query |
| Prev/Next Nav | — | `lessons` | `id`, `title`, `category_id`, `lesson_number` | `SELECT * FROM lessons WHERE category_id = :cat_id AND lesson_number = :n-1 / :n+1` |

---

### Bookmarks Page (`/bookmarks` — `Bookmarks.vue`)

| Section | Component | Required Tables | Key Fields | Query Pattern |
|---|---|---|---|---|
| Bookmarked Lessons | `LessonCard.vue` | `bookmarks`, `lessons`, `categories` | All lesson fields + category name | `SELECT l.*, c.name FROM bookmarks b JOIN lessons l ON b.lesson_id = l.id JOIN categories c ON l.category_id = c.id WHERE b.user_id = :uid ORDER BY b.created_at DESC` |
| Bookmark Count | — | `bookmarks` | `COUNT(*)` | `SELECT COUNT(*) FROM bookmarks WHERE user_id = :uid` |
| Clear All | — | `bookmarks` | — | `DELETE FROM bookmarks WHERE user_id = :uid` |

---

### About Page (`/about` — `About.vue`)

| Section | Component | Required Tables | Key Fields | Query Pattern |
|---|---|---|---|---|
| Sheikh Profile | — | `sheikhs` | `name`, `title`, `bio`, `avatar_url` | `SELECT * FROM sheikhs WHERE id = :id` |
| Social Links | — | `sheikh_socials` | `platform`, `url` | `SELECT * FROM sheikh_socials WHERE sheikh_id = :id ORDER BY sort_order` |
| Qualifications | — | `sheikh_qualifications` | `qualification` | `SELECT * FROM sheikh_qualifications WHERE sheikh_id = :id ORDER BY sort_order` |
| Books Taught | — | `sheikh_books` | `book_title` | `SELECT * FROM sheikh_books WHERE sheikh_id = :id ORDER BY sort_order` |
| Teaching Method | — | `sheikhs` | `teaching_methodology` | Included in sheikh query |

---

## Global Component Mapping

### Navbar (`Navbar.vue`)

| Feature | Required Tables | Query Pattern |
|---|---|---|
| Bookmark count badge | `bookmarks` | `SELECT COUNT(*) FROM bookmarks WHERE user_id = :uid` |
| Navigation links | None | Static routes |
| Theme toggle | `users` (optional) | `UPDATE users SET theme_preference = :pref WHERE id = :uid` |

### Search Modal (`SearchBar.vue`)

| Feature | Required Tables | Key Fields | Query Pattern |
|---|---|---|---|
| Full-text search | `lessons`, `categories` | `title`, `description`, category `name` | `SELECT l.*, c.name FROM lessons l JOIN categories c ON l.category_id = c.id WHERE l.title LIKE '%:q%' OR l.description LIKE '%:q%' OR c.name LIKE '%:q%'` |
| Play from search | `lessons` | `audio_url` | Included in search results |

### Audio Player (`AudioPlayer.vue`)

| Feature | Required Tables | Key Fields | Query Pattern |
|---|---|---|---|
| Display current lesson | `lessons`, `categories` | `title`, `lesson_number`, `audio_url`, category `name` | Data already loaded from lesson query, no additional DB call |

### Footer (`Footer.vue`)

| Feature | Required Tables | Query Pattern |
|---|---|---|
| Category links | `categories` | `SELECT slug, name FROM categories ORDER BY sort_order` |
| Social media links | `sheikh_socials` | `SELECT platform, url FROM sheikh_socials ORDER BY sort_order` |

---

## CRUD Operations Summary

| Operation | Entity | Front-end Trigger | Proposed API |
|---|---|---|---|
| **Read** all categories | `categories` | Categories page, filter pills, footer, home | `GET /api/categories` |
| **Read** category by slug | `categories` | Category details page | `GET /api/categories/:slug` |
| **Read** all lessons (with filters) | `lessons` | Lessons page, search | `GET /api/lessons?category=&duration=&sort=&page=` |
| **Read** lessons by category | `lessons` | Category details page | `GET /api/lessons?category=:slug` |
| **Read** lesson by id | `lessons` | Lesson details page | `GET /api/lessons/:id` |
| **Read** featured lesson | `lessons` | Home page | `GET /api/lessons/featured` |
| **Read** sheikh profile | `sheikhs` + children | About page, hero, footer | `GET /api/sheikh/:id` |
| **Create** bookmark | `bookmarks` | Heart icon click | `POST /api/bookmarks { lesson_id }` |
| **Delete** bookmark | `bookmarks` | Heart icon click (toggle) | `DELETE /api/bookmarks/:lesson_id` |
| **Delete** all bookmarks | `bookmarks` | Clear all button | `DELETE /api/bookmarks` |
| **Read** user bookmarks | `bookmarks` | Bookmarks page, navbar badge | `GET /api/bookmarks` |
| **Create/Read/Update** user | `users` | Auth flow (future) | `POST /api/auth/register`, `POST /api/auth/login` |
| **Create/Update/Delete** lesson | `lessons` | Admin panel (future) | `POST/PUT/DELETE /api/admin/lessons` |
| **Create/Update/Delete** category | `categories` | Admin panel (future) | `POST/PUT/DELETE /api/admin/categories` |
