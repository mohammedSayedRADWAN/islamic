import mongoose from 'mongoose';

const qualificationSchema = new mongoose.Schema(
  {
    qualification: {
      type: String,
      required: [true, 'Qualification description is required'],
      trim: true,
      maxlength: [500, 'Qualification cannot exceed 500 characters']
    },
    sortOrder: {
      type: Number,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'sortOrder must be an integer'
      }
    }
  },
  { _id: false }
);

const bookTaughtSchema = new mongoose.Schema(
  {
    bookTitle: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [500, 'Book title cannot exceed 500 characters']
    },
    sortOrder: {
      type: Number,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'sortOrder must be an integer'
      }
    }
  },
  { _id: false }
);

const urlValidator = {
  validator: function (v) {
    if (!v) return true;
    return /^https?:\/\/.+/i.test(v);
  },
  message: 'Invalid URL format'
};

const socialsSchema = new mongoose.Schema(
  {
    youtube: {
      type: String,
      trim: true,
      validate: urlValidator
    },
    telegram: {
      type: String,
      trim: true,
      validate: urlValidator
    },
    twitter: {
      type: String,
      trim: true,
      validate: urlValidator
    },
    whatsapp: {
      type: String,
      trim: true,
      validate: urlValidator
    }
  },
  { _id: false }
);

const sheikhSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sheikh name is required'],
      trim: true,
      maxlength: [255, 'Name cannot exceed 255 characters']
    },
    title: {
      type: String,
      required: [true, 'Sheikh title is required'],
      trim: true,
      maxlength: [255, 'Title cannot exceed 255 characters']
    },
    bio: {
      type: String,
      trim: true,
      default: null
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: null
    },
    teachingMethodology: {
      type: String,
      trim: true,
      default: null
    },
    totalAudioHours: {
      type: String,
      trim: true,
      default: null
    },
    qualifications: {
      type: [qualificationSchema],
      default: []
    },
    booksTaught: {
      type: [bookTaughtSchema],
      default: []
    },
    socials: {
      type: socialsSchema,
      default: () => ({})
    }
  },
  {
    collection: 'sheikhs',
    timestamps: true
  }
);

const Sheikh = mongoose.models.Sheikh || mongoose.model('Sheikh', sheikhSchema);

export default Sheikh;
