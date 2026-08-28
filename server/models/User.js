import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  avatarUrl: { type: String, default: '' },
  title: { type: String, default: '' },
  bio: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
