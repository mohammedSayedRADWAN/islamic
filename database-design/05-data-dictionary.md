# MongoDB Data Dictionary & Sample BSON Documents

This data dictionary provides full field specifications, BSON data types, constraints, and realistic sample BSON documents following the exact hierarchy:
**Series (Fiqh) → Book (Book of Purification) → Audio Lessons (Lesson 1 & Lesson 2)**.

---

## 1. Collection: `sheikhs`

**Description:** Instructor profile with embedded arrays for qualifications and books taught, plus an embedded object for social media links.

| Field | BSON Type | Required | Description |
|---|---|---|---|
| `_id` | `ObjectId` | Yes | Unique MongoDB identifier |
| `name` | `string` | Yes | Full Arabic name (الشيخ د. عمر العربي) |
| `title` | `string` | Yes | Academic/religious title |
| `bio` | `string` | No | Extended biography narrative |
| `avatarUrl` | `string` | No | URL/path to profile avatar image |
| `teachingMethodology` | `string` | No | Teaching methodology summary |
| `totalAudioHours` | `string` | No | Display text for total hours (e.g., "48 ساعة صوتية") |
| `qualifications` | `array` | Yes | Array of embedded credential objects: `{ qualification: string, sortOrder: int }` |
| `booksTaught` | `array` | Yes | Array of embedded book objects: `{ bookTitle: string, sortOrder: int }` |
| `socials` | `object` | Yes | Embedded subdocument containing platform URLs (`youtube`, `telegram`, `twitter`, `whatsapp`) |
| `createdAt` | `date` | Yes | Document creation timestamp |
| `updatedAt` | `date` | Yes | Last update timestamp |

### Sample Document: `sheikhs`
```json
{
  "_id": { "$oid": "661000000000000000000001" },
  "name": "الشيخ د. عمر العربي",
  "title": "أستاذ الفقه والسياسة الشرعية",
  "bio": "عالم وباحث شرعي، له أكثر من عشرين سنة في تدريس العلوم الشرعية وإلقاء المحاضرات والدروس العلمية التأصيلية في المساجد والجامعات.",
  "avatarUrl": "/assets/portofolio.jpeg",
  "teachingMethodology": "يعتمد الشيخ في دروشه على المنهج العلمي التأصيلي القائم على شرح المتون المعتمدة مع ربط الأحكام بالواقع المعاصر.",
  "totalAudioHours": "48 ساعة صوتية",
  "qualifications": [
    { "qualification": "بكالوريوس تربيه ازهر", "sortOrder": 0 },
    { "qualification": "مدرس الدروس العلمية بالمسجد لأكثر من 15 عاماً", "sortOrder": 1 },
    { "qualification": "ليسانس الشريعه الازهر", "sortOrder": 2 },
    { "qualification": "دراسات عليا الفقه العام", "sortOrder": 3 },
    { "qualification": "ماجيستير الشريعه دار علوم", "sortOrder": 4 }
  ],
  "booksTaught": [
    { "bookTitle": "شرح كتاب الطهارة والصلاة من عمدة الأحكام", "sortOrder": 0 },
    { "bookTitle": "شرح الأربعين النووية في أحاديث سيد البرية", "sortOrder": 1 },
    { "bookTitle": "تفسير سور المفصل وأحكام القرآن الكريم", "sortOrder": 2 },
    { "bookTitle": "كتاب التوحيد وحقيقة الإيمان والاعتقاد", "sortOrder": 3 }
  ],
  "socials": {
    "youtube": "https://www.youtube.com/channel/UCFhHh9-lsLKolez3pKnGC0w",
    "telegram": "https://t.me/omar_elarby",
    "twitter": "https://x.com",
    "whatsapp": "https://whatsapp.com"
  },
  "createdAt": { "$date": "2026-01-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2026-01-01T00:00:00.000Z" }
}
```

---

## 2. Collection: `series`

**Description:** Hierarchy Level 1. Top-level Islamic science curricula or major subject series (e.g., الفقه, الحديث). Replaces previous SQL `categories`.

| Field | BSON Type | Required | Description |
|---|---|---|---|
| `_id` | `ObjectId` | Yes | Unique identifier |
| `title` | `string` | Yes | Series title in Arabic (e.g., "الفقه", "الحديث") |
| `description` | `string` | No | Detailed series description |
| `sortOrder` | `int` | Yes | Display sequence (default: 0) |
| `status` | `string` | Yes | Lifecycle status: `"draft"`, `"published"`, `"archived"` |
| `createdAt` | `date` | Yes | Creation timestamp |
| `updatedAt` | `date` | Yes | Last update timestamp |

### Sample Documents: `series`

