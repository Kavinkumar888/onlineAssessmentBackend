const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');
const ActivityLog = require('../models/ActivityLog');
const Violation = require('../models/Violation');

const listExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExam = async (req, res) => {
  try {
    const exam = await Exam.create({ ...req.body, createdBy: req.user.id });
    await ActivityLog.create({ user: req.user.id, action: 'Created exam', details: exam.examName });
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    await Question.deleteMany({ examId: req.params.id });
    await Result.deleteMany({ exam: req.params.id });
    res.json({ message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const publishExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    exam.status = 'published';
    await exam.save();
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const closeExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    exam.status = 'closed';
    await exam.save();
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitExam = async (req, res) => {
  try {
    const payload = req.body;
    const result = await Result.create({ ...payload, student: req.user.id, status: 'passed' });
    await ActivityLog.create({ user: req.user.id, action: 'Exam submitted', details: payload.exam });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addViolation = async (req, res) => {
  try {
    const violation = await Violation.create({ ...req.body, user: req.user.id });
    await ActivityLog.create({ user: req.user.id, action: 'Security violation', details: req.body.type });
    res.status(201).json(violation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listExams, createExam, updateExam, deleteExam, publishExam, closeExam, getExamById, submitExam, addViolation };
