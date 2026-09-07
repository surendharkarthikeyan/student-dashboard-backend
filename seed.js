const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./src/models/Student");
const Subject = require("./src/models/Subject");
const Performance = require("./src/models/Performance");

const studentsData = [
  { registerNumber: "22CS101", name: "Surendhar", department: "CSE", semester: 6 },
  { registerNumber: "22CS102", name: "Arun", department: "CSE", semester: 6 },
  { registerNumber: "22CS103", name: "Karthik", department: "CSE", semester: 6 },
  { registerNumber: "22CS104", name: "Priya", department: "CSE", semester: 6 },
  { registerNumber: "22CS105", name: "Anitha", department: "CSE", semester: 6 }
];

const subjectsData = [
  { subjectCode: "CS601", subjectName: "Java Programming", department: "CSE", semester: 6 },
  { subjectCode: "CS602", subjectName: "Database Management Systems", department: "CSE", semester: 6 },
  { subjectCode: "CS603", subjectName: "Operating Systems", department: "CSE", semester: 6 },
  { subjectCode: "CS604", subjectName: "Computer Networks", department: "CSE", semester: 6 },
  { subjectCode: "CS605", subjectName: "Cloud Computing", department: "CSE", semester: 6 },
  { subjectCode: "CS606", subjectName: "Software Engineering", department: "CSE", semester: 6 }
];

const marksByStudent = [
  [
    { internalMark: 25, externalMark: 55, attendance: 90 },
    { internalMark: 23, externalMark: 50, attendance: 85 },
    { internalMark: 22, externalMark: 48, attendance: 88 },
    { internalMark: 24, externalMark: 52, attendance: 91 },
    { internalMark: 20, externalMark: 45, attendance: 80 },
    { internalMark: 26, externalMark: 54, attendance: 94 }
  ],
  [
    { internalMark: 28, externalMark: 58, attendance: 95 },
    { internalMark: 26, externalMark: 55, attendance: 92 },
    { internalMark: 24, externalMark: 51, attendance: 89 },
    { internalMark: 27, externalMark: 56, attendance: 93 },
    { internalMark: 25, externalMark: 49, attendance: 87 },
    { internalMark: 29, externalMark: 57, attendance: 96 }
  ],
  [
    { internalMark: 21, externalMark: 46, attendance: 82 },
    { internalMark: 20, externalMark: 44, attendance: 79 },
    { internalMark: 23, externalMark: 50, attendance: 86 },
    { internalMark: 22, externalMark: 47, attendance: 84 },
    { internalMark: 19, externalMark: 42, attendance: 76 },
    { internalMark: 24, externalMark: 49, attendance: 88 }
  ],
  [
    { internalMark: 30, externalMark: 59, attendance: 97 },
    { internalMark: 28, externalMark: 57, attendance: 94 },
    { internalMark: 27, externalMark: 54, attendance: 92 },
    { internalMark: 29, externalMark: 58, attendance: 96 },
    { internalMark: 26, externalMark: 53, attendance: 91 },
    { internalMark: 31, externalMark: 60, attendance: 98 }
  ],
  [
    { internalMark: 24, externalMark: 52, attendance: 88 },
    { internalMark: 22, externalMark: 48, attendance: 84 },
    { internalMark: 25, externalMark: 53, attendance: 90 },
    { internalMark: 23, externalMark: 50, attendance: 86 },
    { internalMark: 21, externalMark: 46, attendance: 81 },
    { internalMark: 27, externalMark: 55, attendance: 93 }
  ]
];

async function seedDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in .env");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");

    await Performance.deleteMany({});
    await Student.deleteMany({});
    await Subject.deleteMany({});

    const students = await Student.insertMany(studentsData);
    console.log(`Students inserted: ${students.length}`);

    const subjects = await Subject.insertMany(subjectsData);
    console.log(`Subjects inserted: ${subjects.length}`);

    const performancesData = students.flatMap((student, studentIndex) =>
      subjects.map((subject, subjectIndex) => ({
        studentId: student._id,
        subjectId: subject._id,
        ...marksByStudent[studentIndex][subjectIndex]
      }))
    );

    const performances = await Performance.insertMany(performancesData);
    console.log(`Performances inserted: ${performances.length}`);
    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  }
}

seedDatabase();
