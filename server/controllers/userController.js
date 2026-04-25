const mongoose = require("mongoose");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (!users.length) {
            return res.status(404).json({ error: "No users found" });
        }

        res.json(users);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Name and email required" });
        }

        const user = new User({ name, email });
        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: "Email already exists" });
        }

        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllUsers,
    createUser
};