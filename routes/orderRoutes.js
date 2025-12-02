const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} = require("../controller/orderController");

const auth = require("../middleware/auth");

// POST /api/orders/create
router.post("/create", auth, createOrder);

// GET /api/orders/myorders
router.get("/myorders", auth, getMyOrders);

// PUT /api/orders/cancel/:id
router.put("/cancel/:id", auth, cancelOrder);

// PUT /api/orders/:id/status
router.put("/:id/status", auth, updateOrderStatus);

// GET /api/orders/:id
router.get("/:id", auth, getOrderById);

module.exports = router;
