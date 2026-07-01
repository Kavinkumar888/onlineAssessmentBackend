const express = require('express');
const { listResults, myResults, analytics } = require('../controllers/resultController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/analytics', protect, authorizeRoles('admin'), analytics);
router.get('/me', protect, authorizeRoles('student'), myResults);
router.get('/', protect, authorizeRoles('admin'), listResults);

module.exports = router;
