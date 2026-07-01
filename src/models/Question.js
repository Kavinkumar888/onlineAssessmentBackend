const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  question: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'multiple-answer', 'true-false', 'short-answer'], default: 'mcq' },
  options: [{ type: String }],
  correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
  marks: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0 },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  explanation: { type: String, default: '' },
  image: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
