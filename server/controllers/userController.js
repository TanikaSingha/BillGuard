const { StatusCodes } = require("http-status-codes");

const uploadImage = (req, res) => {
  try {
    console.log("File upload request received", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = req.file.path;
    return res.json({
      message: "Upload successful",
      url: imageUrl,
      details: req.file,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadImage,
};
