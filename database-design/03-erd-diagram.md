# MongoDB Document Relationship Diagram & Architecture

## MongoDB Document Reference & Embedding Diagram

The diagram below depicts the MongoDB document models, embedded subdocuments, and normalized `ObjectId` references.

```mermaid
classDiagram
    class Sheikh {
        ObjectId _id
        String name
        String title
        String bio
        String avatarUrl
        String teachingMethodology
        String totalAudioHours
        Array~Qualification~ qualifications
        Array~BookTaught~ booksTaught
        Object socials
        Date createdAt
        Date updatedAt
    }

    class Qualification {
        String qualification
        Int sortOrder
    }

    class BookTaught {
        String bookTitle
        Int sortOrder
    }

    class Socials {
        String youtube
        String telegram
        String twitter
        String whatsapp
    }

    class Series {
        ObjectId _id
        String title
        String description
        Int sortOrder
        String status
        Date createdAt
        Date updatedAt
    }

    class Book {
        ObjectId _id
        ObjectId seriesId
        String title
        String description
        String coverUrl
        Int sortOrder
        String status
        Date createdAt
        Date updatedAt
    }

    class Lesson {
        ObjectId _id
        ObjectId bookId
        String title
        String description
        Int lessonNumber
        Int durationSeconds
        String audioUrl
        Boolean isFeatured
        Date publishedDate
        Int sortOrder
        String status
        Date createdAt
        Date updatedAt
    }

    class User {
        ObjectId _id
        String email
        String passwordHash
        String displayName
        String role
        String themePreference
        Boolean isActive
        Date lastLoginAt
        Date createdAt
        Date updatedAt
    }

    class Bookmark {
        ObjectId _id
        ObjectId userId
        ObjectId lessonId
        Date createdAt
    }

    Sheikh *-- Qualification : embeds array
    Sheikh *-- BookTaught : embeds array
    Sheikh *-- Socials : embeds subdocument
    Series "1" <-- "N" Book : references seriesId (ObjectId)
    Book "1" <-- "N" Lesson : references bookId (ObjectId)
    User "1" <-- "N" Bookmark : references userId (ObjectId)
    Lesson "1" <-- "N" Bookmark : references lessonId (ObjectId)
```

---

## Simplified MongoDB Collection Architecture

```mermaid
graph TB
    subgraph "Instructor Profile Domain (Single Document with Embedded Data)"
        S["Collection: sheikhs<br/>• qualifications: [...]<br/>• booksTaught: [...]<br/>• socials: {...}"]
    end

    subgraph "Content Hierarchy Domain (Normalized with ObjectId References)"
        SE["Collection: series (Level 1: Fiqh, Hadith...)<br/>_id: ObjectId"]
        BK["Collection: books (Level 2: Book of Purification...)<br/>seriesId: ObjectId"]
        L["Collection: lessons (Level 3: Audio Lessons...)<br/>bookId: ObjectId"]
    end

    subgraph "User & Engagement Domain"
        U["Collection: users<br/>_id: ObjectId"]
        BM["Collection: bookmarks<br/>userId: ObjectId, lessonId: ObjectId<br/>Unique Compound Index: {userId: 1, lessonId: 1}"]
    end

    SE -->|"seriesId (1:N)"| BK
    BK -->|"bookId (1:N)"| L
    U -->|"userId (1:N)"| BM
    L -->|"lessonId (1:N)"| BM

    style S fill:#2E7D32,color:#fff
    style SE fill:#1565C0,color:#fff
    style BK fill:#0277BD,color:#fff
    style L fill:#E65100,color:#fff
    style U fill:#7B1FA2,color:#fff
    style BM fill:#C62828,color:#fff
```
