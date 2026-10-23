# Assumptions, Unresolved Questions & Potential Issues

---

## Assumptions

### A1 — User Authentication
**Assumption:** A user authentication system (login/register) will be needed if bookmarks are to be persisted server-side.  
**Basis:** The current front-end stores bookmarks in `localStorage`, which is anonymous and device-specific. The proposed `users` and `bookmarks` tables assume user accounts will be introduced.  
**Impact:** If no authentication is planned, the `users` table and `bookmarks` table can be deferred, and bookmarks can continue using localStorage.

### A2 — Single Sheikh (for now)
**Assumption:** Although the current site is built for a single sheikh (الشيخ د. عمر العربي), the schema supports multiple sheikhs for forward compatibility.  
**Basis:** The static data has a single `sheikhInfo` object. However, making `sheikh_id` a foreign key in `lessons` costs nothing and avoids a future migration.  
**Impact:** Minimal. If strictly single-sheikh, the `sheikh_id` FK on `lessons` could be removed, but this is not recommended.

### A3 — Admin Role for Content Management
**Assumption:** An `admin` role will be needed to manage lessons, categories, and sheikh profiles via a future admin panel or CMS.  
**Basis:** There is no admin panel in the current front-end. However, content (lessons, categories) must be managed somehow. The `role` field on `users` accommodates this.  
**Impact:** If no admin panel is planned, the `role` field can default to `'user'` and the admin functionality can be added later.

### A4 — Audio Files Stored Externally
**Assumption:** Audio files are stored as static assets or on an external CDN/host. The database stores only the URL reference, not the binary file.  
**Basis:** The front-end references both local (`/assets/audio/1.mp3`) and remote (`https://download.quranicaudio.com/...`) audio URLs.  
**Impact:** No binary/blob storage is needed in the database.

### A5 — Duration Format
**Assumption:** Lesson duration will be stored in both display format (`VARCHAR` "45:30") and computed seconds (`INT` 2730) for filtering efficiency.  
**Basis:** The front-end parses "MM:SS" strings for display but also needs numeric comparison for the duration filter (short/medium/long).  
**Impact:** The `duration_seconds` field must be computed and populated on data entry. A database trigger or application-level logic should handle this.

### A6 — Lesson Numbers Are Per-Category
**Assumption:** `lesson_number` is unique within each category, not globally unique.  
**Basis:** The static data shows `lessonNumber: 1` in both Fiqh and Hadith categories. The `UNIQUE(category_id, lesson_number)` constraint enforces this.  
**Impact:** Lesson numbering restarts for each category.

### A7 — Featured Lessons
**Assumption:** Multiple lessons can be marked as `is_featured = TRUE` simultaneously, but the front-end currently picks only the first one found.  
**Basis:** The Home view uses `lessons.find(l => l.featured)` which returns the first match. Four lessons in static data are marked `featured: true`.  
**Impact:** The front-end query should likely be `ORDER BY published_date DESC LIMIT 1` for the featured spotlight, or use a more explicit "featured_week" mechanism.

### A8 — No Pagination Yet
**Assumption:** Pagination will eventually be needed as the lesson count grows, but the current front-end does not implement it.  
**Basis:** All 12 lessons are loaded at once from static data. The schema supports efficient pagination via indexed `published_date` and `id` fields.  
**Impact:** API endpoints should implement `LIMIT/OFFSET` or cursor-based pagination. The schema is ready for this.

### A9 — Search is Client-Side
**Assumption:** Full-text search will move to the backend when data is no longer static.  
**Basis:** The current search filters the static `lessons` array in-memory using `String.includes()`.  
**Impact:** The schema includes a recommendation for `FULLTEXT INDEX` on `lessons(title, description)` or PostgreSQL `tsvector` for server-side search.

### A10 — Badge CSS Class Is Derived
**Assumption:** The `badgeClass` field from static data (e.g., `"badge-fiqh"`) is a purely presentational concern and should NOT be stored in the database.  
**Basis:** It follows a predictable pattern: `badge-${category.slug}`. The front-end can derive this.  
**Impact:** No data loss. The front-end must construct the badge class string from the category slug.

### A11 — Category Name Denormalization
**Assumption:** The `categoryName` field on lessons in static data (e.g., `"الفقه"`) is intentional denormalization for display convenience but should be retrieved via JOIN in the database.  
**Basis:** Storing `categoryName` in the lessons table would create data duplication and risk inconsistency.  
**Impact:** Lesson queries must JOIN with `categories` to obtain the category name. This is standard practice and costs negligible performance.

