import mongoose from 'mongoose';

const seriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Series title is required'],
      trim: true,
      maxlength: [255, 'Series title cannot exceed 255 characters']
    },
    description: {
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
    collection: 'series',
    timestamps: true
  }
);

// Index for listing active series ordered by sortOrder
seriesSchema.index({ status: 1, sortOrder: 1 }, { name: 'idx_series_status_sort' });

const Series = mongoose.models.Series || mongoose.model('Series', seriesSchema);

export default Series;
