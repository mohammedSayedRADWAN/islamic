# MongoDB Database Architecture & Schema Specification

## 1. Database Model Selection: MongoDB (Document-Oriented NoSQL)

### Architectural Paradigm
This specification adapts the platform's data design to **MongoDB**, shifting from relational SQL tables to document collections, BSON data types, embedded subdocuments where natural, and normalized document references (`ObjectId`) for hierarchical entities.

### Key Architectural Decisions:
1. **Hierarchical Content Domain (`series → books → lessons`):**
   - **Normalized Collections with `ObjectId` References:** Modeled as 3 discrete collections: `series`, `books`, and `lessons`.
   - **Rationale against Unbounded Embedding:** Embedding an unbounded array of audio lessons inside a book document violates MongoDB's document size guidelines (16MB BSON limit) and severely degrades query performance, random lesson updates, audio seek lookups, and individual bookmark operations. Therefore, `lessons` are maintained in their own collection with a `bookId: ObjectId` reference.
2. **Sheikh Profile Simplification (Embedding 1:N Collections into 1 Document):**
   - In SQL, 4 separate tables were used (`sheikhs`, `sheikh_qualifications`, `sheikh_books`, `sheikh_socials`).
   - For MongoDB on a single-sheikh platform, creating 4 distinct collections creates unnecessary join/lookup overhead.
   - **Decision:** Consolidate the entire instructor profile into a **single collection (`sheikhs`) with embedded arrays and subdocuments** (`qualifications: []`, `booksTaught: []`, `socials: {}`).
3. **Bookmarks Collection:**
   - Modeled as a dedicated `bookmarks` collection referencing `userId: ObjectId` and `lessonId: ObjectId`.
   - Enforced uniqueness via a compound unique index: `{ userId: 1, lessonId: 1 }`.
4. **User & Identity Domain:**
   - Dedicated `users` collection handling credentials, roles (`user`, `admin`), UI preferences, and timestamps.

### Final MongoDB Collections (5 Collections Total):
1. `sheikhs` (Single profile document with embedded credentials and socials)
2. `series` (Top-level curriculum domain: Fiqh, Hadith, etc.)
3. `books` (Texts/books within a series: Book of Purification, etc.)
4. `lessons` (Individual audio lectures)
5. `users` (User accounts)
6. `bookmarks` (User lesson bookmarks junction)

---

## 2. Collection Specifications

### 2.1 Collection: `sheikhs`
- **Purpose:** Stores the instructor's profile, academic credentials, texts taught, and social media handles.
- **Document Pattern:** Single root document (or single-instructor configuration) leveraging embedded arrays and embedded documents.

#### Schema & BSON Types:
```json
{
  "_id": "ObjectId",
  "name": "string (required)",
  "title": "string (required)",
  "bio": "string (optional)",
  "avatarUrl": "string (optional)",
  "teachingMethodology": "string (optional)",
  "totalAudioHours": "string (optional)",
  "qualifications": [
    {
      "qualification": "string (required)",
      "sortOrder": "int (required)"
    }
  ],
  "booksTaught": [
    {
      "bookTitle": "string (required)",
      "sortOrder": "int (required)"
    }
  ],
  "socials": {
    "youtube": "string (optional URL)",
    "telegram": "string (optional URL)",
    "twitter": "string (optional URL)",
    "whatsapp": "string (optional URL)"
  },
  "createdAt": "date (required)",
  "updatedAt": "date (required)"
}
```

---

### 2.2 Collection: `series`
- **Purpose:** Level 1 of the content hierarchy. High-level Islamic science curricula or major series (e.g., الفقه, الحديث, التفسير, التوحيد).
- **Document Pattern:** Standalone documents with status flags and sorting indices.

#### Schema & BSON Types:
```json
{
  "_id": "ObjectId",
  "title": "string (required)",
  "description": "string (optional)",
  "sortOrder": "int (default: 0)",
  "status": "string (enum: 'draft' | 'published' | 'archived', default: 'published')",
  "createdAt": "date (required)",
  "updatedAt": "date (required)"
}
```

