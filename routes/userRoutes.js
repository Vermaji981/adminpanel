const express = require("express");

const User = require("../models/User");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


router.get(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const users = await User
                .find()
                .select("-password")
                .sort({ createdAt: -1 });

            res.json(users);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);


module.exports = router;