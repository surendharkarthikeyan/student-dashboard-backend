const express = require("express");
const {
	getStudentSummary,
	getStudentPerformance
} = require("../controllers/studentController");

const router = express.Router();

router.get("/:registerNumber/performance", getStudentPerformance);
router.get("/:registerNumber", getStudentSummary);

module.exports = router;
