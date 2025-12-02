const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//  الاتصال بقاعدة البيانات
connectDB();

// ✅ مسارات المستخدم (هنا بنستعمل الملفات المنفصلة)
//  استدعاء راوت المستخدمين
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const vendorRoutes = require("./routes/vendorRoutes");
app.use("/api/vendor", vendorRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// Cart / Orders / Payment (منفصلين برضه)
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("home page");
});

app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
