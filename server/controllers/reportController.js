const Report = require("../models/reportSchema");
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors/index");
const { link } = require("../routes/authRouter");
const User = require("../models/userSchema");
const { default: axios } = require("axios");

// Admin can get all reports
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
  console.log("Called createReport");
  const { id, role } = req.user;
  const {
    issueDescription,
    imageURL,
    annotatedURL,
    violationType,
    location,
    ...extraFields
  } = req.body;

  if (role === "AdminUser") {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "Only Normal Users can create reports.",
    });
  }

  if (!location?.coordinates || location.coordinates.length !== 2) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid location coordinates.",
    });
  }

  const [longitude, latitude] = location.coordinates;
  let newLocation = { ...location, address: "N/A", zone: "N/A" };

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const loc = await axios.get(url, {
      headers: { "User-Agent": "Billguard-Hackathon/2.0" },
    });
    console.log(loc.data);

    newLocation.address = loc.data.display_name || "N/A";
    newLocation.zoneId = loc.data.osm_id || "N/A";
  } catch (err) {
    console.warn("Reverse geocoding failed:", err.message);
  }

  // Check required fields
  const requiredFields = {
    issueDescription,
    imageURL,
    annotatedURL,
    violationType,
    location: newLocation,
  };

  const missingFields = Object.entries(requiredFields)
    .filter(
      ([_, value]) =>
        !value || (typeof value === "string" && value.trim() === "")
    )
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  // Sanitize and create report
  const sanitizedReport = {
    issueDescription: issueDescription.trim(),
    imageURL: imageURL.trim(),
    annotatedURL: annotatedURL.trim(),
    violationType,
    location: newLocation, // <- use processed location
    reportedBy: id,
    ...extraFields,
  };

  const report = await Report.create(sanitizedReport);
  console.log("Report created:", report);

  return res.status(StatusCodes.CREATED).json({
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

const getReportsByUser = async (req, res) => {
  const { userId } = req.params;
  const { role, id } = req.user;

  if (role === "NormalUser" && id !== userId) {
    throw new Unauthorized("You can only fetch your own reports.");
  }
  const {
    violationType,
    status,
    startDate,
    verdict,
    endDate,
    page = 1,
    limit = 10,
  } = req.query;

  const query = { reportedBy: userId };

  if (violationType) {
    query.violationType = violationType;
  }

  if (status) {
    query.status = status;
  }
  if (verdict) {
    query["aiAnalysis.verdict"] = verdict;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * pageSize;

  const reports = await Report.find(query)
    .populate("reportedBy", "username email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize);

  const totalReports = await Report.countDocuments(query);

  res.status(StatusCodes.OK).json({
    data: reports,
    total: totalReports,
    page: pageNumber,
    totalPages: Math.ceil(totalReports / pageSize),
    message: "User reports fetched successfully.",
  });
};

const getReportById = async (req, res) => {
  const { reportId } = req.params;
  const { id: userId, role } = req.user;

  const report = await Report.findById(reportId)
    .populate("reportedBy", "username email role")
    .lean();

  if (!report) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `No report found with id: ${reportId}`,
    });
  }

  const isOwner = report.reportedBy._id.toString() === userId;
  const isAdmin = role === "AdminUser";

  if (!isOwner && !isAdmin) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "You do not have permission to view this report.",
    });
  }

  return res.status(StatusCodes.OK).json({
    data: report,
    message: "Report fetched successfully.",
  });
};

module.exports = {
  getAllReports,
  createReport,
  getReportsByUser,
  getReportById,
  updateReport,
};
