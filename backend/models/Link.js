import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL starting with http:// or https://']
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 50
  }]
}, {
  timestamps: true
});

// Index for efficient searching
linkSchema.index({ userId: 1, title: 'text', description: 'text', tags: 1 });

export default mongoose.model('Link', linkSchema);
