import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  lessonNumber: { type: Number, required: true, min: 1 },
  description: { type: String, default: '' },
  audioUrl: { type: String, required: true },
  durationSeconds: { type: Number, default: 0, min: 0 },
  publishedAt: { type: Date, default: null },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' }
}, { timestamps: true });

lessonSchema.index({ book: 1, lessonNumber: 1 }, { unique: true });

export default mongoose.model('Lesson', lessonSchema);
