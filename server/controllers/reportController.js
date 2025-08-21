const Report = require("../models/reportSchema");
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors/index");
const { link } = require("../routes/authRouter");
const User = require("../models/userSchema");
const getAllReports = async (req, res) => {
  const { role } = req.user;
  const allowedFilters = [
    "status",
    "violationType",
    "aiAnalysis.verdict",
    "location",
    "createdAt",
  ];

  let filters = {};
  if (role === "NormalUser") {
    if (Object.keys(req.query).length > 0) {
      throw new BadRequest("Normal users cannot filter reports.");
    }
  } else {
    for (const key of Object.keys(req.query)) {
      if (allowedFilters.includes(key)) {
        filters[key] = req.query[key];
      }
    }
  }

  const { page = 1, limit = 10 } = req.query;
  if (isNaN(page) || isNaN(limit)) {
    throw new BadRequest("Page and limit must be numbers.");
  }

  const reports = await Report.find(filters)
    .populate("reportedBy", "username email role")
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Report.countDocuments(filters);

  return res.status(StatusCodes.OK).json({
    data: reports,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    message: "Reports retrieved successfully.",
  });
};

const createReport = async (req, res) => {
  const { id, role } = req.user;
  const {
    issueDescription,
    imageURL,
    violationType,
    location,
    ...extraFields
  } = req.body;

  if (role === "AdminUser") {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "Only Normal Users can create reports.",
    });
  }

  const requiredFields = {
    issueDescription,
    imageURL,
    violationType,
    location,
  };
  const missingFields = Object.entries(requiredFields)
    .filter(([_, value]) => !value || String(value).trim() === "")
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  const sanitizedReport = {
    issueDescription: issueDescription.trim(),
    imageURL: imageURL.trim(),
    violationType: violationType.trim(),
    location: location.trim(),
    reportedBy: id,
    ...extraFields,
  };

  const report = await Report.create(sanitizedReport);

  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: report,
    message: "Report created successfully.",
  });
};

const updateReport = async (req, res) => {
  const { id, role } = req.user;
  const { reportId } = req.params;

  const report = await Report.findById(reportId).populate("reportedBy");
  if (!report) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: `No report found with id: ${reportId}`,
    });
  }

  if (report.reportedBy._id.toString() !== id && role !== "AdminUser") {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "You do not have permission to update this report.",
    });
  }

  const fields = { ...req.body };
  const oldStatus = report.status;

  if (
    role === "AdminUser" &&
    fields.status &&
    oldStatus === "Pending" &&
    fields.status !== "Pending"
  ) {
    fields.reviewedBy = id;
    fields.reviewedAt = new Date();
  }

  let updatedReport = await Report.findByIdAndUpdate(
    reportId,
    { $set: fields },
    { new: true, runValidators: true }
  ).populate("reportedBy reviewedBy");

  if (role === "AdminUser" && oldStatus !== updatedReport.status) {
    if (oldStatus !== "Approved" && updatedReport.status === "Approved") {
      await User.findByIdAndUpdate(report.reportedBy._id, {
        $inc: { xp: 50 },
      });
    } else if (
      oldStatus === "Approved" &&
      updatedReport.status !== "Approved"
    ) {
      await User.findByIdAndUpdate(report.reportedBy._id, {
        $inc: { xp: -50 },
      });
    }
  }

  return res.status(StatusCodes.OK).json({
    data: updatedReport,
    message: "Report updated successfully.",
  });
};

module.exports = {
  getAllReports,
  createReport,
  updateReport,
};
