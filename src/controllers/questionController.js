const Question = require('../models/Question');
const ActivityLog = require('../models/ActivityLog');

const listQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ examId: req.query.examId }).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    await ActivityLog.create({ user: req.user.id, action: 'Created question', details: question.question });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listQuestions, createQuestion, updateQuestion, deleteQuestion };
