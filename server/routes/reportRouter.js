const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const {
  createReport,
  getReportsByUser,
  getReportById,
  getAllReports,
} = require("../controllers/reportController");
const verifyAdmin = require("../middleware/adminMiddleware");
const reportRouter = express.Router();

reportRouter.post("/submit", verifyToken, createReport);
reportRouter.get("/user/:userId", verifyToken, getReportsByUser);
reportRouter.get("/details/:reportId", verifyToken, getReportById);
reportRouter.get("/all", verifyToken, verifyAdmin, getAllReports);
module.exports = reportRouter;
