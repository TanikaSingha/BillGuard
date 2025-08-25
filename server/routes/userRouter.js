const express = require("express");
const userRouter = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const uploadImages = require("../utils/multer");
const {
  uploadImage,
  getAllUsers,
  getUserInfo,
  deleteUser,
} = require("../controllers/userController");
const verifyAdmin = require("../middleware/adminMiddleware");
userRouter.post(
  "/uploadImage",
  verifyToken,
  uploadImages.single("image"),
  uploadImage
);
userRouter.get("/all", verifyToken, verifyAdmin, getAllUsers);
userRouter.get("/details/:userId", verifyToken, verifyAdmin, getUserInfo);
userRouter.delete("/delete/:userId", verifyToken, verifyAdmin, deleteUser);
module.exports = userRouter;
