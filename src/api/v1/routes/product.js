import express from "express";
import { auth } from "../../../middleware/authMiddleware.js";
import Product from "../models/product.js";
import User from "../models/product.js";

const router = express.Router();

// Create product
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      createdBy: req.user.id,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({
      success: false,
      message: "Product creation failed",
    });
  }
});

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find()
    .populate("createdBy", "username")
    .sort({ createdAt: -1 });
  res.json({
    success: true,
    count: products.length,
    products,
  });
});

// Get product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "username"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Update product
router.put("/:id", auth, async (req, res) => {
  const { name, description, price, category } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (product.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this product",
      });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (price) updateFields.price = price;
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error(err.message);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation Error",
        errors: err.errors,
      });
    }

    res.status(500).json({ message: "Server Error" });
  }
});

// Delete product
router.delete("/:id", auth, async (req, res) => {
    console.log("Deleting product with ID:", req.params.id); // Log the ID being deleted
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verify ownership
    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this product",
      });
    }

    await product.deleteOne();

    res.json({ message: "Product removed successfully" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