---

### 2.3 Collection: `books`
- **Purpose:** Level 2 of the content hierarchy. Study texts or books under a series (e.g., كتاب الطهارة, كتاب الصلاة under Fiqh; الأربعون النووية under Hadith).
- **Document Pattern:** Normalized collection referencing `seriesId` (`ObjectId`).

#### Schema & BSON Types:
```json
{
  "_id": "ObjectId",
  "seriesId": "ObjectId (required, references series._id)",
  "title": "string (required)",
  "description": "string (optional)",
  "coverUrl": "string (optional URL/path)",
  "sortOrder": "int (default: 0)",
  "status": "string (enum: 'draft' | 'published' | 'archived', default: 'published')",
  "createdAt": "date (required)",
  "updatedAt": "date (required)"
}
```

---

### 2.4 Collection: `lessons`
- **Purpose:** Level 3 of the content hierarchy. Individual audio lessons/lectures directly belonging to a book.
- **Document Pattern:** Normalized collection referencing `bookId` (`ObjectId`).

#### Schema & BSON Types:
```json
{
  "_id": "ObjectId",
  "bookId": "ObjectId (required, references books._id)",
  "title": "string (required)",
  "description": "string (optional)",
  "lessonNumber": "int (required, >= 1)",
  "durationSeconds": "int (required, >= 0)",
  "audioUrl": "string (required URL)",
  "isFeatured": "bool (default: false)",
  "publishedDate": "date (required)",
  "sortOrder": "int (default: 0)",
  "status": "string (enum: 'draft' | 'published' | 'archived', default: 'published')",
  "createdAt": "date (required)",
  "updatedAt": "date (required)"
}
```

---

### 2.5 Collection: `users`
- **Purpose:** User authentication, identity management, roles, and UI theme preferences.

#### Schema & BSON Types:
```json
{
  "_id": "ObjectId",
  "email": "string (required, unique, lowercase)",
  "passwordHash": "string (required, bcrypt/argon2)",
  "displayName": "string (optional)",
  "role": "string (enum: 'user' | 'admin', default: 'user')",
  "themePreference": "string (enum: 'light' | 'dark' | 'system', default: 'system')",
  "isActive": "bool (default: true)",
  "lastLoginAt": "date (optional)",
  "createdAt": "date (required)",
  "updatedAt": "date (required)"
}
```

---

### 2.6 Collection: `bookmarks`
- **Purpose:** Stores user favorited/saved audio lessons. Many-to-many relationship between `users` and `lessons`.

#### Schema & BSON Types:
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (required, references users._id)",
  "lessonId": "ObjectId (required, references lessons._id)",
  "createdAt": "date (required)"
}
```

---

## 3. MongoDB Indexes

Index definitions written in standard MongoDB shell syntax (`db.collection.createIndex()`):

### 3.1 `series` Collection Indexes
```javascript
// 1. Fetching active series in sort order (Home page & Series list)
db.series.createIndex(
  { status: 1, sortOrder: 1 },
  { name: "idx_series_status_sort" }
);
```

### 3.2 `books` Collection Indexes
```javascript
// 1. Querying books by series in display order
db.books.createIndex(
  { seriesId: 1, status: 1, sortOrder: 1 },
  { name: "idx_books_series_status_sort" }
);

// 2. Direct lookup by series
db.books.createIndex(
  { seriesId: 1 },
  { name: "idx_books_series" }
);
```

### 3.3 `lessons` Collection Indexes
```javascript
// 1. Unique constraint: Enforce sequential lesson number per book
db.lessons.createIndex(
  { bookId: 1, lessonNumber: 1 },
  { unique: true, name: "uniq_lessons_book_lesson_number" }
);

// 2. Fetching lessons within a book in sequential or custom order
db.lessons.createIndex(
  { bookId: 1, status: 1, sortOrder: 1, lessonNumber: 1 },
  { name: "idx_lessons_book_status_order" }
);

