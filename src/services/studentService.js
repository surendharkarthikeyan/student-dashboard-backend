const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Performance = require("../models/Performance");
const calculateGrade = require("../utils/gradeCalculator");

async function getStudentRecords(registerNumber) {
  const student = await Student.findOne({ registerNumber });

  if (!student) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  const performances = await Performance.find({ studentId: student._id })
    .populate({
      path: "subjectId",
      select: "subjectCode subjectName",
      model: Subject
    })
    .lean();

  const performance = performances.map((record) => {
    const total = record.internalMark + record.externalMark;

    return {
      subjectCode: record.subjectId.subjectCode,
      subjectName: record.subjectId.subjectName,
      internalMark: record.internalMark,
      externalMark: record.externalMark,
      total,
      grade: calculateGrade(total),
      attendance: record.attendance
    };
  });

  return { student, performance };
}

async function getStudentSummary(registerNumber) {
  const { student, performance } = await getStudentRecords(registerNumber);

  const totalSubjects = performance.length;
  const averageMark = totalSubjects
    ? performance.reduce((sum, record) => sum + record.total, 0) / totalSubjects
    : 0;
  const attendance = totalSubjects
    ? performance.reduce((sum, record) => sum + record.attendance, 0) / totalSubjects
    : 0;
  const status = totalSubjects > 0 && performance.every(
    (record) => record.total >= 40 && record.attendance >= 75
  )
    ? "PASS"
    : "FAIL";

  return {
    student: {
      registerNumber: student.registerNumber,
      name: student.name,
      department: student.department,
      semester: student.semester
    },
    summary: {
      totalSubjects,
      averageMark: Number(averageMark.toFixed(2)),
      attendance: Number(attendance.toFixed(2)),
      status
    },
    performance
  };
}

function getPositiveInteger(value, defaultValue) {
  if (value === undefined) return defaultValue;

  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    const error = new Error("Page and limit must be positive integers");
    error.statusCode = 400;
    throw error;
  }

  return parsedValue;
}

function getSortValue(record, sortBy) {
  if (sortBy === "subjectName") return record.subjectName;
  if (sortBy === "total") return record.total;
  if (sortBy === "grade") {
    return ["F", "D", "C", "B", "B+", "A", "A+"].indexOf(record.grade);
  }
  return record[sortBy];
}

async function getStudentPerformance(registerNumber, query = {}) {
  const { performance } = await getStudentRecords(registerNumber);
  const page = getPositiveInteger(query.page, 1);
  const limit = getPositiveInteger(query.limit, 3);
  const sortBy = query.sortBy || "subjectName";
  const order = (query.order || "asc").toLowerCase();
  const sortableFields = [
    "subjectName",
    "internalMark",
    "externalMark",
    "total",
    "attendance",
    "grade"
  ];

  if (!sortableFields.includes(sortBy) || !["asc", "desc"].includes(order)) {
    const error = new Error("Invalid sorting parameters");
    error.statusCode = 400;
    throw error;
  }

  const filteredPerformance = performance.filter((record) => {
    const matchesGrade = query.grade === undefined || record.grade === query.grade;
    const minimumAttendance = query.minAttendance === undefined
      ? null
      : Number(query.minAttendance);

    if (minimumAttendance !== null && Number.isNaN(minimumAttendance)) {
      const error = new Error("minAttendance must be a number");
      error.statusCode = 400;
      throw error;
    }

    return matchesGrade
      && (minimumAttendance === null || record.attendance >= minimumAttendance);
  });

  filteredPerformance.sort((firstRecord, secondRecord) => {
    const firstValue = getSortValue(firstRecord, sortBy);
    const secondValue = getSortValue(secondRecord, sortBy);
    const comparison = typeof firstValue === "string"
      ? firstValue.localeCompare(secondValue)
      : firstValue - secondValue;

    return order === "asc" ? comparison : -comparison;
  });

  const totalRecords = filteredPerformance.length;
  const totalPages = Math.ceil(totalRecords / limit);
  const skip = (page - 1) * limit;

  return {
    data: filteredPerformance.slice(skip, skip + limit),
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
}

module.exports = { getStudentSummary, getStudentPerformance };
