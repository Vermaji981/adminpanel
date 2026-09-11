const express = require("express");

const Product = require("../models/Product");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// get product

router.get("/", async (req, res) => {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// add product

router.post(
    "/",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const product =
                await Product.create(req.body);

            res.status(201).json(product);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);

// delete product

router.delete(
    "/:id",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            await Product.findByIdAndDelete(
                req.params.id
            );

            res.json({
                message: "Product deleted"
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);

module.exports = router;