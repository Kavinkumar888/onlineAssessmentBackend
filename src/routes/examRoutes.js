const express = require('express');
const { listExams, createExam, updateExam, deleteExam, publishExam, closeExam, getExamById, submitExam, addViolation } = require('../controllers/examController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, listExams);
router.get('/:id', protect, getExamById);
router.post('/', protect, authorizeRoles('admin'), createExam);
router.put('/:id', protect, authorizeRoles('admin'), updateExam);
router.delete('/:id', protect, authorizeRoles('admin'), deleteExam);
router.patch('/:id/publish', protect, authorizeRoles('admin'), publishExam);
router.patch('/:id/close', protect, authorizeRoles('admin'), closeExam);
router.post('/submit', protect, authorizeRoles('student'), submitExam);
router.post('/violations', protect, authorizeRoles('student'), addViolation);

module.exports = router;
