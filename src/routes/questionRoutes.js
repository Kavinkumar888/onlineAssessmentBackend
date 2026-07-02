const express = require('express');
const { listQuestions, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorizeRoles('admin', 'student'), listQuestions);
router.post('/', protect, authorizeRoles('admin'), createQuestion);
router.put('/:id', protect, authorizeRoles('admin'), updateQuestion);
router.delete('/:id', protect, authorizeRoles('admin'), deleteQuestion);

module.exports = router;
