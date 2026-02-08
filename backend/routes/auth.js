const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const LoginHistory = require("../models/LoginHistory");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, gender, dob, mobile, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already exists" });

        const hashedPass = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, gender, dob, mobile, email,
            password: hashedPass
        });

        await user.save();

        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User Not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect Password" });

    // ⭐ Save login history with date & IP
    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "Unknown";

    const loginRecord = new LoginHistory({
      email: user.email,
      time: new Date(),
      ip
    });

    await loginRecord.save();

    // Send userId and user details in response
    res.json({
    message: "Login successful",
    userId: user._id,
    user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
        dob: user.dob
    }
});


  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});




// ================= GET ALL USERS (Admin) =================
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // password hide
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= DELETE USER =================
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= LOGIN HISTORY LIST =================
router.get("/loginHistory", async (req, res) => {
  try {
    const history = await LoginHistory.find().sort({ time: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
