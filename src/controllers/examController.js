const Exam = require("../models/Exam");
const Question = require("../models/Question");
const Result = require("../models/Result");
const ActivityLog = require("../models/ActivityLog");
const Violation = require("../models/Violation");

// =====================================
// Get All Exams
// =====================================

const listExams = async (req, res) => {
  try {
    let exams;

    if (req.user.role === "student") {
      exams = await Exam.find({
        status: "active",
      }).sort({
        createdAt: -1,
      });
    } else {
      exams = await Exam.find().sort({
        createdAt: -1,
      });
    }

    return res.status(200).json(exams);
  } catch (error) {
    console.error("List Exams Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get Exam By Id
// =====================================

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    return res.json(exam);
  } catch (error) {
    console.error("Get Exam Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Create Exam
// =====================================

const createExam = async (req, res) => {
  try {
    const exam = new Exam({
      examName: req.body.examName,
      subject: req.body.subject,
      department: req.body.department,
      year: req.body.year,
      duration: req.body.duration,
      instructions: req.body.instructions,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      passingMarks: req.body.passingMarks,
      negativeMarks: req.body.negativeMarks,
      status: req.body.status || "draft",
      createdBy: req.user._id || req.user.id,
    });

    await exam.save();

    await ActivityLog.create({
      user: req.user._id || req.user.id,
      action: "Created Exam",
      details: exam.examName,
    });

    return res.status(201).json({
      success: true,
      message: "Exam Created Successfully",
      exam,
    });
  } catch (error) {
    console.error("Create Exam Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Update Exam
// =====================================
// =====================================
// Update Exam
// =====================================

const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    exam.examName = req.body.examName;
    exam.subject = req.body.subject;
    exam.department = req.body.department;
    exam.year = req.body.year;
    exam.duration = req.body.duration;
    exam.instructions = req.body.instructions;
    exam.startTime = req.body.startTime;
    exam.endTime = req.body.endTime;
    exam.passingMarks = req.body.passingMarks;
    exam.negativeMarks = req.body.negativeMarks;
    exam.status = req.body.status;

    await exam.save();

    await ActivityLog.create({
      user: req.user._id || req.user.id,
      action: "Updated Exam",
      details: exam.examName,
    });

    return res.json({
      success: true,
      message: "Exam Updated Successfully",
      exam,
    });

  } catch (error) {

    console.error("Update Exam Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Delete Exam
// =====================================

const deleteExam = async (req, res) => {
  try {

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    await Exam.findByIdAndDelete(req.params.id);

    await Question.deleteMany({
      examId: req.params.id,
    });

    await Result.deleteMany({
      exam: req.params.id,
    });

    await ActivityLog.create({
      user: req.user._id || req.user.id,
      action: "Deleted Exam",
      details: exam.examName,
    });

    return res.json({
      success: true,
      message: "Exam Deleted Successfully",
    });

  } catch (error) {

    console.error("Delete Exam Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Publish Exam
// =====================================

const publishExam = async (req, res) => {
  try {

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    exam.status = "active";

    await exam.save();

    await ActivityLog.create({
      user: req.user._id || req.user.id,
      action: "Activated Exam",
      details: exam.examName,
    });

    return res.json({
      success: true,
      message: "Exam Activated",
      exam,
    });

  } catch (error) {

    console.error("Publish Exam Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Close Exam
// =====================================

const closeExam = async (req, res) => {
  try {

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    exam.status = "completed";

    await exam.save();

    await ActivityLog.create({
      user: req.user._id || req.user.id,
      action: "Completed Exam",
      details: exam.examName,
    });

    return res.json({
      success: true,
      message: "Exam Completed",
      exam,
    });

  } catch (error) {

    console.error("Close Exam Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Submit Exam
// =====================================
// =====================================
// Submit Exam
// =====================================

const submitExam = async (req, res) => {
  try {

    const payload = req.body;

    const alreadySubmitted = await Result.findOne({
      student: req.user._id || req.user.id,
      exam: payload.exam,
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        success: false,
        message: "You have already attended this exam.",
      });
    }

    const result = await Result.create({
      ...payload,
      student: req.user._id || req.user.id,
      status: "passed",
    });

    await ActivityLog.create({
      user: req.user._id || req.user.id,
      action: "Submitted Exam",
      details: payload.exam,
    });

    return res.status(201).json({
      success: true,
      message: "Exam Submitted Successfully",
      result,
    });

  } catch (error) {

    console.error("Submit Exam Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Check Exam Attempt
// =====================================

const checkExamAttempt = async (req, res) => {
  try {

    const result = await Result.findOne({
      student: req.user._id || req.user.id,
      exam: req.params.examId,
    });

    return res.json({
      alreadySubmitted: !!result,
    });

  } catch (error) {

    console.error("Check Attempt Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Add Security Violation
// =====================================

const addViolation = async (req, res) => {
  try {

    const violation = await Violation.create({
      ...req.body,
      user: req.user._id || req.user.id,
    });

    await ActivityLog.create({
      user: req.user._id || req.user.id,
      action: "Security Violation",
      details: req.body.type || "Unknown",
    });

    return res.status(201).json({
      success: true,
      message: "Violation Recorded",
      violation,
    });

  } catch (error) {

    console.error("Violation Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Export Controllers
// =====================================

module.exports = {
  listExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  publishExam,
  closeExam,
  submitExam,
  checkExamAttempt,
  addViolation,
};