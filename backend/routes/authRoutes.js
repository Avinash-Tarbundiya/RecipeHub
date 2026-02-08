const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const LoginHistory = require("../models/LoginHistory");

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, gender, dob, mobile, email, password } = req.body;

        // Validation: required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already exists" });

        const user = new User({ firstName, lastName, gender, dob, mobile, email, password });

        await user.save();
        res.status(200).json({ message: "Registration successful" });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User Not Found" });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(401).json({ message: "Incorrect Password" });

        // Save login history
        const login = new LoginHistory({
            email: user.email,
            loginAt: new Date()
        });

        await login.save();

        res.status(200).json({
            message: "Login Successful",
            user: {
                email: user.email,
                name: user.firstName + " " + user.lastName
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ---------------- GET ALL USERS ----------------
router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        console.error("Users error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ---------------- DELETE USER ----------------
router.delete("/delete/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ---------------- GET LOGIN HISTORY ----------------
router.get("/loginHistory", async (req, res) => {
    try {
        const logs = await LoginHistory.find().sort({ loginAt: -1 });
        res.json(logs);
    } catch (error) {
        console.error("Login history error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
