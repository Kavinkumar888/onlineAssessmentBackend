const express = require('express');
const { listStudents, createStudent, updateStudent, deleteStudent, toggleStudentStatus } = require('../controllers/studentController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorizeRoles('admin'), listStudents);
router.post('/', protect, authorizeRoles('admin'), createStudent);
router.put('/:id', protect, authorizeRoles('admin'), updateStudent);
router.delete('/:id', protect, authorizeRoles('admin'), deleteStudent);
router.patch('/:id/toggle-status', protect, authorizeRoles('admin'), toggleStudentStatus);

module.exports = router;
