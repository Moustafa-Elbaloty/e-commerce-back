const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
} = require("../controller/cartController");

const auth = require("../middleware/auth");

// GET /api/cart/
router.get("/", auth, getCart);

// POST /api/cart/add
router.post("/add", auth, addToCart);

// PUT /api/cart/update/:productId
router.put("/update/:productId", auth, updateCartItem);

// DELETE /api/cart/remove/:productId
router.delete("/remove/:productId", auth, removeFromCart);

module.exports = router;
