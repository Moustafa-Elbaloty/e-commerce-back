const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

const auth = require("../middleware/auth");

const router = express.Router();

// 🟢 Checkout → Create order
router.post("/create", auth, createOrder);

// 🟢 Get all my orders
router.get("/myorders", auth, getMyOrders);

// 🟢 Get single order
router.get("/:id", auth, getOrderById);

// 🟢 Cancel order
router.put("/cancel/:id", auth, cancelOrder);

// 🟢 Admin/Vendor: update order status
router.put("/status/:id", updateOrderStatus);

module.exports = router;
