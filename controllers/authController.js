const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//ننشئ توكن
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

//  تسجيل مستخدم جديد
const registerUser = async (req, res) => {
  try {
    //   نستقبل البيانات الجايه من body
    const { name, email, password, role } = req.body;
    // نتشيك على كل الحقول
    if (!name || !email || !password) {
      return res.status(400).json({ message: "    يا نجم كمل باقى الحقول" });
    }

    // تأكد إن الإيميل مش مستخدم قبل كده
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "   بريدك متسجل عندنا يا زعامه" });
    }

    // إنشاء المستخدم
    const user = await User.create({ name, email, password, role });

    // ردّ على العميل
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({
      message: "   معلش فى مشكله عندك ف النت ههه",
      error: error.message,
    });
  }
};

//  تسجيل الدخول
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "  روح سجل حساب يا صاحبى هستناك " });
    }
    // نقارن الباسورد بالباس الموجود عندنا
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "   كلمه السر غلط يا زعيم" });
    }
    // هنا تم التسجيل
    // بنرجع البيانات الاساسيه و jwt
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "ارجع يا نجم فى مشكله عيد من حبيبنا",
        error: error.message,
      });
  }
};
// نصدر عن نستخدمهم ف الراوت
module.exports = { registerUser, loginUser };
