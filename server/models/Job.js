const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Please add a job type'],
    enum: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract'],
    default: 'Internship'
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['IT & Software', 'Marketing', 'Design', 'Finance', 'Human Resources', 'Others'],
    default: 'IT & Software'
  },
  salaryRange: {
    type: String,
    default: 'Negotiable'
  },
  requirements: {
    type: [String],
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  applicantsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
jobSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
