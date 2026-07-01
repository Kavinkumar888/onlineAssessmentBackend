const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  subject: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  duration: { type: Number, required: true },
  instructions: { type: String, default: '' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  passingMarks: { type: Number, required: true },
  negativeMarks: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'closed'], default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
