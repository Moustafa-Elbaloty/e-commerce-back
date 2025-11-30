const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name Is Required"],
      trim: true,
      minLength: [2, "Product name must be at least 2 characters"],
      maxLength: [50, "Product name must not exceed 50 characters"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be less than 0"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minLength: [10, "Description must be at least 10 characters"],
      maxLength: [1000, "Description must not exceed 1000 characters"],
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["electronics", "smartphones", "clothes", "food", "other"],
    },

    stock: {
      type: Number,
      required: [true, "Quantity in stock is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },

    image: {
      type: String,
      required: [true, "Product image is required"],
      validate: {
        validator: function (url) {
          return /^(https?:\/\/)/.test(url);
        },
        message: "Image URL must start with http or https",
      },
    },

    // البائع (أو الأدمن) اللي يمتلك المنتج — بنربطه بالـ User عشان نستخدم role
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// search index
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
});

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
