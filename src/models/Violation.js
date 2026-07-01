const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  type: { type: String, required: true },
  details: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Violation', violationSchema);
