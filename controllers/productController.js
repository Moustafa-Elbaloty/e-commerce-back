const productModel = require("../models/productModel");

// Add Product //
const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock, image } = req.body;

    // لازم يكون Vendor أو Admin
    if (req.user.role !== "vendor" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only vendors or admins can add products",
        });
    }

    if (
      !name ||
      !price ||
      !description ||
      !category ||
      stock == null ||
      !image
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const product = await productModel.create({
      name,
      price,
      description,
      category,
      stock,
      image,
      vendor: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "New product added successfully!",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};

// Update product //
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check permission — only admin or the vendor who owns it can update
    if (
      req.user.role !== "admin" &&
      product.vendor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products",
      });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// delete product //
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check permission — only admin or the vendor who owns it can delete
    if (
      req.user.role !== "admin" &&
      product.vendor.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "You can only delete your own products" });
    }

    await productModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

//  Get All Products (pagination + filtering + sorting) //
const getProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.category) filter.category = req.query.category;

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.q) filter.$text = { $search: req.query.q };

    const sortField = req.query.sort || "createdAt";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    const [products, total] = await Promise.all([
      productModel
        .find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate("vendor", "name email role"),
      productModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages,
      count: products.length,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

module.exports = { addProduct, updateProduct, deleteProduct, getProducts };
