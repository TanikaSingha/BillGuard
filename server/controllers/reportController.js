const Report = require("../models/reportSchema");
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors/index");
const { link } = require("../routes/authRouter");
const User = require("../models/userSchema");
const AdminUser = require("../models/rolesSchema").AdminUser;
const NormalUser = require("../models/rolesSchema").NormalUser;
const { default: axios } = require("axios");
const checkAndAwardBadges = require("../utils/awardBadges");
const calculateXP = require("../utils/calculateXP");

// Admin can get all reports
const getAllReports = async (req, res) => {
  const { role } = req.user;
  const {
    violationType,
    status,
    startDate,
    endDate,
    verdict,
    location,
    page = 1,
    limit = 10,
  } = req.query;

  // Restrict filters for NormalUser
  if (
    role === "NormalUser" &&
    (violationType || status || startDate || endDate || verdict || location)
  ) {
    throw new BadRequest("Normal users cannot filter reports.");
  }

  const query = {};

  // Apply filters only for Admin/Other roles
  if (role !== "NormalUser") {
    if (violationType) query.violationType = violationType;
    if (status) query.status = status;
    if (verdict) query["aiAnalysis.verdict"] = verdict;
    if (location) query.location = location;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
  }

  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * pageSize;

  const reports = await Report.find(query)
    .populate("reportedBy", "username email role")
    .sort({ createdAt: -1 }) // newest first
    .skip(skip)
    .limit(pageSize);

  const totalReports = await Report.countDocuments(query);

  return res.status(StatusCodes.OK).json({
    data: reports,
    total: totalReports,
    page: pageNumber,
    totalPages: Math.ceil(totalReports / pageSize),
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
  await NormalUser.findByIdAndUpdate(id, { $inc: { reportsSubmitted: 1 } });
  console.log("Report created:", report);

  return res.status(StatusCodes.CREATED).json({
    data: report,
    message: "Report created successfully.",
  });
};

const updateReport = async (req, res) => {
  const { id, role } = req.user;
  const { reportId } = req.params;

  let report = await Report.findById(reportId).populate("reportedBy");
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
    oldStatus === "pending" &&
    fields.status !== "pending"
  ) {
    fields.reviewedBy = id;
    fields.reviewedAt = new Date();

    if (fields.adminNotes) {
      fields.adminNotes = fields.adminNotes.trim();
    }
  }

  report = await Report.findByIdAndUpdate(
    reportId,
    { $set: fields },
    { new: true, runValidators: true }
  ).populate("reportedBy reviewedBy");

  if (role === "AdminUser" && oldStatus !== report.status) {
    let newXP = 0;

    if (
      report.status === "verified_unauthorized" ||
      report.status === "verified_authorized"
    ) {
      newXP = calculateXP(report);
    }

    const xpDiff = newXP - (report.xpAwarded || 0);

    if (xpDiff !== 0) {
      await NormalUser.findByIdAndUpdate(report.reportedBy._id, {
        $inc: { xp: xpDiff },
      });
      report.xpAwarded = newXP;
      await checkAndAwardBadges(report.reportedBy, { report });
      await report.save();
    }
    console.log("There");

    if (report.reviewedBy) {
      if (
        report.status === "verified_unauthorized" ||
        report.status === "verified_authorized"
      ) {
        console.log("Here");
        await AdminUser.findByIdAndUpdate(report.reviewedBy, {
          $inc: { verifiedReports: 1 },
        });
        await NormalUser.findByIdAndUpdate(report.reportedBy._id, {
          $inc: { reportsVerified: 1 },
        });
      } else if (report.status === "rejected") {
        await AdminUser.findByIdAndUpdate(report.reviewedBy, {
          $inc: { rejectedReports: 1 },
        });
      }
    }
  }

  return res.status(StatusCodes.OK).json({
    data: report,
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
    .sort({ submittedAt: -1 })
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
