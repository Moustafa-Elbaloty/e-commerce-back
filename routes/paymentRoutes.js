const express = require("express");
const {
  stripeInit,
  paypalPay,
  cashPay,
} = require("../controllers/paymentController");

const auth = require("../middleware/auth");

const router = express.Router();

// 🔵 دفع عن طريق بطاقة (Stripe)
router.post("/stripe", auth, stripeInit);

// 🟡 دفع PayPal (محاكاة)
router.post("/paypal", auth, paypalPay);

// 🟠 دفع عند الاستلام (Cash)
router.post("/cash", auth, cashPay);

module.exports = router;
