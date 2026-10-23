import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [255, 'Email cannot exceed 255 characters'],
      validate: {
        validator: function (v) {
          if (!v) return false;
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: 'Invalid email address format'
      }
    },
    passwordHash: {
      type: String,
      required: [true, 'passwordHash is required'],
      select: false
    },
    displayName: {
      type: String,
      trim: true,
      default: null,
      maxlength: [100, 'Display name cannot exceed 100 characters']
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin'
      },
      default: 'user'
    },
    themePreference: {
      type: String,
      enum: {
        values: ['light', 'dark', 'system'],
        message: 'Theme preference must be light, dark, or system'
      },
      default: 'system'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    collection: 'users',
    timestamps: true
  }
);

// Note: Mongoose automatically creates a unique index on 'email' due to unique: true.
// Custom index explicitly named for clarity:
userSchema.index({ email: 1 }, { unique: true, name: 'uniq_users_email' });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
