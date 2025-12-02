const express = require("express");
const router = express.Router();

const {
  stripeInit,
  paypalPay,
  cashPay,
  getMyPayments,
  getPaymentById,
  confirmStripePayment,
} = require("../controller/paymentController");

const auth = require("../middleware/auth");

// GET /api/payment/payments (كل المدفوعات للمستخدم)
router.get("/payments", auth, getMyPayments);

// GET /api/payment/payments/:id
router.get("/payments/:id", auth, getPaymentById);

// POST /api/payment/stripe
router.post("/stripe", auth, stripeInit);

// POST /api/payment/stripe/confirm
router.post("/stripe/confirm", auth, confirmStripePayment);

// POST /api/payment/paypal
router.post("/paypal", auth, paypalPay);

// POST /api/payment/cash
router.post("/cash", auth, cashPay);

module.exports = router;
