const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, phoneNumber, barID, state, role, password } = req.body;
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "User already exists" });

        user = new User({ fullName, email, phoneNumber, barID, state, role, password });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    res.cookie('token', '', { expires: new Date(0) });
    res.json({ message: "Logged out successfully" });
});

module.exports = router;
