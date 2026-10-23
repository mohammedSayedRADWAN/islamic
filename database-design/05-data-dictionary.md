# Data Dictionary

Complete reference of every field in the database schema, organized by table.

---

## Table: `sheikhs`

**Purpose:** Stores instructor/sheikh profile information displayed on the About page and Hero section.

| # | Field | Type | PK | FK | Unique | Not Null | Default | Description |
|---|---|---|---|---|---|---|---|---|
| 1 | `id` | `INT AUTO_INCREMENT` | ✅ | — | ✅ | ✅ | Auto | Primary key |
| 2 | `name` | `VARCHAR(255)` | — | — | — | ✅ | — | Full name in Arabic (e.g., "الشيخ د. عمر العربي") |
| 3 | `title` | `VARCHAR(255)` | — | — | — | ✅ | — | Academic/religious title (e.g., "أستاذ الفقه والسياسة الشرعية") |
| 4 | `bio` | `TEXT` | — | — | — | — | `NULL` | Extended biography paragraph |
| 5 | `avatar_url` | `VARCHAR(500)` | — | — | — | — | `NULL` | URL or relative path to the sheikh's profile photo |
| 6 | `teaching_methodology` | `TEXT` | — | — | — | — | `NULL` | Description of teaching philosophy and approach |
| 7 | `total_audio_hours` | `VARCHAR(50)` | — | — | — | — | `NULL` | Display label for total audio content (e.g., "48 ساعة صوتية") |
| 8 | `created_at` | `TIMESTAMP` | — | — | — | ✅ | `CURRENT_TIMESTAMP` | Record creation time |
| 9 | `updated_at` | `TIMESTAMP` | — | — | — | ✅ | `CURRENT_TIMESTAMP` | Last modification time |

**Sample Row:**
```
id=1, name="الشيخ د. عمر العربي", title="أستاذ الفقه والسياسة الشرعية", 
bio="عالم وباحث شرعي، له أكثر من عشرين سنة...", avatar_url="/assets/portofolio.jpeg",
teaching_methodology="يعتمد الشيخ في دروشه على المنهج العلمي التأصيلي...",
total_audio_hours="48 ساعة صوتية"
```

---

## Table: `sheikh_qualifications`

**Purpose:** Stores the academic credentials and professional roles of each sheikh.

| # | Field | Type | PK | FK | Unique | Not Null | Default | Description |
|---|---|---|---|---|---|---|---|---|
| 1 | `id` | `INT AUTO_INCREMENT` | ✅ | — | ✅ | ✅ | Auto | Primary key |
| 2 | `sheikh_id` | `INT` | — | ✅ `sheikhs(id)` | — | ✅ | — | References the parent sheikh |
| 3 | `qualification` | `VARCHAR(500)` | — | — | — | ✅ | — | Qualification text (e.g., "ليسانس الشريعه الازهر") |
| 4 | `sort_order` | `INT` | — | — | — | ✅ | `0` | Controls display order (ascending) |

**Sample Rows (sheikh_id=1):**
```
(1, 1, "بكالوريوس تربيه ازهر", 0)
(2, 1, "مدرس الدروس العلمية بالمسجد لأكثر من 15 عاماً", 1)
(3, 1, "ليسانس الشريعه الازهر", 2)
(4, 1, "دراسات عليا الفقه العام", 3)
(5, 1, "ماجيستير الشريعه دار علوم", 4)
```

---

## Table: `sheikh_books`

**Purpose:** Stores titles of Islamic texts/books that the sheikh teaches or explains.

| # | Field | Type | PK | FK | Unique | Not Null | Default | Description |
|---|---|---|---|---|---|---|---|---|
| 1 | `id` | `INT AUTO_INCREMENT` | ✅ | — | ✅ | ✅ | Auto | Primary key |
| 2 | `sheikh_id` | `INT` | — | ✅ `sheikhs(id)` | — | ✅ | — | References the parent sheikh |
| 3 | `book_title` | `VARCHAR(500)` | — | — | — | ✅ | — | Title of the book/text (e.g., "شرح الأربعين النووية") |
| 4 | `sort_order` | `INT` | — | — | — | ✅ | `0` | Controls display order (ascending) |

**Sample Rows (sheikh_id=1):**
```
(1, 1, "شرح كتاب الطهارة والصلاة من عمدة الأحكام", 0)
(2, 1, "شرح الأربعين النووية في أحاديث سيد البرية", 1)
(3, 1, "تفسير سور المفصل وأحكام القرآن الكريم", 2)
(4, 1, "كتاب التوحيد وحقيقة الإيمان والاعتقاد", 3)
```

