const studentService = require("../services/studentService");

const getStudentSummary = async (req, res, next) => {
  try {
    const { registerNumber } = req.params;
    const result = await studentService.getStudentSummary(registerNumber);

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    return next(error);
  }
};

const getStudentPerformance = async (req, res, next) => {
  try {
    const { registerNumber } = req.params;
    const result = await studentService.getStudentPerformance(registerNumber, req.query);

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getStudentSummary, getStudentPerformance };
