const bcrypt = require("bcryptjs");
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

const listStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const payload = req.body;
    const passwordHash = await bcrypt.hash(payload.password || 'Student@123', 10);
    const student = await User.create({ ...payload, password: passwordHash, role: 'student' });
    await ActivityLog.create({ user: req.user.id, action: 'Created student', details: student.name });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleStudentStatus = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    student.status = student.status === 'active' ? 'disabled' : 'active';
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listStudents, createStudent, updateStudent, deleteStudent, toggleStudentStatus };