// 3. Featured lessons for the homepage spotlight
db.lessons.createIndex(
  { isFeatured: 1, status: 1, publishedDate: -1 },
  { name: "idx_lessons_featured" }
);

// 4. Chronological feed and latest lessons
db.lessons.createIndex(
  { status: 1, publishedDate: -1 },
  { name: "idx_lessons_published_date" }
);

// 5. Duration range filtering (short, medium, long)
db.lessons.createIndex(
  { durationSeconds: 1 },
  { name: "idx_lessons_duration" }
);

// 6. Text search across lesson titles and descriptions
db.lessons.createIndex(
  { title: "text", description: "text" },
  { default_language: "arabic", name: "idx_lessons_text_search" }
);
```

### 3.4 `users` Collection Indexes
```javascript
// 1. Unique index for authentication lookup by email
db.users.createIndex(
  { email: 1 },
  { unique: true, name: "uniq_users_email" }
);
```

### 3.5 `bookmarks` Collection Indexes
```javascript
// 1. Unique compound index: A user can bookmark a lesson only once
db.bookmarks.createIndex(
  { userId: 1, lessonId: 1 },
  { unique: true, name: "uniq_bookmarks_user_lesson" }
);

// 2. Fetching all bookmarks of a specific user in reverse chronological order
db.bookmarks.createIndex(
  { userId: 1, createdAt: -1 },
  { name: "idx_bookmarks_user_created" }
);

