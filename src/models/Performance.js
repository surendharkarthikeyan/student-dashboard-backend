const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  internalMark: {
    type: Number,
    required: true,
    min: 0,
    max: 40
  },
  externalMark: {
    type: Number,
    required: true,
    min: 0,
    max: 60
  },
  attendance: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
});

performanceSchema.index({ studentId: 1, subjectId: 1 }, { unique: true });

const Performance = mongoose.model("Performance", performanceSchema);

module.exports = Performance;
