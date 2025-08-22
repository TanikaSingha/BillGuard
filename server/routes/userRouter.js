const express = require("express");
const userRouter = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const uploadImages = require("../utils/multer");
const { uploadImage } = require("../controllers/userController");
userRouter.post(
  "/uploadImage",
  verifyToken,
  uploadImages.single("image"),
  uploadImage
);

module.exports = userRouter;
