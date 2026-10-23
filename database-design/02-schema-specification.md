# Database Schema Specification

## Recommended Database Type

**Recommendation: SQL (Relational Database — PostgreSQL or MySQL)**

**Rationale:**
1. The data model is inherently relational — lessons belong to categories, bookmarks relate users to lessons, qualifications belong to a sheikh profile.
2. The front-end relies heavily on filtering, sorting, and category-based grouping — operations that are natural and efficient in SQL.
3. The data is structured and consistent; there is no evidence of schema-less or highly nested/variable data.
4. The dataset is modest in scale (tens to hundreds of lessons, a few categories), so a lightweight relational DB is perfectly suited.
5. No existing database technology is specified in the project.

> If the project needs to remain very lightweight (e.g., single-file deployment), SQLite is also an excellent option with the same relational schema.

---

## Table Definitions

### 1. `sheikhs`

The sheikh/instructor profile. Although the current site features a single sheikh, the schema supports multiple instructors for future scalability.

| Column | Data Type | Constraints | Default | Nullable | Description |
|---|---|---|---|---|---|
| `id` | `INT` / `SERIAL` | `PRIMARY KEY`, `AUTO_INCREMENT` | — | NO | Unique sheikh identifier |
| `name` | `VARCHAR(255)` | `NOT NULL` | — | NO | Full name (Arabic): الشيخ د. عمر العربي |
| `title` | `VARCHAR(255)` | `NOT NULL` | — | NO | Academic/religious title |
| `bio` | `TEXT` | — | — | YES | Extended biography text |
| `avatar_url` | `VARCHAR(500)` | — | `NULL` | YES | URL or path to profile image |
| `teaching_methodology` | `TEXT` | — | `NULL` | YES | Description of teaching approach |
| `total_audio_hours` | `VARCHAR(50)` | — | `NULL` | YES | Display string for total hours (e.g., "48 ساعة صوتية") |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | NO | Record creation timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP ON UPDATE` | NO | Last update timestamp |

---

### 2. `sheikh_qualifications`

Academic qualifications and roles for a sheikh. One-to-many relationship with `sheikhs`.

| Column | Data Type | Constraints | Default | Nullable | Description |
|---|---|---|---|---|---|
| `id` | `INT` / `SERIAL` | `PRIMARY KEY`, `AUTO_INCREMENT` | — | NO | Unique identifier |
| `sheikh_id` | `INT` | `NOT NULL`, `FOREIGN KEY → sheikhs(id) ON DELETE CASCADE` | — | NO | Parent sheikh |
| `qualification` | `VARCHAR(500)` | `NOT NULL` | — | NO | Qualification text (e.g., "بكالوريوس تربيه ازهر") |
| `sort_order` | `INT` | `NOT NULL` | `0` | NO | Display ordering |

---

### 3. `sheikh_books`

Books and texts taught/explained by the sheikh. One-to-many with `sheikhs`.

| Column | Data Type | Constraints | Default | Nullable | Description |
|---|---|---|---|---|---|
| `id` | `INT` / `SERIAL` | `PRIMARY KEY`, `AUTO_INCREMENT` | — | NO | Unique identifier |
| `sheikh_id` | `INT` | `NOT NULL`, `FOREIGN KEY → sheikhs(id) ON DELETE CASCADE` | — | NO | Parent sheikh |
| `book_title` | `VARCHAR(500)` | `NOT NULL` | — | NO | Book/text title (e.g., "شرح الأربعين النووية") |
| `sort_order` | `INT` | `NOT NULL` | `0` | NO | Display ordering |

---

### 4. `sheikh_socials`

Social media links for a sheikh. One-to-many with `sheikhs`.

| Column | Data Type | Constraints | Default | Nullable | Description |
|---|---|---|---|---|---|
| `id` | `INT` / `SERIAL` | `PRIMARY KEY`, `AUTO_INCREMENT` | — | NO | Unique identifier |
| `sheikh_id` | `INT` | `NOT NULL`, `FOREIGN KEY → sheikhs(id) ON DELETE CASCADE` | — | NO | Parent sheikh |
| `platform` | `VARCHAR(50)` | `NOT NULL` | — | NO | Platform name (youtube, telegram, twitter, whatsapp) |
| `url` | `VARCHAR(500)` | `NOT NULL` | — | NO | Full URL to profile/channel |
| `sort_order` | `INT` | `NOT NULL` | `0` | NO | Display ordering |

**Unique Constraint:** `UNIQUE(sheikh_id, platform)` — one link per platform per sheikh.

---

### 5. `categories`

Islamic science categories that group lessons.

| Column | Data Type | Constraints | Default | Nullable | Description |
|---|---|---|---|---|---|
| `id` | `INT` / `SERIAL` | `PRIMARY KEY`, `AUTO_INCREMENT` | — | NO | Unique category identifier |
| `name` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | — | NO | Arabic name (e.g., "الفقه") |
| `slug` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | — | NO | URL-friendly identifier (e.g., "fiqh") |
| `description` | `TEXT` | — | — | YES | Category description in Arabic |
| `icon` | `VARCHAR(10)` | — | `NULL` | YES | Emoji icon representation (e.g., "📖") |
| `color` | `VARCHAR(7)` | — | `NULL` | YES | Hex color code (e.g., "#2E7D32") |
| `sort_order` | `INT` | `NOT NULL` | `0` | NO | Display ordering |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | NO | Record creation timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP ON UPDATE` | NO | Last update timestamp |

> **Note:** The `count` field from static data is deliberately omitted. Lesson count per category should be **computed** via `COUNT(*)` aggregate query on `lessons` to avoid data inconsistency.

> **Note:** The `badgeClass` field is omitted. CSS badge class is a front-end presentation concern and can be derived from the `slug` (e.g., `badge-${slug}`).

