const express = require("express");
const { updatePerformance } = require("../controllers/performanceController");

const router = express.Router();

router.put("/:performanceId", updatePerformance);

module.exports = router;