---

## Table: `sheikh_socials`

**Purpose:** Stores social media profile/channel links for each sheikh.

| # | Field | Type | PK | FK | Unique | Not Null | Default | Description |
|---|---|---|---|---|---|---|---|---|
| 1 | `id` | `INT AUTO_INCREMENT` | ✅ | — | ✅ | ✅ | Auto | Primary key |
| 2 | `sheikh_id` | `INT` | — | ✅ `sheikhs(id)` | — | ✅ | — | References the parent sheikh |
| 3 | `platform` | `VARCHAR(50)` | — | — | — | ✅ | — | Platform identifier (youtube, telegram, twitter, whatsapp) |
| 4 | `url` | `VARCHAR(500)` | — | — | — | ✅ | — | Full URL to the profile/channel |
| 5 | `sort_order` | `INT` | — | — | — | ✅ | `0` | Controls display order (ascending) |

**Composite Unique:** `UNIQUE(sheikh_id, platform)`

**Sample Rows (sheikh_id=1):**
```
(1, 1, "youtube", "https://www.youtube.com/channel/UCFhHh9-lsLKolez3pKnGC0w", 0)
(2, 1, "telegram", "https://t.me/omar_elarby", 1)
(3, 1, "twitter", "https://x.com", 2)
(4, 1, "whatsapp", "https://whatsapp.com", 3)
```

---

## Table: `categories`

**Purpose:** Defines the Islamic science sections that group lessons (Fiqh, Hadith, Tafsir, Tawheed).

| # | Field | Type | PK | FK | Unique | Not Null | Default | Description |
|---|---|---|---|---|---|---|---|---|
| 1 | `id` | `INT AUTO_INCREMENT` | ✅ | — | ✅ | ✅ | Auto | Primary key |
| 2 | `name` | `VARCHAR(100)` | — | — | ✅ | ✅ | — | Arabic name (e.g., "الفقه", "الحديث") |
| 3 | `slug` | `VARCHAR(100)` | — | — | ✅ | ✅ | — | URL-safe identifier (e.g., "fiqh", "hadith") |
| 4 | `description` | `TEXT` | — | — | — | — | `NULL` | Category description in Arabic |
| 5 | `icon` | `VARCHAR(10)` | — | — | — | — | `NULL` | Emoji character (e.g., "📖", "📜", "📚", "☝️") |
| 6 | `color` | `VARCHAR(7)` | — | — | — | — | `NULL` | Hex color for UI theming (e.g., "#2E7D32") |
| 7 | `sort_order` | `INT` | — | — | — | ✅ | `0` | Controls display order (ascending) |
| 8 | `created_at` | `TIMESTAMP` | — | — | — | ✅ | `CURRENT_TIMESTAMP` | Record creation time |
| 9 | `updated_at` | `TIMESTAMP` | — | — | — | ✅ | `CURRENT_TIMESTAMP` | Last modification time |

**Sample Rows:**
```
(1, "الفقه", "fiqh", "دروس في أحكام العبادات والمعاملات...", "📖", "#2E7D32", 0)
(2, "الحديث", "hadith", "شرح الأحاديث النبوية الصحيحة...", "📜", "#E65100", 1)
(3, "التفسير", "tafsir", "تفسير آيات القرآن الكريم...", "📚", "#1565C0", 2)
(4, "التوحيد", "tawheed", "دروس العقيدة الإسلامية...", "☝️", "#7B1FA2", 3)
```

---

## Table: `lessons`

**Purpose:** Core content table. Stores individual audio lectures with metadata.

| # | Field | Type | PK | FK | Unique | Not Null | Default | Description |
|---|---|---|---|---|---|---|---|---|
| 1 | `id` | `INT AUTO_INCREMENT` | ✅ | — | ✅ | ✅ | Auto | Primary key |
| 2 | `category_id` | `INT` | — | ✅ `categories(id)` | — | ✅ | — | Parent category reference |
| 3 | `sheikh_id` | `INT` | — | ✅ `sheikhs(id)` | — | ✅ | — | Instructor who gave the lesson |
| 4 | `title` | `VARCHAR(500)` | — | — | — | ✅ | — | Full Arabic title (e.g., "شرح كتاب الطهارة - أحكام المياه وأنواعها") |
| 5 | `description` | `TEXT` | — | — | — | — | `NULL` | Lesson summary/abstract |
| 6 | `lesson_number` | `INT` | — | — | — | ✅ | — | Sequential number within its category (1, 2, 3, ...) |
| 7 | `duration` | `VARCHAR(10)` | — | — | — | ✅ | — | Display duration string (e.g., "45:30") |
| 8 | `duration_seconds` | `INT` | — | — | — | — | `NULL` | Duration in total seconds (e.g., 2730) for range filtering |
| 9 | `audio_url` | `VARCHAR(1000)` | — | — | — | ✅ | — | URL to the MP3 audio file |
| 10 | `is_featured` | `BOOLEAN` | — | — | — | ✅ | `FALSE` | Whether to show in the featured spotlight |
| 11 | `published_date` | `DATE` | — | — | — | ✅ | — | Publication or recording date |
| 12 | `created_at` | `TIMESTAMP` | — | — | — | ✅ | `CURRENT_TIMESTAMP` | Record creation time |
| 13 | `updated_at` | `TIMESTAMP` | — | — | — | ✅ | `CURRENT_TIMESTAMP` | Last modification time |

