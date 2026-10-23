import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    seriesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Series',
      required: [true, 'seriesId is required']
    },
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [255, 'Book title cannot exceed 255 characters']
    },
    description: {
      type: String,
      trim: true,
      default: null
    },
    coverUrl: {
      type: String,
      trim: true,
      default: null
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
    collection: 'books',
    timestamps: true
  }
);

// Indexes
// 1. Finding books in a series by status and sort order
bookSchema.index(
  { seriesId: 1, status: 1, sortOrder: 1 },
  { name: 'idx_books_series_status_sort' }
);

// 2. Lookup by seriesId
bookSchema.index({ seriesId: 1 }, { name: 'idx_books_series' });

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

export default Book;
