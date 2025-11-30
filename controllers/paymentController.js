const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");

// ============================
//    GET USER PAYMENTS
// ============================
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate("order")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
//    GET PAYMENT BY ID
// ============================
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("order");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
//    CONFIRM STRIPE PAYMENT (Webhook أو Manual)
// ============================
exports.confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: "Payment Intent ID is required" });
    }

    // جلب الـ payment من قاعدة البيانات
    const payment = await Payment.findOne({
      transactionId: paymentIntentId,
      method: "stripe",
    }).populate("order");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // التحقق من حالة الدفع في Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // تحديث حالة الدفع في قاعدة البيانات
      payment.status = "paid";
      await payment.save();

      // تحديث حالة الطلب
      if (payment.order) {
        payment.order.paymentStatus = "paid";
        payment.order.orderStatus = "processing";
        await payment.order.save();
      }

      res.json({
        message: "Payment confirmed successfully",
        payment,
        order: payment.order,
      });
    } else {
      res.json({
        message: "Payment is still pending",
        paymentStatus: paymentIntent.status,
        payment,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔵 Stripe Payment (Visa/MasterCard)
exports.stripeInit = async (req, res) => {
  try {
    const { orderId } = req.body;

    // التحقق من orderId
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // التحقق من STRIPE_SECRET_KEY
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        message: "Stripe is not configured. Please check your .env file",
      });
    }

    // جلب الطلب والتحقق إنه بتاع نفس المستخدم
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // التحقق إن الطلب لسه مدفعش
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        message: "This order has already been paid",
      });
    }

    // التحقق إن طريقة الدفع في الطلب هي stripe
    if (order.paymentMethod !== "stripe") {
      return res.status(400).json({
        message: "This order is not set for Stripe payment",
      });
    }

    // التحقق إن مفيش payment موجود بالفعل للطلب ده
    const existingPayment = await Payment.findOne({
      order: orderId,
      method: "stripe",
      status: { $in: ["paid", "pending"] },
    });

    if (existingPayment) {
      // لو في payment pending، نرجع الـ client secret بتاعه
      if (
        existingPayment.status === "pending" &&
        existingPayment.transactionId
      ) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            existingPayment.transactionId
          );
          return res.json({
            message: "Stripe payment already initialized",
            clientSecret: paymentIntent.client_secret,
            payment: existingPayment,
          });
        } catch (err) {
          // لو الـ paymentIntent مش موجود في Stripe، نعمل واحد جديد
        }
      } else if (existingPayment.status === "paid") {
        return res.status(400).json({
          message: "This order has already been paid",
        });
      }
    }

    // إنشاء عملية دفع في Stripe (مبلغ + العملة)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Stripe بيتعامل بالسنت
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id.toString(),
      },
    });

    // تسجيل عملية الدفع في قاعدة البيانات
    const payment = await Payment.create({
      user: req.user.id,
      order: orderId,
      method: "stripe",
      amount: order.totalPrice,
      status: "pending", // لحد ما العميل يكمل الدفع في الواجهة الأمامية
      transactionId: paymentIntent.id,
    });

    // إرسال client secret للعميل علشان يكمل الدفع
    res.json({
      message: "Stripe payment initialized",
      clientSecret: paymentIntent.client_secret,
      payment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟡 PayPal Payment (Simulated / Fake)
exports.paypalPay = async (req, res) => {
  try {
    const { orderId } = req.body;

    // التحقق من orderId
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // جلب الطلب والتحقق إنه بتاع نفس المستخدم
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // التحقق إن الطلب لسه مدفعش
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        message: "This order has already been paid",
      });
    }

    // التحقق إن طريقة الدفع في الطلب هي paypal
    if (order.paymentMethod !== "paypal") {
      return res.status(400).json({
        message: "This order is not set for PayPal payment",
      });
    }

    // التحقق إن مفيش payment موجود بالفعل للطلب ده
    const existingPayment = await Payment.findOne({
      order: orderId,
      method: "paypal",
      status: "paid",
    });

    if (existingPayment) {
      return res.status(400).json({
        message: "This order has already been paid",
      });
    }

    // إنشاء رقم عملية وهمي
    const transactionId = "PAYPAL-" + Date.now();

    // تسجيل الدفع ناجح فوريًا (بما أننا بنعمل simulation)
    const payment = await Payment.create({
      user: req.user.id,
      order: orderId,
      method: "paypal",
      amount: order.totalPrice,
      status: "paid", // تم الدفع مباشرًا
      transactionId,
    });

    // تحديث حالة الطلب
    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    await order.save();

    res.json({
      message: "PayPal payment successful",
      payment,
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟠 Cash On Delivery
exports.cashPay = async (req, res) => {
  try {
    const { orderId } = req.body;

    // التحقق من orderId
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // جلب الطلب والتحقق إنه بتاع نفس المستخدم
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // التحقق إن طريقة الدفع في الطلب هي cash
    if (order.paymentMethod !== "cash") {
      return res.status(400).json({
        message: "This order is not set for cash payment",
      });
    }

    // التحقق إن مفيش payment موجود بالفعل للطلب ده
    const existingPayment = await Payment.findOne({
      order: orderId,
      method: "cash",
    });

    if (existingPayment) {
      return res.json({
        message: "Cash payment already registered",
        payment: existingPayment,
        order,
      });
    }

    // تسجيل "الدفع عند الاستلام"
    const payment = await Payment.create({
      user: req.user.id,
      order: orderId,
      method: "cash",
      amount: order.totalPrice,
      status: "pending", // لسه الدفع ما تمّش
    });

    // تحديث حالة الطلب
    order.paymentStatus = "pending";
    order.orderStatus = "pending";
    await order.save();

    res.json({
      message: "Cash payment selected",
      payment,
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
