const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// تحميل المتغيرات من ملف .env
dotenv.config();

const app = express();

// لفهم JSON المرسل من العميل
app.use(express.json());

// --------------------------------------------------
//  الاتصال بقاعدة البيانات MongoDB
// --------------------------------------------------
connectDB();

// --------------------------------------------------
//                API ROUTES
// --------------------------------------------------

// 🔐 عضويات + تسجيل دخول
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 🛒 سلة المنتجات (Cart)
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

// 📦 الطلبات (Orders)
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

// 💳 الدفع (Payment)
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

// --------------------------------------------------
//  TEST ROUTE — للتأكد إن السيرفر شغال
// --------------------------------------------------
app.get("/", (req, res) => {
  res.send("home page");
});

// --------------------------------------------------
// تشغيل السيرفر
// --------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
