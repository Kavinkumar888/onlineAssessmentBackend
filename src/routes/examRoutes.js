const express = require("express");

const {
  listExams,
  createExam,
  updateExam,
  deleteExam,
  publishExam,
  closeExam,
  getExamById,
  submitExam,
  checkExamAttempt,
  addViolation,
} = require("../controllers/examController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/auth");

const router = express.Router();

// ===================================
// List Exams
// ===================================

router.get(
  "/",
  protect,
  listExams
);

// ===================================
// Check Student Attempt
// IMPORTANT:
// Place this BEFORE "/:id"
// ===================================

router.get(
  "/check/:examId",
  protect,
  authorizeRoles("student"),
  checkExamAttempt
);

// ===================================
// Get Single Exam
// ===================================

router.get(
  "/:id",
  protect,
  getExamById
);

// ===================================
// Create Exam
// ===================================

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createExam
);

// ===================================
// Update Exam
// ===================================

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateExam
);

// ===================================
// Delete Exam
// ===================================

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteExam
);

// ===================================
// Publish / Activate Exam
// ===================================

router.patch(
  "/:id/publish",
  protect,
  authorizeRoles("admin"),
  publishExam
);

// ===================================
// Close / Complete Exam
// ===================================

router.patch(
  "/:id/close",
  protect,
  authorizeRoles("admin"),
  closeExam
);

// ===================================
// Submit Exam
// ===================================

router.post(
  "/submit",
  protect,
  authorizeRoles("student"),
  submitExam
);

// ===================================
// Add Security Violation
// ===================================

router.post(
  "/violations",
  protect,
  authorizeRoles("student"),
  addViolation
);

module.exports = router;