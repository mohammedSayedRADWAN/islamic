# Website Features Summary & Data Requirements (MongoDB Architecture)

## Project Overview

**Project Name:** منصة العلوم الشرعية (Islamic Sciences Platform)  
**Technology Stack:** Vue 3 + Vite + Vue Router 4  
**Database Technology:** MongoDB (Document-Oriented NoSQL)  
**Language:** Arabic (RTL)  
**Purpose:** An educational Islamic audio-lessons platform dedicated to a single instructor (الشيخ د. عمر العربي). Content is organized following a strict academic hierarchy: **Series → Books → Audio Lessons**.

---

## MongoDB Architectural Structure

```
Collection: series (Level 1)
  │  └── e.g. الفقه (Fiqh), الحديث (Hadith), التفسير (Tafsir), التوحيد (Tawheed)
  ▼
Collection: books (Level 2 — references seriesId: ObjectId)
  │  └── e.g. under Fiqh: كتاب الطهارة (Book of Purification), كتاب الصلاة (Book of Prayer)
  │  └── e.g. under Hadith: الأربعون النووية (Forty Hadith)
  ▼
Collection: lessons (Level 3 — references bookId: ObjectId)
     └── e.g. under Book of Purification: Lesson 1: Introduction, Lesson 2: Types of Water
```

### Architectural Decisions:
1. **Separation of Content Collections:**
   - `series`, `books`, and `lessons` are preserved as separate collections. Unbounded arrays of lessons are **not** embedded inside books to prevent document size exhaustion (16MB BSON limit) and to preserve efficient random reads, search indexing, and atomic updates.
2. **Consolidation of Sheikh Profile Collections:**
   - The instructor domain is modeled as a **single document in the `sheikhs` collection** containing embedded arrays (`qualifications`, `booksTaught`) and an embedded subdocument (`socials`), avoiding unnecessary relational joins for a single instructor.
3. **Categories Mapped to Series:**
   - The previous `categories` concept corresponds directly to top-level science disciplines (`series`). Retaining both would be redundant; hence, `categories` is replaced by `series`.
4. **Users & Bookmarks:**
   - Persistent cross-device bookmarking is enabled via a normalized `bookmarks` collection with a unique compound index `{ userId: 1, lessonId: 1 }`.

---

## Feature Matrix & MongoDB Collections

| Feature | Description | MongoDB Collection(s) | Pattern |
|---|---|---|---|
| **F1 — Sheikh Profile** | Sheikh biography, teaching methodology, credentials, texts taught, social links | `sheikhs` | Embedded subdocuments & arrays in a single profile document |
| **F2 — Series Catalog** | Major Islamic sciences curricula | `series` | Normalized collection (`_id: ObjectId`) |
| **F3 — Books & Syllabi** | Classical books and treatises within a series | `books` | Normalized collection (`seriesId: ObjectId`) |
| **F4 — Audio Lessons** | Audio lectures with streaming URLs, durations, and publication dates | `lessons` | Normalized collection (`bookId: ObjectId`) |
| **F5 — Audio Playback** | Continuous streaming audio playback with seek and rate control | `lessons.audioUrl`, `lessons.durationSeconds` | Stored as URL strings and integer duration seconds |
| **F6 — Bookmarks & Favorites** | User ability to save lessons across sessions | `bookmarks` (Junction `users` ↔ `lessons`) | Unique compound index on `{ userId: 1, lessonId: 1 }` |
| **F7 — Search** | Full-text search across titles and descriptions | `lessons` | Arabic MongoDB text index on `{ title: "text", description: "text" }` |
| **F8 — Filtering & Sorting** | Filter by book, duration range (<35m, 35-45m, >45m), and sort | `lessons` | Indexed queries on `durationSeconds`, `lessonNumber`, `publishedDate` |
| **F9 — User Accounts & Roles** | Authentication, roles (`user`, `admin`), UI theme preference | `users` | Standalone collection with unique index on `email` |
| **F10 — Aggregated Statistics** | Total lessons, total audio hours, total books, total series | `series`, `books`, `lessons` | MongoDB aggregation pipelines (`$count`, `$sum`) |
