const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const {
  createReport,
  getReportsByUser,
  getReportById,
} = require("../controllers/reportController");
const reportRouter = express.Router();

reportRouter.post("/submit", verifyToken, createReport);
reportRouter.get("/user/:userId", verifyToken, getReportsByUser);
reportRouter.get("/user/:userId/report/:reportId", verifyToken, getReportById);
module.exports = reportRouter;
