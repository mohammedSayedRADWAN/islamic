# Front-End to MongoDB Entity & Query Mapping

This document maps the Vue 3 frontend components, routes, and user workflows to the corresponding **MongoDB collections, BSON structures, and MQL (MongoDB Query Language) aggregation pipelines**.

---

## 1. Architectural Concept Mapping

| Frontend Concept | Previous SQL Model | MongoDB Data Model | Storage Approach |
|---|---|---|---|
| Sheikh Info | `sheikhs` + 3 child tables | `sheikhs` collection | Single document with embedded `qualifications` array, `booksTaught` array, and `socials` subdocument |
| Categories | `categories` table | `series` collection | Standalone documents (`_id`, `title`, `description`, `sortOrder`, `status`) |
| Books / Texts | `books` table | `books` collection | Standalone documents with `seriesId: ObjectId` reference |
| Audio Lessons | `lessons` table | `lessons` collection | Standalone documents with `bookId: ObjectId` reference |
| Favorites / Bookmarks | `bookmarks` table | `bookmarks` collection | Junction documents with `userId: ObjectId`, `lessonId: ObjectId` |
| User Profile & Preferences | `users` table | `users` collection | Standalone documents with hashed passwords and theme preferences |

---

## 2. Page-Level Query Mappings

### 2.1 Home Page (`/` — `Home.vue`)

| Section | Component | Target Collection(s) | MongoDB Query / Aggregation Pipeline |
|---|---|---|---|
| Hero Section | `HeroSection.vue` | `sheikhs` | `db.sheikhs.findOne({})` |
| Hero Stats | `HeroSection.vue` | `series`, `books`, `lessons` | `Promise.all([db.series.countDocuments({status: "published"}), db.books.countDocuments({status: "published"}), db.lessons.countDocuments({status: "published"})])` |
| Series Grid | `CategoryCard.vue` | `series`, `books`, `lessons` | Aggregation with `$lookup` to compute book & lesson counts per series: <br/> `db.series.aggregate([{ $match: { status: "published" } }, { $lookup: { from: "books", localField: "_id", foreignField: "seriesId", as: "books" } }, { $sort: { sortOrder: 1 } }])` |
| Featured Lesson | `FeaturedLesson.vue` | `lessons`, `books`, `series` | `db.lessons.aggregate([{ $match: { isFeatured: true, status: "published" } }, { $sort: { publishedDate: -1 } }, { $limit: 1 }, { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } }, { $unwind: "$book" }, { $lookup: { from: "series", localField: "book.seriesId", foreignField: "_id", as: "series" } }, { $unwind: "$series" }])` |
| Latest Lessons | `LessonCard.vue` | `lessons`, `books` | `db.lessons.aggregate([{ $match: { status: "published" } }, { $sort: { publishedDate: -1 } }, { $limit: 6 }, { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } }, { $unwind: "$book" }])` |

---

### 2.2 Series / Categories Listing Page (`/categories` — `Categories.vue`)

| Section | Target Collection(s) | MongoDB Query |
|---|---|---|
| All Series with Counts | `series`, `books`, `lessons` | `db.series.aggregate([{ $match: { status: "published" } }, { $sort: { sortOrder: 1 } }, { $lookup: { from: "books", localField: "_id", foreignField: "seriesId", as: "books" } }, { $project: { title: 1, description: 1, sortOrder: 1, bookCount: { $size: "$books" } } }])` |

---

### 2.3 Series Details Page (`/categories/:id` — `CategoryDetails.vue`)

| Section | Target Collection(s) | MongoDB Query |
|---|---|---|
| Series Details | `series` | `db.series.findOne({ _id: ObjectId(seriesId), status: "published" })` |
| Books in Series | `books` | `db.books.find({ seriesId: ObjectId(seriesId), status: "published" }).sort({ sortOrder: 1 })` |
| Lessons under Series | `lessons`, `books` | `db.books.aggregate([{ $match: { seriesId: ObjectId(seriesId), status: "published" } }, { $lookup: { from: "lessons", localField: "_id", foreignField: "bookId", as: "lessons" } }, { $sort: { sortOrder: 1 } }])` |

---

### 2.4 Lessons Listing Page (`/lessons` — `Lessons.vue`)

| Feature | Target Collection(s) | MongoDB Query Pattern |
|---|---|---|
| Filter by Book | `lessons` | `{ bookId: ObjectId(selectedBookId) }` |
| Duration Filter | `lessons` | Short: `{ durationSeconds: { $lt: 2100 } }`<br/>Medium: `{ durationSeconds: { $gte: 2100, $lte: 2700 } }`<br/>Long: `{ durationSeconds: { $gt: 2700 } }` |
| Sort Options | `lessons` | Newest: `.sort({ publishedDate: -1 })`<br/>Oldest: `.sort({ publishedDate: 1 })`<br/>Number: `.sort({ lessonNumber: 1 })` |

