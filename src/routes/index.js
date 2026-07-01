const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/students', require('./studentRoutes'));
router.use('/exams', require('./examRoutes'));
router.use('/questions', require('./questionRoutes'));
router.use('/results', require('./resultRoutes'));

module.exports = router;
