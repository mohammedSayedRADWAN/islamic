# Website Features Summary & Data Requirements

## Project Overview

**Project Name:** منصة العلوم الشرعية (Islamic Sciences Platform)  
**Technology Stack:** Vue 3 + Vite + Vue Router 4  
**Language:** Arabic (RTL)  
**Purpose:** An educational Islamic audio-lessons platform for a specific sheikh (الشيخ د. عمر العربي). The platform organizes recorded audio lectures across Islamic sciences (Fiqh, Hadith, Tafsir, Tawheed) and allows visitors to browse, search, filter, bookmark, and listen to lessons.

---

## Identified Features

### F1 — Sheikh Profile (About Page)
- Displays the sheikh's **name**, **title**, **biography**, **avatar image**.
- Lists **qualifications** (academic credentials and teaching roles).
- Lists **books taught** (Islamic texts the sheikh teaches/explains).
- Shows **social media links** (YouTube, Telegram, Twitter/X, WhatsApp).
- Displays **teaching methodology** text.
- Shows **aggregate statistics**: total lessons, total categories, total audio hours.

**Data Source:** `sheikhInfo` object in `staticData.js`.

---

### F2 — Categories (Islamic Sciences Sections)
- Each category has an **id**, **name** (Arabic), **slug** (English URL-friendly), **description**, **icon** (emoji), **badge CSS class**, **lesson count**, and **color** (hex).
- Categories are: الفقه (Fiqh), الحديث (Hadith), التفسير (Tafsir), التوحيد (Tawheed).
- Categories are listed on the Home page and a dedicated Categories page.
- Each category links to a Category Details page showing all lessons within it.

**Data Source:** `categories` array in `staticData.js`.

---

### F3 — Lessons (Audio Lectures)
- Each lesson has: **id**, **title**, **category slug**, **category name** (Arabic), **badge CSS class**, **lesson number** (within its category), **duration** (MM:SS string), **date** (publication date), **description**, **audio URL**, and **featured flag**.
- Lessons are displayed as cards across multiple pages.
- A lesson belongs to exactly one category.
- Lessons can be marked as **featured** (shown in a spotlight section on Home).

**Data Source:** `lessons` array in `staticData.js`.

---

### F4 — Audio Playback
- Global persistent audio player (singleton) that survives navigation.
- Supports: play/pause, seek, skip ±10s, playback rate (0.75x–2x), volume control, mute.
- Shows current lesson info (title, category, lesson number) in the player bar.
- Player has collapsed (floating button) and expanded (full bar) states.
- Audio can be downloaded directly from the lesson detail page.

**Data Implication:** Audio files are referenced by URL. No additional database tables needed for playback state (client-side only), but audio file metadata (URL, duration) belongs in the lessons table.

---

### F5 — Bookmarks / Favorites
- Users can bookmark/unbookmark individual lessons via a heart icon.
- Bookmarks are stored in **localStorage** (key: `islamic_bookmarks_list`).
- A dedicated Bookmarks page displays all saved lessons.
- Users can clear all bookmarks at once.
- Bookmark count is shown in the navigation bar badge.

**Data Implication:** Currently client-side only (localStorage). For a backend-backed system, this requires a bookmarks/favorites entity linked to users and lessons.

---

### F6 — Search
- Global search modal (triggered by Ctrl+K or search button).
- Searches across lesson **title**, **description**, and **category name** (case-insensitive substring match).
- Results show lesson metadata (category badge, lesson number, title, description).
- Users can play a lesson or navigate to its detail page directly from search results.

**Data Implication:** Requires full-text or substring search capability on lessons.

---

### F7 — Filtering & Sorting
- **Category filter:** filter lessons by category slug ("all" or a specific slug).
- **Duration filter:** short (<35 min), medium (35–45 min), long (>45 min), or all.
- **Sort options:** newest first, oldest first, or by lesson number.
- Available on the Lessons listing page and Category Details page.

**Data Implication:** Requires indexed date, duration, and category fields for efficient queries.

---

### F8 — Theme Switching (Dark/Light Mode)
- Toggle between dark and light themes.
- Preference saved in **localStorage** (key: `islamic_theme`).
- Falls back to system preference (`prefers-color-scheme: dark`).

**Data Implication:** Pure client-side preference. If user accounts are added, this could become a user preference field.

---

### F9 — Lesson Navigation (Previous/Next)
- On the Lesson Details page, previous and next lesson navigation within the same category.
- Based on array index order of lessons filtered by the same category.

**Data Implication:** Requires ordering of lessons within a category (by `lessonNumber`).

---

### F10 — Statistics Display
- Home hero section shows: total lessons count, total categories count, total audio hours.
- Currently hardcoded in `sheikhInfo`.

**Data Implication:** These can be derived (computed aggregates) from the lessons and categories tables.

---

## Data Requirements Summary

| Requirement | Source Feature | Storage Needed |
|---|---|---|
| Sheikh profile info | F1 | Database (single record or config) |
| Qualifications list | F1 | Database (related to sheikh) |
| Books taught list | F1 | Database (related to sheikh) |
| Social media links | F1 | Database (related to sheikh) |
| Categories metadata | F2 | Database table |
| Lessons with full metadata | F3, F4, F6, F7, F9 | Database table |
| Audio file references | F3, F4 | Part of lessons table |
| User bookmarks | F5 | Database table (requires users) |
| User theme preference | F8 | Optional user preference field |
| Aggregate statistics | F10 | Computed from data |

---

## Authentication & Authorization Assessment

The current front-end has **NO authentication or user management**. All features are anonymous:
- Bookmarks use localStorage (no account needed).
- Theme uses localStorage.
- No login/register forms, user profiles, dashboards, or admin panels exist.

> **Assumption:** If a backend is introduced, user accounts would be needed at minimum for persisting bookmarks. An admin role would likely be needed for managing lessons and categories (CRUD). See the Assumptions document for details.