**Composite Unique:** `UNIQUE(category_id, lesson_number)`

**Sample Row:**
```
(1, 1, 1, "شرح كتاب الطهارة - أحكام المياه وأنواعها", 
 "يتناول الشيخ في هذا الدرس بيان أقسام المياه...", 
 1, "45:30", 2730, "/assets/audio/1.mp3", TRUE, "2026-08-20")
```

---

## Table: `users`

**Purpose:** User accounts for authentication and personalization (bookmarks, theme).

| # | Field | Type | PK | FK | Unique | Not Null | Default | Description |
|---|---|---|---|---|---|---|---|---|
| 1 | `id` | `INT AUTO_INCREMENT` | ✅ | — | ✅ | ✅ | Auto | Primary key |
| 2 | `email` | `VARCHAR(255)` | — | — | ✅ | ✅ | — | Login email address |
| 3 | `password_hash` | `VARCHAR(255)` | — | — | — | ✅ | — | Securely hashed password (bcrypt/argon2) |
| 4 | `display_name` | `VARCHAR(100)` | — | — | — | — | `NULL` | Optional display name |
| 5 | `role` | `ENUM('user','admin')` | — | — | — | ✅ | `'user'` | Authorization role |
| 6 | `theme_preference` | `ENUM('light','dark','system')` | — | — | — | ✅ | `'system'` | UI theme preference |
| 7 | `is_active` | `BOOLEAN` | — | — | — | ✅ | `TRUE` | Whether the account is active |
| 8 | `created_at` | `TIMESTAMP` | — | — | — | ✅ | `CURRENT_TIMESTAMP` | Registration timestamp |
| 9 | `updated_at` | `TIMESTAMP` | — | — | — | ✅ | `CURRENT_TIMESTAMP` | Last profile update |
| 10 | `last_login_at` | `TIMESTAMP` | — | — | — | — | `NULL` | Last successful login timestamp |

---

## Table: `bookmarks`

**Purpose:** Junction table that persists user's saved/favorited lessons.

| # | Field | Type | PK | FK | Unique | Not Null | Default | Description |
|---|---|---|---|---|---|---|---|---|
| 1 | `id` | `INT AUTO_INCREMENT` | ✅ | — | ✅ | ✅ | Auto | Primary key |
| 2 | `user_id` | `INT` | — | ✅ `users(id)` | — | ✅ | — | The user who bookmarked |
| 3 | `lesson_id` | `INT` | — | ✅ `lessons(id)` | — | ✅ | — | The bookmarked lesson |
| 4 | `created_at` | `TIMESTAMP` | — | — | — | ✅ | `CURRENT_TIMESTAMP` | When the bookmark was saved |

**Composite Unique:** `UNIQUE(user_id, lesson_id)`

**Sample Rows:**
```
(1, 1, 1, "2026-08-20 14:30:00")  -- User 1 bookmarked Lesson 1
(2, 1, 5, "2026-08-21 09:15:00")  -- User 1 bookmarked Lesson 5
(3, 2, 1, "2026-08-22 16:00:00")  -- User 2 bookmarked Lesson 1
```

---

## Glossary of Data Types

| Type | Usage | Notes |
|---|---|---|
| `INT` / `SERIAL` | Numeric identifiers, counts | Auto-incrementing for PKs |
| `VARCHAR(n)` | Short-to-medium text with known max length | Specified lengths based on content analysis |
| `TEXT` | Long-form content (bios, descriptions) | No explicit length limit |
| `BOOLEAN` | True/false flags | `is_featured`, `is_active` |
| `DATE` | Calendar dates without time | `published_date` |
| `TIMESTAMP` | Full date + time | Audit fields (`created_at`, `updated_at`) |
| `ENUM(...)` | Constrained string values | `role`, `theme_preference` |
