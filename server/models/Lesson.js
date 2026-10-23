import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'bookId is required']
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
      maxlength: [500, 'Lesson title cannot exceed 500 characters']
    },
    description: {
      type: String,
      trim: true,
      default: null
    },
    lessonNumber: {
      type: Number,
      required: [true, 'lessonNumber is required'],
      min: [1, 'lessonNumber must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'lessonNumber must be an integer'
      }
    },
    durationSeconds: {
      type: Number,
      required: [true, 'durationSeconds is required'],
      default: 0,
      min: [0, 'durationSeconds cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'durationSeconds must be an integer'
      }
    },
    audioUrl: {
      type: String,
      required: [true, 'audioUrl is required'],
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return false;
          return /^https?:\/\/.+/i.test(v);
        },
        message: 'audioUrl must be a valid HTTP/HTTPS URL'
      }
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    publishedDate: {
      type: Date,
      required: [true, 'publishedDate is required']
    },
    sortOrder: {
      type: Number,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'sortOrder must be an integer'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'archived'],
        message: 'Status must be either draft, published, or archived'
      },
      default: 'published'
    }
  },
  {
    collection: 'lessons',
    timestamps: true
  }
);

// Indexes
// 1. Enforce unique sequential lesson number within each book
lessonSchema.index(
  { bookId: 1, lessonNumber: 1 },
  { unique: true, name: 'uniq_lessons_book_lesson_number' }
);

// 2. Fetching lessons within a book by status, custom sortOrder, and lessonNumber
lessonSchema.index(
  { bookId: 1, status: 1, sortOrder: 1, lessonNumber: 1 },
  { name: 'idx_lessons_book_status_order' }
);

// 3. Featured lessons query for homepage spotlight
lessonSchema.index(
  { isFeatured: 1, status: 1, publishedDate: -1 },
  { name: 'idx_lessons_featured' }
);

// 4. Chronological published feeds
lessonSchema.index(
  { status: 1, publishedDate: -1 },
  { name: 'idx_lessons_published_date' }
);

// 5. Duration range filtering (short, medium, long)
lessonSchema.index(
  { durationSeconds: 1 },
  { name: 'idx_lessons_duration' }
);

// 6. Text search across lesson titles and descriptions
lessonSchema.index(
  { title: 'text', description: 'text' },
  { default_language: 'arabic', name: 'idx_lessons_text_search' }
);

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);

export default Lesson;