#### Series 1: Fiqh (الفقه)
```json
{
  "_id": { "$oid": "662000000000000000000001" },
  "title": "الفقه",
  "description": "سلسلة دروس الفقه الإسلامي الميسر وبيان أحكام العبادات والمعاملات وفق المنهج التأصيلي المعتمد.",
  "sortOrder": 0,
  "status": "published",
  "createdAt": { "$date": "2026-01-10T10:00:00.000Z" },
  "updatedAt": { "$date": "2026-01-10T10:00:00.000Z" }
}
```

#### Series 2: Hadith (الحديث)
```json
{
  "_id": { "$oid": "662000000000000000000002" },
  "title": "الحديث",
  "description": "سلسلة دراسة وشرح متون الحديث النبوي الشريف وتبيان فقه الأحاديث ودلالاتها الإيمانية والعملية.",
  "sortOrder": 1,
  "status": "published",
  "createdAt": { "$date": "2026-01-10T10:00:00.000Z" },
  "updatedAt": { "$date": "2026-01-10T10:00:00.000Z" }
}
```

---

## 3. Collection: `books`

**Description:** Hierarchy Level 2. Classical or contemporary texts studied under a series. Contains audio lessons directly.

| Field | BSON Type | Required | Description |
|---|---|---|---|
| `_id` | `ObjectId` | Yes | Unique identifier |
| `seriesId` | `ObjectId` | Yes | Reference to parent `series._id` |
| `title` | `string` | Yes | Book title in Arabic (e.g., "كتاب الطهارة", "الأربعون النووية") |
| `description` | `string` | No | Book introduction, outline, and syllabus |
| `coverUrl` | `string` | No | Path or URL to book cover graphic |
| `sortOrder` | `int` | Yes | Display sequence within the series (default: 0) |
| `status` | `string` | Yes | Lifecycle status: `"draft"`, `"published"`, `"archived"` |
| `createdAt` | `date` | Yes | Creation timestamp |
| `updatedAt` | `date` | Yes | Last update timestamp |

### Sample Documents: `books`

#### Book 1: Book of Purification (كتاب الطهارة under Fiqh)
```json
{
  "_id": { "$oid": "663000000000000000000001" },
  "seriesId": { "$oid": "662000000000000000000001" },
  "title": "كتاب الطهارة",
  "description": "شرح أحكام الطهارة، أقسام المياه، النجاسات، الوضوء، والغسل من كتاب عمدة الأحكام.",
  "coverUrl": "/assets/covers/tahara.jpg",
  "sortOrder": 0,
  "status": "published",
  "createdAt": { "$date": "2026-01-15T12:00:00.000Z" },
  "updatedAt": { "$date": "2026-01-15T12:00:00.000Z" }
}
```

#### Book 2: Book of Prayer (كتاب الصلاة under Fiqh)
```json
{
  "_id": { "$oid": "663000000000000000000002" },
  "seriesId": { "$oid": "662000000000000000000001" },
  "title": "كتاب الصلاة",
  "description": "شرح صفة الصلاة وشروطها وأركانها وسننها ومبطلاتها.",
  "coverUrl": "/assets/covers/salah.jpg",
  "sortOrder": 1,
  "status": "published",
  "createdAt": { "$date": "2026-01-15T12:00:00.000Z" },
  "updatedAt": { "$date": "2026-01-15T12:00:00.000Z" }
}
```

#### Book 3: Forty Hadith (الأربعون النووية under Hadith)
```json
{
  "_id": { "$oid": "663000000000000000000003" },
  "seriesId": { "$oid": "662000000000000000000002" },
  "title": "الأربعون النووية",
  "description": "شرح الأحاديث الأربعين النووية للإمام محيي الدين النووي رحمه الله في جوامع الكلم النبوي.",
  "coverUrl": "/assets/covers/nawawiya.jpg",
  "sortOrder": 0,
  "status": "published",
  "createdAt": { "$date": "2026-01-15T12:00:00.000Z" },
  "updatedAt": { "$date": "2026-01-15T12:00:00.000Z" }
}
```

---

## 4. Collection: `lessons`

**Description:** Hierarchy Level 3. Individual recorded audio lessons belonging directly to a book via `bookId`.

| Field | BSON Type | Required | Description |
|---|---|---|---|
| `_id` | `ObjectId` | Yes | Unique identifier |
| `bookId` | `ObjectId` | Yes | Reference to parent `books._id` |
| `title` | `string` | Yes | Full Arabic lesson title |
| `description` | `string` | No | Lesson summary, notes, and topics covered |
| `lessonNumber` | `int` | Yes | Sequential number within the book (1, 2, ...) |
| `durationSeconds` | `int` | Yes | Duration in seconds (e.g., 2730 for 45m 30s) |
| `audioUrl` | `string` | Yes | URL to audio file (MP3 / CDN stream) |
| `isFeatured` | `bool` | Yes | Flag for homepage spotlight (default: false) |
| `publishedDate` | `date` | Yes | Publication/recording date |
| `sortOrder` | `int` | Yes | Explicit sorting order within the book (default: 0) |
| `status` | `string` | Yes | Lifecycle status: `"draft"`, `"published"`, `"archived"` |
| `createdAt` | `date` | Yes | Creation timestamp |
| `updatedAt` | `date` | Yes | Last update timestamp |

