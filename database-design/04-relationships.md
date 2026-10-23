# Relationship Mapping Document

## All Relationships

### R1: `sheikhs` ↔ `sheikh_qualifications`
| Property | Value |
|---|---|
| **Type** | One-to-Many (1:N) |
| **Parent** | `sheikhs` |
| **Child** | `sheikh_qualifications` |
| **Foreign Key** | `sheikh_qualifications.sheikh_id → sheikhs.id` |
| **On Delete** | `CASCADE` (deleting a sheikh removes all their qualifications) |
| **On Update** | `CASCADE` |
| **Required** | A qualification must belong to a sheikh |
| **Description** | Each sheikh can have multiple academic qualifications. Each qualification belongs to exactly one sheikh. |
| **Front-end Usage** | About page — qualifications list section |

---

### R2: `sheikhs` ↔ `sheikh_books`
| Property | Value |
|---|---|
| **Type** | One-to-Many (1:N) |
| **Parent** | `sheikhs` |
| **Child** | `sheikh_books` |
| **Foreign Key** | `sheikh_books.sheikh_id → sheikhs.id` |
| **On Delete** | `CASCADE` |
| **On Update** | `CASCADE` |
| **Required** | A book record must belong to a sheikh |
| **Description** | Each sheikh can have multiple books taught. Each book record belongs to exactly one sheikh. |
| **Front-end Usage** | About page — books taught section |

---

### R3: `sheikhs` ↔ `sheikh_socials`
| Property | Value |
|---|---|
| **Type** | One-to-Many (1:N) |
| **Parent** | `sheikhs` |
| **Child** | `sheikh_socials` |
| **Foreign Key** | `sheikh_socials.sheikh_id → sheikhs.id` |
| **On Delete** | `CASCADE` |
| **On Update** | `CASCADE` |
| **Required** | A social link must belong to a sheikh |
| **Additional Constraint** | `UNIQUE(sheikh_id, platform)` — one link per platform per sheikh |
| **Description** | Each sheikh can have social media links on multiple platforms. Each platform link belongs to exactly one sheikh, with no duplicates per platform. |
| **Front-end Usage** | About page — social media buttons; Footer — social icons |

---

### R4: `sheikhs` ↔ `lessons`
| Property | Value |
|---|---|
| **Type** | One-to-Many (1:N) |
| **Parent** | `sheikhs` |
| **Child** | `lessons` |
| **Foreign Key** | `lessons.sheikh_id → sheikhs.id` |
| **On Delete** | `RESTRICT` (cannot delete a sheikh who has lessons) |
| **On Update** | `CASCADE` |
| **Required** | Every lesson must have an instructor |
| **Description** | Each sheikh delivers multiple lessons. Each lesson is delivered by exactly one sheikh. |
| **Front-end Usage** | Lesson details page — "إلقاء: [sheikh name]" attribution; Hero section — sheikh profile card |

---

### R5: `categories` ↔ `lessons`
| Property | Value |
|---|---|
| **Type** | One-to-Many (1:N) |
| **Parent** | `categories` |
| **Child** | `lessons` |
| **Foreign Key** | `lessons.category_id → categories.id` |
| **On Delete** | `RESTRICT` (cannot delete a category that contains lessons) |
| **On Update** | `CASCADE` |
| **Required** | Every lesson must belong to a category |
| **Additional Constraint** | `UNIQUE(category_id, lesson_number)` — lesson numbers are unique within a category |
| **Description** | Each category contains multiple lessons. Each lesson belongs to exactly one category. |
| **Front-end Usage** | Category filter pills; Category details page; Lesson card badges; Previous/next navigation within a category |

---

### R6: `users` ↔ `bookmarks`
| Property | Value |
|---|---|
| **Type** | One-to-Many (1:N) |
| **Parent** | `users` |
| **Child** | `bookmarks` |
| **Foreign Key** | `bookmarks.user_id → users.id` |
| **On Delete** | `CASCADE` (deleting a user removes all their bookmarks) |
| **On Update** | `CASCADE` |
| **Required** | A bookmark must belong to a user |
| **Description** | Each user can have multiple bookmarks. Each bookmark belongs to exactly one user. |
| **Front-end Usage** | Bookmarks page; Heart icon on lesson cards; Navbar bookmark count badge |

---

### R7: `lessons` ↔ `bookmarks`
| Property | Value |
|---|---|
| **Type** | One-to-Many (1:N) |
| **Parent** | `lessons` |
| **Child** | `bookmarks` |
| **Foreign Key** | `bookmarks.lesson_id → lessons.id` |
| **On Delete** | `CASCADE` (deleting a lesson removes all bookmarks pointing to it) |
| **On Update** | `CASCADE` |
| **Required** | A bookmark must reference a lesson |
| **Description** | Each lesson can be bookmarked by multiple users. Each bookmark references exactly one lesson. |
| **Front-end Usage** | Bookmarks page — displays bookmarked lesson cards |

---

### R8 (Logical): `users` ↔ `lessons` (via `bookmarks`)
| Property | Value |
|---|---|
| **Type** | Many-to-Many (M:N) |
| **Junction Table** | `bookmarks` |
| **Unique Constraint** | `UNIQUE(user_id, lesson_id)` — a user can bookmark a lesson only once |
| **Description** | The `bookmarks` table resolves the M:N relationship between users and lessons. A user can bookmark many lessons, and a lesson can be bookmarked by many users. |

---

## Relationship Matrix

| | sheikhs | sheikh_qualifications | sheikh_books | sheikh_socials | categories | lessons | users | bookmarks |
|---|---|---|---|---|---|---|---|---|
| **sheikhs** | — | 1:N | 1:N | 1:N | — | 1:N | — | — |
| **sheikh_qualifications** | N:1 | — | — | — | — | — | — | — |
| **sheikh_books** | N:1 | — | — | — | — | — | — | — |
| **sheikh_socials** | N:1 | — | — | — | — | — | — | — |
| **categories** | — | — | — | — | — | 1:N | — | — |
| **lessons** | N:1 | — | — | — | N:1 | — | — (M:N via bookmarks) | 1:N |
| **users** | — | — | — | — | — | — (M:N via bookmarks) | — | 1:N |
| **bookmarks** | — | — | — | — | — | N:1 | N:1 | — |

---

## Junction Tables

| Junction Table | Resolves Relationship | Parent A | Parent B |
|---|---|---|---|
| `bookmarks` | Users ↔ Lessons (M:N) | `users` | `lessons` |

> No other many-to-many relationships exist in this schema. All other relationships are strictly one-to-many.
