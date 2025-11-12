const mongoose = require("mongoose")
const bcrypt = require("becrypt")

const vendorSchema = new mongoose({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    storeName: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});


const vendorModel = mongoose.model("Vendor", vendorSchema)
module.exports = vendorModel;
