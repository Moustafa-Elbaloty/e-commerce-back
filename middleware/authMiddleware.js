const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // التحقق من وجود التوكن في الهيدر
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // استخراج التوكن من الهيدر
      token = req.headers.authorization.split(" ")[1];

      // فك التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // نجيب المستخدم من قاعدة البيانات باستثناء الباسورد
      req.user = await User.findById(decoded.id).select("-password");

      // نكمل بعد ما نتحقق
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "❌ التوكن  منتهي الصلاحية" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "🔒 غير مصرح لك بالدخول، مفيش توكن" });
  }
};

module.exports = { protect };
