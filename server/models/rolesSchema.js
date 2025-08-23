const mongoose = require("mongoose");
const User = require("./userSchema");

const normalUserSchema = new mongoose.Schema({
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  reportsSubmitted: { type: Number, default: 0 },
  reportsVerified: { type: Number, default: 0 },
  badges: [{ type: String, default: [] }],
});

const adminSchema = new mongoose.Schema({
  department: { type: String, required: [true, "Department is required!"] },
  permissions: {
    type: [String],
    default: ["viewReports", "verifyReports", "manageUsers"],
  },
  verifiedReports: { type: Number, default: 0 },
  rejectedReports: { type: Number, default: 0 },
});

const NormalUser = User.discriminator("NormalUser", normalUserSchema);
const AdminUser = User.discriminator("AdminUser", adminSchema);

module.exports = { NormalUser, AdminUser };