---

## Unresolved Questions

### Q1 — Will user authentication be implemented?
**Context:** Bookmarks currently use localStorage. If the platform wants cross-device bookmark sync, user accounts are mandatory.  
**Options:**
- (a) Add full authentication (email/password) — `users` table as designed.
- (b) Add social/OAuth authentication only — may need additional `oauth_providers` table.
- (c) No authentication — remove `users` and `bookmarks` tables; keep localStorage.

### Q2 — Should listening history/progress be tracked?
**Context:** The audio player tracks `currentTime` but does not persist playback position. Users who close the browser lose their position.  
**Options:**
- (a) Add a `listening_progress` table with `user_id`, `lesson_id`, `position_seconds`, `last_played_at`.
- (b) Continue using client-side state only.

### Q3 — Are there plans for lesson series/playlists?
**Context:** Lessons within a category are implicitly a series (numbered sequentially). But there is no explicit "series" or "playlist" concept.  
**Options:**
- (a) Add a `series` table if lessons should be grouped into formal series (e.g., "شرح كتاب الطهارة" as a multi-lesson series).
- (b) Treat categories as the grouping mechanism (current approach).

### Q4 — Should lessons have rich content (text notes, PDFs, key points)?
**Context:** The Lesson Details page shows hardcoded "key points" (أبرز المحاور والفوائد) that are the same for every lesson. Real per-lesson notes are not stored.  
**Options:**
- (a) Add a `lesson_notes` or `lesson_points` table for per-lesson key takeaways.
- (b) Add a `content_html` or `content_markdown` field to `lessons` for rich text.
- (c) Keep the current generic points approach.

### Q5 — Multi-language support?
**Context:** The site is entirely in Arabic. No i18n framework is used.  
**Decision needed:** Is multi-language a future requirement? If yes, table structures for translations would be needed.

### Q6 — How should the "featured lesson of the week" be managed?
**Context:** Currently, 4 out of 12 lessons are marked `featured: true`. The home page picks the first one.  
**Options:**
- (a) Keep `is_featured` as a boolean, with a business rule that only one should be true at a time.
- (b) Add a `featured_at` timestamp to select the most recently featured lesson.
- (c) Create a separate `site_settings` or `featured_content` table.

### Q7 — Comments, ratings, or community features?
**Context:** No interactive community features exist in the front-end. No comments, ratings, Q&A, or discussion sections.  
**Decision needed:** If comments or ratings are planned, additional tables would be required.

---

## Potential Design Issues

### P1 — `total_audio_hours` in `sheikhs` Could Become Stale
**Risk:** The `total_audio_hours` field is a denormalized display string. As new lessons are added, this value must be manually updated.  
**Mitigation:** Either compute this value dynamically via `SUM(duration_seconds)` query, or use a scheduled job/trigger to update it.

### P2 — No Soft Delete Mechanism
**Risk:** All delete operations are hard deletes. If a lesson or category is accidentally deleted, the data is permanently lost.  
**Mitigation:** Consider adding `deleted_at TIMESTAMP NULL` fields for soft deletion, or implement backup procedures.

### P3 — Audio URL Fragility
**Risk:** Audio files referenced by URL may move, expire, or become unavailable (especially third-party URLs like `quranicaudio.com`).  
**Mitigation:** Consider hosting all audio files on controlled infrastructure. Add a `is_audio_available` flag or health-check mechanism.

### P4 — No Versioning or Audit Trail
**Risk:** Changes to lessons, categories, or sheikh info are not tracked. There is no way to see who changed what and when.  
**Mitigation:** For an admin-managed system, consider an `audit_log` table tracking entity changes.

### P5 — ENUM Limitations
**Risk:** `ENUM` types (`role`, `theme_preference`) are rigid. Adding new values requires a schema migration.  
**Mitigation:** Alternatively, use `VARCHAR` with `CHECK` constraints, or a separate reference/lookup table.

### P6 — No Rate Limiting or Abuse Prevention for Bookmarks
**Risk:** Without server-side controls, a user (or bot) could create millions of bookmarks.  
**Mitigation:** Implement server-side limits (e.g., max 500 bookmarks per user) and rate limiting at the API layer.
