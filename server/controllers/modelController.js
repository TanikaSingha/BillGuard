const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");
const { Error } = require("mongoose");

const getModelResponse = async (req, res) => {
  try {
    const { url, location } = req.body;
    const response = await axios.post(
      "http://127.0.0.1:8000/predict_from_url/",
      {
        url,
      }
    );
    if (!response) {
      throw new Error("No response from AI model service!");
    }
    return res.status(StatusCodes.OK).json(response.data);
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
