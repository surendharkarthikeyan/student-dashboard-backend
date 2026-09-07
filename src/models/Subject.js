const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: true,
    unique: true
  },
  subjectName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  }
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
