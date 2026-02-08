const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  email: { type: String, required: true },
  loginAt: { type: Date, default: Date.now },  // FIXED
  ip: { type: String, default: "Unknown" }
});

module.exports = mongoose.model("LoginHistory", loginHistorySchema);
