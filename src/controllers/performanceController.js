const performanceService = require("../services/performanceService");

const updatePerformance = async (req, res, next) => {
  try {
    const { performanceId } = req.params;
    const updatedPerformance = await performanceService.updatePerformance(
      performanceId,
      req.body
    );
    const io = req.app.get("io");

    io.emit("performanceUpdated", {
      registerNumber: updatedPerformance.registerNumber,
      message: "Student performance updated"
    });

    return res.json({
      success: true,
      data: updatedPerformance
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { updatePerformance };
