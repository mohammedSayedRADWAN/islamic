import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required']
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: [true, 'lessonId is required']
    }
  },
  {
    collection: 'bookmarks',
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Indexes
// 1. Compound unique index: Enforces that a user can bookmark a lesson only once
bookmarkSchema.index(
  { userId: 1, lessonId: 1 },
  { unique: true, name: 'uniq_bookmarks_user_lesson' }
);

// 2. Querying a user's bookmarks in reverse chronological order
bookmarkSchema.index(
  { userId: 1, createdAt: -1 },
  { name: 'idx_bookmarks_user_created' }
);

// 3. Querying or counting bookmarks for a specific lesson
bookmarkSchema.index(
  { lessonId: 1 },
  { name: 'idx_bookmarks_lesson' }
);

const Bookmark = mongoose.models.Bookmark || mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
