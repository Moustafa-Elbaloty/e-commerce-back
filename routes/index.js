const express = require("express");
const router = express.Router();

// Controllers
const { register, login } = require("../controller/authController");

const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
} = require("../controller/cartController");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} = require("../controller/orderController");

const {
  stripeInit,
  paypalPay,
  cashPay,
  getMyPayments,
  getPaymentById,
  confirmStripePayment,
} = require("../controller/paymentController");

const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} = require("../controller/productController");

// Middleware
const auth = require("../middleware/auth");

// ===========================
//        AUTH ROUTES
// ===========================

router.post("/auth/register", register);
router.post("/auth/login", login);

// ===========================
//        CART ROUTES
// ===========================

router.get("/cart", auth, getCart);
router.post("/cart/add", auth, addToCart);
router.put("/cart/update/:productId", auth, updateCartItem); // تحديث كمية منتج في الكارت
router.delete("/cart/remove/:productId", auth, removeFromCart);

// ===========================
//        ORDER ROUTES
// ===========================

router.post("/orders/create", auth, createOrder);
router.get("/orders/myorders", auth, getMyOrders);
router.put("/orders/cancel/:id", auth, cancelOrder);
router.put("/orders/:id/status", auth, updateOrderStatus); // تحديث حالة الطلب (Vendor/Admin) - لازم يكون قبل /orders/:id
router.get("/orders/:id", auth, getOrderById);

// ===========================
//       PAYMENT ROUTES
// ===========================

router.get("/payments", auth, getMyPayments); // جلب كل الـ payments بتاعة المستخدم
router.get("/payments/:id", auth, getPaymentById); // جلب payment واحد
router.post("/payment/stripe", auth, stripeInit); // تهيئة دفع Stripe
router.post("/payment/stripe/confirm", auth, confirmStripePayment); // تأكيد دفع Stripe
router.post("/payment/paypal", auth, paypalPay); // دفع PayPal
router.post("/payment/cash", auth, cashPay); // دفع كاش

// ===========================
//       PRODUCT ROUTES
// ===========================

router.post("/products", auth, addProduct); // إضافة منتج
router.get("/products", getProducts); // كل المنتجات
router.put("/products/:id", auth, updateProduct); // تعديل منتج
router.delete("/products/:id", auth, deleteProduct); // حذف منتج

// Export all routes together
module.exports = router;