---

### 6. `lessons`

Individual audio lessons/lectures.

| Column | Data Type | Constraints | Default | Nullable | Description |
|---|---|---|---|---|---|
| `id` | `INT` / `SERIAL` | `PRIMARY KEY`, `AUTO_INCREMENT` | — | NO | Unique lesson identifier |
| `category_id` | `INT` | `NOT NULL`, `FOREIGN KEY → categories(id) ON DELETE RESTRICT` | — | NO | Parent category |
| `sheikh_id` | `INT` | `NOT NULL`, `FOREIGN KEY → sheikhs(id) ON DELETE RESTRICT` | — | NO | Instructor who delivered the lesson |
| `title` | `VARCHAR(500)` | `NOT NULL` | — | NO | Full lesson title in Arabic |
| `description` | `TEXT` | — | — | YES | Lesson summary/description |
| `lesson_number` | `INT` | `NOT NULL` | — | NO | Sequential number within the category |
| `duration` | `VARCHAR(10)` | `NOT NULL` | — | NO | Duration string (e.g., "45:30") |
| `duration_seconds` | `INT` | — | `NULL` | YES | Duration in seconds for filtering/sorting |
| `audio_url` | `VARCHAR(1000)` | `NOT NULL` | — | NO | URL to the audio file |
| `is_featured` | `BOOLEAN` | `NOT NULL` | `FALSE` | NO | Whether this lesson is featured |
| `published_date` | `DATE` | `NOT NULL` | — | NO | Publication/recording date |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | NO | Record creation timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP ON UPDATE` | NO | Last update timestamp |

**Unique Constraint:** `UNIQUE(category_id, lesson_number)` — no duplicate lesson numbers within a category.

**Indexes:**
- `INDEX idx_lessons_category (category_id)` — for category filtering.
- `INDEX idx_lessons_published_date (published_date)` — for date sorting.
- `INDEX idx_lessons_is_featured (is_featured)` — for featured lesson queries.
- `INDEX idx_lessons_sheikh (sheikh_id)` — for sheikh-based queries.
- `FULLTEXT INDEX idx_lessons_search (title, description)` — for search functionality (MySQL) or use `tsvector` (PostgreSQL).

> **Design Decision:** `duration` is stored as both a display string (`duration` VARCHAR) and a computed integer (`duration_seconds` INT). The string preserves the original format for display, while the integer enables efficient range filtering (short/medium/long). The `duration_seconds` value can be computed on insert/update.

> **Note:** `badgeClass` and `categoryName` from static data are omitted. These are derivable by JOINing with the `categories` table and computing the badge class from the slug.

---

### 7. `users`

User accounts for authentication and bookmark persistence.

> **Assumption:** This table does not exist in the current front-end. It is proposed because bookmarks currently live in localStorage and would need user accounts to persist server-side.

| Column | Data Type | Constraints | Default | Nullable | Description |
|---|---|---|---|---|---|
| `id` | `INT` / `SERIAL` | `PRIMARY KEY`, `AUTO_INCREMENT` | — | NO | Unique user identifier |
| `email` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE` | — | NO | User email address |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | — | NO | Hashed password (bcrypt/argon2) |
| `display_name` | `VARCHAR(100)` | — | `NULL` | YES | User's display name |
| `role` | `ENUM('user','admin')` | `NOT NULL` | `'user'` | NO | User role for authorization |
| `theme_preference` | `ENUM('light','dark','system')` | `NOT NULL` | `'system'` | NO | Preferred UI theme |
| `is_active` | `BOOLEAN` | `NOT NULL` | `TRUE` | NO | Account active status |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | NO | Registration timestamp |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP ON UPDATE` | NO | Last update timestamp |
| `last_login_at` | `TIMESTAMP` | — | `NULL` | YES | Last successful login |

**Indexes:**
- `UNIQUE INDEX idx_users_email (email)` — for login lookup.

---

### 8. `bookmarks`

User's saved/favorited lessons. Many-to-many junction table between `users` and `lessons`.

| Column | Data Type | Constraints | Default | Nullable | Description |
|---|---|---|---|---|---|
| `id` | `INT` / `SERIAL` | `PRIMARY KEY`, `AUTO_INCREMENT` | — | NO | Unique bookmark identifier |
| `user_id` | `INT` | `NOT NULL`, `FOREIGN KEY → users(id) ON DELETE CASCADE` | — | NO | The user who bookmarked |
| `lesson_id` | `INT` | `NOT NULL`, `FOREIGN KEY → lessons(id) ON DELETE CASCADE` | — | NO | The bookmarked lesson |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | NO | When the bookmark was created |

**Unique Constraint:** `UNIQUE(user_id, lesson_id)` — prevent duplicate bookmarks.

**Indexes:**
- `INDEX idx_bookmarks_user (user_id)` — for fetching a user's bookmarks.
- `INDEX idx_bookmarks_lesson (lesson_id)` — for checking if a lesson is bookmarked.

---

## Summary Table Count

| # | Table Name | Purpose | Row Estimate |
|---|---|---|---|
| 1 | `sheikhs` | Instructor profiles | 1 (single sheikh currently) |
| 2 | `sheikh_qualifications` | Academic credentials | ~5 per sheikh |
| 3 | `sheikh_books` | Books taught | ~4 per sheikh |
| 4 | `sheikh_socials` | Social media links | ~4 per sheikh |
| 5 | `categories` | Islamic science sections | 4 |
| 6 | `lessons` | Audio lectures | 12 currently, grows over time |
| 7 | `users` | User accounts | Scales with audience |
| 8 | `bookmarks` | User favorites (junction) | Scales with users × lessons |

**Total Tables: 8**