### Sample Documents: `lessons`

#### Lesson 1: Introduction to Purification (under Book of Purification)
```json
{
  "_id": { "$oid": "665000000000000000000001" },
  "bookId": { "$oid": "663000000000000000000001" },
  "title": "الدرس 1: مقدمة كتاب الطهارة وفضل العلم",
  "description": "بيان أهمية كتاب الطهارة في الفقه الإسلامي، ومكانة الطهارة كشرط لصحة الصلاة، مع مقدمة تأصيلية.",
  "lessonNumber": 1,
  "durationSeconds": 2730,
  "audioUrl": "https://cdn.islamic-platform.com/audio/fiqh/tahara/01.mp3",
  "isFeatured": true,
  "publishedDate": { "$date": "2026-08-20T00:00:00.000Z" },
  "sortOrder": 1,
  "status": "published",
  "createdAt": { "$date": "2026-08-20T10:00:00.000Z" },
  "updatedAt": { "$date": "2026-08-20T10:00:00.000Z" }
}
```

#### Lesson 2: Types of Water (under Book of Purification)
```json
{
  "_id": { "$oid": "665000000000000000000002" },
  "bookId": { "$oid": "663000000000000000000001" },
  "title": "الدرس 2: أقسام المياه وأحكامها",
  "description": "شرح أقسام المياه: الماء الطهور، والماء النجس، وضوابط تغير الماء بالشوائب وحكم الوضوء به.",
  "lessonNumber": 2,
  "durationSeconds": 2400,
  "audioUrl": "https://cdn.islamic-platform.com/audio/fiqh/tahara/02.mp3",
  "isFeatured": false,
  "publishedDate": { "$date": "2026-08-25T00:00:00.000Z" },
  "sortOrder": 2,
  "status": "published",
  "createdAt": { "$date": "2026-08-25T10:00:00.000Z" },
  "updatedAt": { "$date": "2026-08-25T10:00:00.000Z" }
}
```

---

## 5. Collection: `users`

**Description:** User authentication accounts, roles, and UI theme settings.

| Field | BSON Type | Required | Description |
|---|---|---|---|
| `_id` | `ObjectId` | Yes | Unique identifier |
| `email` | `string` | Yes | Email address (unique, normalized lowercase) |
| `passwordHash` | `string` | Yes | Cryptographic hash (bcrypt or argon2) |
| `displayName` | `string` | No | Nickname or profile name |
| `role` | `string` | Yes | `"user"` or `"admin"` (default: `"user"`) |
| `themePreference` | `string` | Yes | `"light"`, `"dark"`, or `"system"` (default: `"system"`) |
| `isActive` | `bool` | Yes | Account status flag (default: true) |
| `lastLoginAt` | `date` | No | Timestamp of most recent login |
| `createdAt` | `date` | Yes | Account registration timestamp |
| `updatedAt` | `date` | Yes | Last update timestamp |

### Sample Document: `users`
```json
{
  "_id": { "$oid": "664000000000000000000001" },
  "email": "talib.ilm@example.com",
  "passwordHash": "$2b$12$e8kZ1VnQ7U4eE7I9C5O0u.G0Y6A2w8p5b7d9f1h3j5l7n9p1r3t5v",
  "displayName": "طالب علم",
  "role": "user",
  "themePreference": "dark",
  "isActive": true,
  "lastLoginAt": { "$date": "2026-10-22T18:30:00.000Z" },
  "createdAt": { "$date": "2026-05-15T09:00:00.000Z" },
  "updatedAt": { "$date": "2026-10-22T18:30:00.000Z" }
}
```

---

## 6. Collection: `bookmarks`

**Description:** Junction collection for saved/favorited lessons.

| Field | BSON Type | Required | Description |
|---|---|---|---|
| `_id` | `ObjectId` | Yes | Unique identifier |
| `userId` | `ObjectId` | Yes | Reference to `users._id` |
| `lessonId` | `ObjectId` | Yes | Reference to `lessons._id` |
| `createdAt` | `date` | Yes | Bookmark creation timestamp |

### Sample Document: `bookmarks`
```json
{
  "_id": { "$oid": "666000000000000000000001" },
  "userId": { "$oid": "664000000000000000000001" },
  "lessonId": { "$oid": "665000000000000000000001" },
  "createdAt": { "$date": "2026-10-22T19:00:00.000Z" }
}
```
