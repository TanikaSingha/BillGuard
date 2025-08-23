const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");
const { Error } = require("mongoose");
const evaluateHoardingViolations = require("../utils/violationEvaluator");
const {
  calculateBillboardDimensions,
} = require("../utils/calculateDimensions");

const getModelResponse = async (req, res) => {
  try {
    const {
      url,
      location: {
        coords: { latitude, longitude },
      },
      exifData,
    } = req.body;
    const response = await axios.post(
      "http://127.0.0.1:8000/predict_from_url/",
      { url }
    );
    if (!response) throw new Error("No response from AI model service!");

    const annotatedImageUrl = response.data.annotated_image_url;
    // const hoardingDimensions = calculateBillboardDimensions(exifData);
    const hoardingDimensions = {};
    const hoardings = [
      {
        width: hoardingDimensions?.width || 50,
        height: hoardingDimensions?.height || 10,
        gps: { lat: latitude, lon: longitude },
        angle: hoardingDimensions?.angle || 20,
        ocrText: [{ text: "alcohol" }],
      },
    ];

    const evaluation = await evaluateHoardingViolations(hoardings);

    const verdict = {
      annotatedImageUrl,
      location: { latitude, longitude },
      details: hoardings[0],
      violations: evaluation.results[0].violations,
      aiAnalysis: evaluation.results[0].aiAnalysis,
    };

    return res.status(200).json({ status: "success", verdict });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while processing your request." });
  }
};

module.exports = {
  getModelResponse,
};
