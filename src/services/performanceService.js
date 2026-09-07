const mongoose = require("mongoose");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Performance = require("../models/Performance");
const calculateGrade = require("../utils/gradeCalculator");

const fieldLimits = {
  internalMark: { min: 0, max: 40 },
  externalMark: { min: 0, max: 60 },
  attendance: { min: 0, max: 100 }
};

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateUpdates(updates) {
  const allowedFields = Object.keys(fieldLimits);
  const updateFields = Object.keys(updates);

  if (updateFields.length === 0) {
    throw createError("At least one performance field is required", 400);
  }

  if (updateFields.some((field) => !allowedFields.includes(field))) {
    throw createError("Only marks and attendance can be updated", 400);
  }

  for (const field of updateFields) {
    const value = updates[field];
    const limits = fieldLimits[field];

    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw createError(`${field} must be a number`, 400);
    }

    if (value < limits.min || value > limits.max) {
      throw createError(
        `${field} must be between ${limits.min} and ${limits.max}`,
        400
      );
    }
  }
}

async function updatePerformance(performanceId, updates) {
  if (!mongoose.isValidObjectId(performanceId)) {
    throw createError("Invalid performance ID", 400);
  }

  validateUpdates(updates);

  const performance = await Performance.findByIdAndUpdate(
    performanceId,
    { $set: updates },
    { new: true, runValidators: true }
  )
    .populate({
      path: "studentId",
      select: "registerNumber",
      model: Student
    })
    .populate({
      path: "subjectId",
      select: "subjectCode subjectName",
      model: Subject
    })
    .lean();

  if (!performance) {
    throw createError("Performance not found", 404);
  }

  const total = performance.internalMark + performance.externalMark;

  return {
    registerNumber: performance.studentId.registerNumber,
    subjectCode: performance.subjectId.subjectCode,
    subjectName: performance.subjectId.subjectName,
    internalMark: performance.internalMark,
    externalMark: performance.externalMark,
    total,
    grade: calculateGrade(total),
    attendance: performance.attendance
  };
}

module.exports = { updatePerformance };
