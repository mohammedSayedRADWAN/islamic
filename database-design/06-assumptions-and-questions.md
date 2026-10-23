# MongoDB Assumptions, Integrity Strategies & Open Questions

---

## 1. Assumptions & Design Rationales

### A1 — Hierarchical Content Model: Series → Books → Lessons
**Assumption:** The core curriculum is structured into three discrete collections:
1. `series` (Curriculum domain: Fiqh, Hadith, etc.)
2. `books` (Specific study texts: Book of Purification, etc.)
3. `lessons` (Individual audio recordings)  
**Basis:** Lessons belong directly to books without an intermediate chapter collection. Unbounded lesson arrays are not embedded inside books to ensure efficient indexing, avoid hitting the 16MB BSON document limit, and support granular bookmarking.

### A2 — Sheikh Profile Consolidation (Embedding)
**Assumption:** The platform is dedicated to a single instructor (الشيخ د. عمر العربي). Therefore, creating 4 separate collections for qualifications, books taught, and socials is anti-pattern in MongoDB.  
**Basis:** Consolidating qualifications and books taught into embedded arrays and social channels into an embedded subdocument within the `sheikhs` collection enables single-read retrieval on the About page and footer.

### A3 — Mapping `categories` to `series`
**Assumption:** The previous `categories` table is replaced by the `series` collection.  
**Basis:** Fiqh, Hadith, Tafsir, and Tawheed represent the top-level series of the platform. Retaining both would create duplicate, overlapping concepts.

### A4 — Bookmarks Modeled as a Junction Collection
**Assumption:** Storing bookmarks as a dedicated collection (`bookmarks`) rather than an embedded array in the `users` document.  
**Basis:** If an active user bookmarks thousands of lessons, embedding an unbounded array of `ObjectId`s inside the user document causes unbounded document growth and requires atomic `$push`/`$pull` operations. A dedicated collection with a unique compound index `{ userId: 1, lessonId: 1 }` scales cleanly and allows querying which users bookmarked a given lesson.

### A5 — Lesson Numbering Scoped Per Book
**Assumption:** `lessonNumber` restarts at 1 for every book and is enforced via a compound unique index:
`db.lessons.createIndex({ bookId: 1, lessonNumber: 1 }, { unique: true })`.

---

## 2. Integrity & Deletion-Handling Strategy

MongoDB does not automatically enforce foreign-key constraints, cascading deletes, or referential integrity. The application layer and database operational rules must enforce the following:

### Deletion Policies:

1. **Series Deletion (RESTRICT / ARCHIVE):**
   - **Rule:** A series cannot be deleted if active books reference it.
   - **Implementation:** The application executes `const bookCount = await db.books.countDocuments({ seriesId: id });`. If `bookCount > 0`, the delete operation is rejected with an HTTP 400 Bad Request error.
   - **Recommended Approach:** Soft-deletion by updating `status: "archived"`.

2. **Book Deletion (RESTRICT / ARCHIVE):**
   - **Rule:** A book cannot be deleted if active lessons reference it.
   - **Implementation:** Check `await db.lessons.countDocuments({ bookId: id });`. If > 0, reject deletion.

3. **Lesson Deletion (CASCADE on Bookmarks):**
   - **Rule:** When a lesson is permanently removed, all orphaned bookmarks referencing its `lessonId` must be purged.
   - **Implementation:** Executed inside an atomic MongoDB session/transaction:
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

4. **User Deletion (CASCADE on Bookmarks):**
   - **Rule:** Deleting a user must clean up their associated bookmarks:
     ```javascript
     await db.bookmarks.deleteMany({ userId: targetUserId });
     await db.users.deleteOne({ _id: targetUserId });
     ```

---

## 3. Server-Side Validation vs. Application-Level Validation

| Validation Rule | Enforced At | Mechanism |
|---|---|---|
| BSON Data Types (`ObjectId`, `string`, `int`, `date`, `bool`) | Database | `$jsonSchema` collection validator |
| Required Fields | Database | `$jsonSchema` `required` array |
| Status Enum (`'draft'`, `'published'`, `'archived'`) | Database | `$jsonSchema` `enum` |
| Email Pattern Format | Database | `$jsonSchema` regex pattern |
| Audio URL Format | Database | `$jsonSchema` regex pattern (`^https?://.+`) |
| Non-negative integers (`lessonNumber >= 1`, `durationSeconds >= 0`) | Database | `$jsonSchema` `minimum` rule |
| Unique Email | Database | Unique Index: `{ email: 1 }` |
| Unique Lesson Number per Book | Database | Compound Unique Index: `{ bookId: 1, lessonNumber: 1 }` |
| Single Bookmark per User/Lesson | Database | Compound Unique Index: `{ userId: 1, lessonId: 1 }` |
| **Referential Integrity on Insert** (`bookId` / `seriesId` existence) | Application | Query check before insert |
| **Password Hashing** (Argon2id/Bcrypt) | Application | Hash before write |
| **Email Lowercasing & Sanitization** | Application | Pre-save normalization |
| **Featured Lesson Limit** (single active featured spotlight) | Application | Transactional update |

---

## 4. Open / Unresolved Questions

### Q1 — Listening Progress & Resume Playback
- **Context:** The audio player currently stores playback position in memory.
- **Option A:** Add a `listeningProgress` collection referencing `userId` and `lessonId` with `progressSeconds` and `lastPlayedAt`.
- **Option B:** Keep playback state client-side in `localStorage`.

### Q2 — Soft Deletion vs. Hard Deletion
- **Context:** Hard-deleting content in production can break links and delete bookmarks.
- **Recommendation:** Rely on `status: "archived"` across `series`, `books`, and `lessons`, filtering out archived content in public queries.
