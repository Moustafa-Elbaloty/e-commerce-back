const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vendor name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Vendor email is required"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Vendor password is required"],
    },

    storeName: {
      type: String,
      required: [true, "Store name is required"],
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    role: {
      type: String,
      enum: ["vendor", "admin"],
      default: "vendor",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