// 3. Counting or checking bookmarks for a specific lesson
db.bookmarks.createIndex(
  { lessonId: 1 },
  { name: "idx_bookmarks_lesson" }
);
```

---

## 4. Document Validation & BSON Types

MongoDB supports server-side JSON Schema validation via `$jsonSchema`. Below is the validation strategy for each collection.

### 4.1 Server-Side JSON Schema Validations

#### `series` Collection Validator
```javascript
db.createCollection("series", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "sortOrder", "status", "createdAt", "updatedAt"],
      properties: {
        _id: { bsonType: "objectId" },
        title: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        description: {
          bsonType: ["string", "null"],
          description: "Must be a string or null"
        },
        sortOrder: {
          bsonType: "int",
          description: "Must be an integer sort order"
        },
        status: {
          enum: ["draft", "published", "archived"],
          description: "Can only be one of 'draft', 'published', or 'archived'"
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

#### `books` Collection Validator
```javascript
db.createCollection("books", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["seriesId", "title", "sortOrder", "status", "createdAt", "updatedAt"],
      properties: {
        _id: { bsonType: "objectId" },
        seriesId: {
          bsonType: "objectId",
          description: "Must reference an existing series _id"
        },
        title: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        description: {
          bsonType: ["string", "null"],
          description: "Must be a string or null"
        },
        coverUrl: {
          bsonType: ["string", "null"],
          description: "Must be a string URL/path or null"
        },
        sortOrder: {
          bsonType: "int",
          description: "Must be an integer sort order"
        },
        status: {
          enum: ["draft", "published", "archived"],
          description: "Can only be one of 'draft', 'published', or 'archived'"
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

#### `lessons` Collection Validator
```javascript
db.createCollection("lessons", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "bookId",
        "title",
        "lessonNumber",
        "durationSeconds",
        "audioUrl",
        "isFeatured",
        "publishedDate",
        "sortOrder",
        "status",
        "createdAt",
        "updatedAt"
      ],
      properties: {
        _id: { bsonType: "objectId" },
        bookId: {
          bsonType: "objectId",
          description: "Must reference an existing book _id"
        },
        title: {
          bsonType: "string",
          description: "Lesson title is required"
        },
        description: {
          bsonType: ["string", "null"],
          description: "Description must be a string or null"
        },
        lessonNumber: {
          bsonType: "int",
          minimum: 1,
          description: "Lesson number must be an integer >= 1"
        },
        durationSeconds: {
          bsonType: "int",
          minimum: 0,
          description: "Duration in seconds must be an integer >= 0"
        },
        audioUrl: {
          bsonType: "string",
          pattern: "^https?://.+",
          description: "Audio URL must be a valid HTTP/HTTPS URL string"
        },
        isFeatured: {
          bsonType: "bool",
          description: "Must be a boolean flag"
        },
        publishedDate: {
          bsonType: "date",
          description: "Must be a BSON date"
        },
        sortOrder: {
          bsonType: "int",
          description: "Must be an integer"
        },
        status: {
          enum: ["draft", "published", "archived"],
          description: "Can only be one of 'draft', 'published', or 'archived'"
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

#### `users` Collection Validator
```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "passwordHash", "role", "themePreference", "isActive", "createdAt", "updatedAt"],
      properties: {
        _id: { bsonType: "objectId" },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Must be a valid email format"
        },
        passwordHash: {
          bsonType: "string",
          description: "Must be a string representing the hashed password"
        },
        displayName: {
          bsonType: ["string", "null"],
          description: "Optional display name"
        },
        role: {
          enum: ["user", "admin"],
          description: "Can only be 'user' or 'admin'"
        },
        themePreference: {
          enum: ["light", "dark", "system"],
          description: "Theme must be 'light', 'dark', or 'system'"
        },
        isActive: {
          bsonType: "bool"
        },
        lastLoginAt: {
          bsonType: ["date", "null"]
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

#### `bookmarks` Collection Validator
```javascript
db.createCollection("bookmarks", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "lessonId", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId", description: "Must reference an existing user _id" },
        lessonId: { bsonType: "objectId", description: "Must reference an existing lesson _id" },
        createdAt: { bsonType: "date" }
      }
    }
  }
});
```

### 4.2 Application-Level Validation Requirements
While MongoDB JSON Schema validates types, formats, and basic ranges, the application layer (API / business logic) must enforce:
1. **Referential Integrity on Insert:** Verifying that `seriesId` exists in `series` before creating a `book`, and `bookId` exists in `books` before creating a `lesson`.
2. **Featured Lesson Uniqueness/Rotation:** Guaranteeing that only one or a controlled number of lessons are active as `isFeatured = true`.
3. **Password Hashing:** Applying Argon2id or Bcrypt hashing prior to database persistence.
4. **Email Normalization:** Trimming and converting emails to lowercase (`email.toLowerCase().trim()`) before queries or inserts.

---

## 5. Reference & Deletion-Handling Strategy

Unlike relational databases with SQL `ON DELETE CASCADE` or `ON DELETE RESTRICT`, **MongoDB does NOT automatically enforce foreign key referential integrity or cascading deletions**.

### Referential Handling Policies

| Action | Target | Strategy | Implementation Mechanism |
|---|---|---|---|
| **Delete Series** | `series` | **RESTRICT (Preferred)** | Check `db.books.countDocuments({ seriesId: id })`. If > 0, reject deletion with an error. |
| **Soft Delete Series** | `series` | **ARCHIVE (Recommended)** | Set `status: "archived"`. Downstream queries filter out archived series. |
| **Delete Book** | `books` | **RESTRICT** | Check `db.lessons.countDocuments({ bookId: id })`. If > 0, reject deletion. |
| **Delete Lesson** | `lessons` | **CASCADE on Bookmarks** | Delete lesson and clean up bookmarks: `await db.bookmarks.deleteMany({ lessonId: id })`. |
| **Delete User** | `users` | **CASCADE on Bookmarks** | Delete user and all associated bookmarks: `await db.bookmarks.deleteMany({ userId: id })`. |

### Atomic Multi-Document Transactions
For operations requiring atomicity (such as deleting a user and their bookmarks, or deleting a book along with its lessons and bookmarks), MongoDB **multi-document replica set transactions** should be used:
```javascript
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await db.bookmarks.deleteMany({ lessonId: targetLessonId }, { session });
    await db.lessons.deleteOne({ _id: targetLessonId }, { session });
  });
} finally {
  await session.endSession();
}
```
