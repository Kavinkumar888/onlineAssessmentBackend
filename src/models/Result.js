const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  answers: [{ type: mongoose.Schema.Types.Mixed }],
  correctAnswers: { type: Number, default: 0 },
  wrongAnswers: { type: Number, default: 0 },
  skippedQuestions: { type: Number, default: 0 },
  marks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  timeTaken: { type: Number, default: 0 },
  status: { type: String, enum: ['passed', 'failed', 'in-progress'], default: 'in-progress' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
