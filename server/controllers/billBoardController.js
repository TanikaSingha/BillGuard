const { StatusCodes } = require("http-status-codes");
const Billboard = require("../models/billboardSchema");
const { BadRequest } = require("../errors");

const getAllBillboards = async (req, res) => {
  const { role } = req.user;
  if (role === "NormalUser") throw new BadRequest("Not allowed");

  const billboards = await Billboard.find({})
    .populate({
      path: "reports",
      select: "reportedBy submittedAt status xpAwarded",
    })
    .sort({ "reports.submittedAt": -1 });

  return res.status(StatusCodes.OK).json({
    data: billboards,
    total: billboards.length,
    message: "Billboards retrieved successfully.",
  });
};

const billBoardFeed = async (req, res) => {
  const feedBillboards = await Billboard.find()
    .populate({
      path: "reports",
      options: { sort: { submittedAt: -1 }, limit: 1 },
      select: "imageURL aiAnalysis confidence upvotes downvotes",
    })
    .exec();

  const billboardFeed = feedBillboards.map((b) => {
    const latestReport = b.reports[0];

    let communityConfidence = null;
    if (latestReport) {
      const totalVotes =
        (latestReport.upvotes || 0) + (latestReport.downvotes || 0);
      if (totalVotes > 0) {
        communityConfidence = (latestReport.upvotes / totalVotes) * 100;
      }
    }

    return {
      id: b._id,
      imageURL: latestReport?.imageURL || "",
      location: b.location,
      crowdConfidence: b.crowdConfidence ?? 0,
      communityConfidence,
      verifiedStatus: b.verifiedStatus || "pending",
    };
  });

  res.status(200).json({ success: true, data: billboardFeed });
};

const getBillBoardDetails = async (req, res) => {
  const { billboardId } = req.params;

  if (!billboardId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Billboard ID is required.",
    });
  }

  const billboard = await Billboard.findById(billboardId).populate({
    path: "reports",
    select:
      "reportedBy submittedAt status xpAwarded upvotes downvotes aiAnalysis imageURL annotatedImageURL",
    populate: {
      path: "reportedBy",
      select: "username email",
    },
  });

  if (!billboard) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Billboard not found.",
    });
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    data: billboard,
    message: "Billboard retrieved successfully.",
  });
};

module.exports = { getAllBillboards, billBoardFeed, getBillBoardDetails };