**Combined Pipeline with Join to Book and Series:**
```javascript
const filter = { status: "published" };
if (bookId) filter.bookId = ObjectId(bookId);
if (duration === "short") filter.durationSeconds = { $lt: 2100 };
if (duration === "medium") filter.durationSeconds = { $gte: 2100, $lte: 2700 };
if (duration === "long") filter.durationSeconds = { $gt: 2700 };

const sort = {};
if (sortKey === "newest") sort.publishedDate = -1;
if (sortKey === "oldest") sort.publishedDate = 1;
if (sortKey === "number") sort.lessonNumber = 1;

db.lessons.aggregate([
  { $match: filter },
  { $sort: sort },
  {
    $lookup: {
      from: "books",
      localField: "bookId",
      foreignField: "_id",
      as: "book"
    }
  },
  { $unwind: "$book" },
  {
    $lookup: {
      from: "series",
      localField: "book.seriesId",
      foreignField: "_id",
      as: "series"
    }
  },
  { $unwind: "$series" },
  {
    $project: {
      title: 1,
      lessonNumber: 1,
      durationSeconds: 1,
      audioUrl: 1,
      publishedDate: 1,
      isFeatured: 1,
      bookTitle: "$book.title",
      seriesTitle: "$series.title"
    }
  }
]);
```

---

### 2.5 Lesson Details Page (`/lessons/:id` — `LessonDetails.vue`)

| Component | Target Collection(s) | MongoDB Query Pattern |
|---|---|---|
| Lesson Meta | `lessons`, `books`, `series` | `db.lessons.aggregate([{ $match: { _id: ObjectId(id) } }, { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } }, { $unwind: "$book" }, { $lookup: { from: "series", localField: "book.seriesId", foreignField: "_id", as: "series" } }, { $unwind: "$series" }])` |
| Sheikh Attribution | `sheikhs` | Profile data fetched once from `sheikhs` |
| Previous / Next Lesson | `lessons` | Previous: `db.lessons.find({ bookId: currentBookId, lessonNumber: { $lt: currentNumber }, status: "published" }).sort({ lessonNumber: -1 }).limit(1)`<br/>Next: `db.lessons.find({ bookId: currentBookId, lessonNumber: { $gt: currentNumber }, status: "published" }).sort({ lessonNumber: 1 }).limit(1)` |
| Bookmark Status | `bookmarks` | `db.bookmarks.countDocuments({ userId: currentUserId, lessonId: currentLessonId })` |

---

### 2.6 Bookmarks Page (`/bookmarks` — `Bookmarks.vue`)

| Action | Target Collection(s) | MongoDB Query |
|---|---|---|
| List User Bookmarks | `bookmarks`, `lessons`, `books` | `db.bookmarks.aggregate([{ $match: { userId: currentUserId } }, { $sort: { createdAt: -1 } }, { $lookup: { from: "lessons", localField: "lessonId", foreignField: "_id", as: "lesson" } }, { $unwind: "$lesson" }, { $lookup: { from: "books", localField: "lesson.bookId", foreignField: "_id", as: "book" } }, { $unwind: "$book" }])` |
| Toggle Bookmark ON | `bookmarks` | `db.bookmarks.updateOne({ userId: currentUserId, lessonId: targetLessonId }, { $setOnInsert: { createdAt: new Date() } }, { upsert: true })` |
| Toggle Bookmark OFF | `bookmarks` | `db.bookmarks.deleteOne({ userId: currentUserId, lessonId: targetLessonId })` |
| Clear All Bookmarks | `bookmarks` | `db.bookmarks.deleteMany({ userId: currentUserId })` |

---

### 2.7 About Page (`/about` — `About.vue`)

| Section | Target Collection | MongoDB Query |
|---|---|---|
| Complete Profile | `sheikhs` | `db.sheikhs.findOne({})` returns biography, qualifications, booksTaught, and socials in a single document read. |

---

### 2.8 Global Components

| Component | Target Collection | MongoDB Query |
|---|---|---|
| **Navbar Bookmark Badge** | `bookmarks` | `db.bookmarks.countDocuments({ userId: currentUserId })` |
| **Search Modal (Full-text)** | `lessons` | `db.lessons.find({ $text: { $search: query }, status: "published" }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } }).limit(10)` |
| **Footer Links** | `series` | `db.series.find({ status: "published" }, { title: 1 }).sort({ sortOrder: 1 })` |
