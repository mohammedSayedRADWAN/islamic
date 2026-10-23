# MongoDB Document References & Relationships

## Data Modeling Strategy: Embedding vs. Referencing

In MongoDB, document data modeling revolves around two fundamental patterns: **Embedding (Denormalization)** and **Referencing (Normalization)**. The platform combines both strategically:

### When Embedding is Used:
- **`sheikhs` profile:** Qualifications, books taught, and social handles are bound to the single sheikh profile. They are always retrieved together on the About page and footer. Embedding them into arrays and a subdocument within the `sheikhs` collection eliminates 3 redundant collections and cross-collection lookups.

### When Referencing is Used (`series → books → lessons`):
- **Hierarchy Collections:** Modeled with normalized `ObjectId` references (`books.seriesId → series._id` and `lessons.bookId → books._id`).
- **Why NOT embed lessons inside books?**
  1. **Unbounded Growth:** A comprehensive Islamic book can span dozens or hundreds of lessons. Embedding them risks exceeding the 16MB document limit.
  2. **Atomic Updates & Concurrency:** Updating, adding, or modifying a single lesson audio URL or duration should not rewrite the entire parent book document.
  3. **Indexing & Search:** Searching and filtering individual lessons by duration, date, or text search across millions of words is drastically more efficient when lessons are discrete documents.
  4. **Direct Bookmarking:** Bookmarking individual lessons requires a clean, indexed `lessonId` reference.

---

## Detailed Relationship Specifications

### R1: `sheikhs` Embedded Subdocuments
| Property | Value |
|---|---|
| **Type** | Embedded 1:N and 1:1 Subdocuments |
| **Parent** | `sheikhs` document |
| **Embedded Fields** | `qualifications` (Array of objects), `booksTaught` (Array of objects), `socials` (Embedded document) |
| **Storage** | Stored within the single `sheikhs` document |
| **Description** | All biographical, credential, and social media data are co-located in the same document. |

---

### R2: `series` ↔ `books` (Hierarchy Level 1 → Level 2)
| Property | Value |
|---|---|
| **Type** | One-to-Many (1:N) via Normalized Reference |
| **Parent Collection** | `series` (`_id: ObjectId`) |
| **Child Collection** | `books` (`seriesId: ObjectId`) |
| **Reference Field** | `books.seriesId` points to `series._id` |
| **Integrity Enforcement** | Application-level validation on book creation |
| **Deletion Policy** | **RESTRICT**: Application checks for existing books before permitting series deletion. Recommends soft-delete (`status: "archived"`). |
| **Description** | One series contains multiple books (e.g., Fiqh series contains Purification Book, Prayer Book). |

---

### R3: `books` ↔ `lessons` (Hierarchy Level 2 → Level 3)
| Property | Value |
|---|---|
| **Type** | One-to-Many (1:N) via Normalized Reference |
| **Parent Collection** | `books` (`_id: ObjectId`) |
| **Child Collection** | `lessons` (`bookId: ObjectId`) |
| **Reference Field** | `lessons.bookId` points to `books._id` |
| **Unique Constraint** | MongoDB compound unique index: `{ bookId: 1, lessonNumber: 1 }` |
| **Integrity Enforcement** | Application-level check verifying `bookId` exists before inserting a lesson |
| **Deletion Policy** | **RESTRICT**: Cannot delete a book while lessons exist. |
| **Description** | One book contains multiple audio lessons in sequential order. Lessons belong directly to a book without chapters. |

---

### R4: `users` ↔ `bookmarks`
| Property | Value |
|---|---|
| **Type** | One-to-Many (1:N) via Reference |
| **Parent Collection** | `users` (`_id: ObjectId`) |
| **Child Collection** | `bookmarks` (`userId: ObjectId`) |
| **Reference Field** | `bookmarks.userId` points to `users._id` |
| **Deletion Policy** | **CASCADE**: When a user is deleted, their bookmarks are deleted via `db.bookmarks.deleteMany({ userId: id })`. |

---

### R5: `lessons` ↔ `bookmarks`
| Property | Value |
|---|---|
| **Type** | One-to-Many (1:N) via Reference |
| **Parent Collection** | `lessons` (`_id: ObjectId`) |
| **Child Collection** | `bookmarks` (`lessonId: ObjectId`) |
| **Reference Field** | `bookmarks.lessonId` points to `lessons._id` |
| **Deletion Policy** | **CASCADE**: When a lesson is deleted, associated bookmarks are cleaned up via `db.bookmarks.deleteMany({ lessonId: id })`. |

---

### R6 (Many-to-Many Junction): `users` ↔ `lessons`
| Property | Value |
|---|---|
| **Type** | Many-to-Many (M:N) via Junction Collection |
| **Junction Collection** | `bookmarks` |
| **Enforced Constraint** | Unique compound index: `{ userId: 1, lessonId: 1 }` prevents duplicate bookmarks. |
| **Description** | Users can bookmark many lessons; each lesson can be bookmarked by many users. |

---

## Relationship & Reference Matrix

| Collection | sheikhs | series | books | lessons | users | bookmarks |
|---|---|---|---|---|---|---|
| **sheikhs** | — | — | — | — | — | — |
| **series** | — | — | 1:N (`seriesId`) | — | — | — |
| **books** | — | N:1 (`seriesId`) | — | 1:N (`bookId`) | — | — |
| **lessons** | — | — | N:1 (`bookId`) | — | — | 1:N (`lessonId`) |
| **users** | — | — | — | — | — | 1:N (`userId`) |
| **bookmarks** | — | — | — | N:1 (`lessonId`) | N:1 (`userId`) | — |

---

## MongoDB Aggregation Lookups (`$lookup`)

Common cross-collection join queries performed using the aggregation framework:

### 1. Fetching a Lesson with its Book and Series:
```javascript
db.lessons.aggregate([
  { $match: { _id: ObjectId("665000000000000000000001") } },
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
      bookTitle: "$book.title",
      seriesTitle: "$series.title"
    }
  }
]);
```

### 2. Fetching a User's Bookmarks with Full Lesson Details:
```javascript
db.bookmarks.aggregate([
  { $match: { userId: ObjectId("664000000000000000000001") } },
  { $sort: { createdAt: -1 } },
  {
    $lookup: {
      from: "lessons",
      localField: "lessonId",
      foreignField: "_id",
      as: "lesson"
    }
  },
  { $unwind: "$lesson" },
  {
    $lookup: {
      from: "books",
      localField: "lesson.bookId",
      foreignField: "_id",
      as: "book"
    }
  },
  { $unwind: "$book" },
  {
    $project: {
      bookmarkId: "$_id",
      bookmarkedAt: "$createdAt",
      lesson: "$lesson",
      bookTitle: "$book.title"
    }
  }
]);
```
