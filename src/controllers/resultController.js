const Result = require('../models/Result');
const Exam = require('../models/Exam');
const User = require('../models/User');

const listResults = async (req, res) => {
  try {
    const results = await Result.find().populate('student').populate('exam').sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const myResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id }).populate('exam').sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const analytics = async (req, res) => {
  try {
    const [students, exams, results] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Exam.countDocuments(),
      Result.find()
    ]);

    const completed = results.filter((r) => r.status !== 'in-progress').length;
    const average = results.length ? (results.reduce((sum, r) => sum + r.marks, 0) / results.length).toFixed(2) : 0;
    const highest = results.length ? Math.max(...results.map((r) => r.marks)) : 0;
    const lowest = results.length ? Math.min(...results.map((r) => r.marks)) : 0;
    const passRate = results.length ? ((results.filter((r) => r.status === 'passed').length / results.length) * 100).toFixed(2) : 0;

    res.json({ students, exams, completed, average, highest, lowest, passRate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listResults, myResults, analytics };
