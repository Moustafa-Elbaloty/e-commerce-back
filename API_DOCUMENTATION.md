# 🚀 Active Routes Documentation

**Base URL**: `http://localhost:3000/api`

---

## 🛒 CART ROUTES (تحتاج User Token)

### 1) Get Cart

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/cart`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`
- **Response**: يرجع الكارت مع `totalPrice` و `totalItems`

**Example Response**:

```json
{
  "items": [
    {
      "product": {
        "_id": "665f1c3a9c0e4f2b4a123456",
        "name": "iPhone 15 Pro",
        "price": 45000
      },
      "quantity": 2
    }
  ],
  "totalPrice": "90000.00",
  "totalItems": 2
}
```

---

### 2) Add To Cart

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/cart/add`
- **Headers**:
  - `Authorization: Bearer <USER_TOKEN>`
  - `Content-Type: application/json`
- **Body**:

```json
{
  "productId": "665f1c3a9c0e4f2b4a123456",
  "quantity": 2
}
```

**Example Response**:

```json
{
  "items": [
    {
      "product": {
        "_id": "665f1c3a9c0e4f2b4a123456",
        "name": "iPhone 15 Pro",
        "price": 45000
      },
      "quantity": 2
    }
  ],
  "totalPrice": "90000.00",
  "totalItems": 2
}
```

---

### 3) Update Cart Item Quantity

- **Method**: `PUT`
- **URL**: `http://localhost:3000/api/cart/update/:productId`
- **مثال**: `http://localhost:3000/api/cart/update/665f1c3a9c0e4f2b4a123456`
- **Headers**:
  - `Authorization: Bearer <USER_TOKEN>`
  - `Content-Type: application/json`
- **Body**:

```json
{
  "quantity": 5
}
```

**Example Response**:

```json
{
  "items": [
    {
      "product": {
        "_id": "665f1c3a9c0e4f2b4a123456",
        "name": "iPhone 15 Pro",
        "price": 45000
      },
      "quantity": 5
    }
  ],
  "totalPrice": "225000.00",
  "totalItems": 5
}
```

---

### 4) Remove From Cart

- **Method**: `DELETE`
- **URL**: `http://localhost:3000/api/cart/remove/:productId`
- **مثال**: `http://localhost:3000/api/cart/remove/665f1c3a9c0e4f2b4a123456`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`

**Example Response**:

```json
{
  "items": [],
  "totalPrice": "0.00",
  "totalItems": 0
}
```

---

## 📦 ORDER ROUTES (تحتاج User Token)

### 5) Create Order

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/orders/create`
- **Headers**:
  - `Authorization: Bearer <USER_TOKEN>`
  - `Content-Type: application/json`
- **Body**:

```json
{
  "paymentMethod": "cash",
  "vendorId": "665f1b8d9c0e4f2b4a987654"
}
```

**Payment Methods**: `"cash"`, `"stripe"`, `"paypal"`  
**Note**: `vendorId` اختياري

**Example Response**:

```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "692b1e341448d3392cdc738a",
    "user": "665f1a2b3c4d5e6f7a8b9c0d",
    "items": [
      {
        "product": "665f1c3a9c0e4f2b4a123456",
        "quantity": 2,
        "price": 45000,
        "totalItemPrice": 90000
      }
    ],
    "paymentMethod": "cash",
    "totalPrice": 90000,
    "orderStatus": "pending",
    "paymentStatus": "pending"
  }
}
```

---

### 6) Get My Orders

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/orders/myorders`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`

**Example Response**:

```json
[
  {
    "_id": "692b1e341448d3392cdc738a",
    "user": "665f1a2b3c4d5e6f7a8b9c0d",
    "items": [
      {
        "product": {
          "_id": "665f1c3a9c0e4f2b4a123456",
          "name": "iPhone 15 Pro",
          "price": 45000
        },
        "quantity": 2,
        "price": 45000,
        "totalItemPrice": 90000
      }
    ],
    "paymentMethod": "cash",
    "totalPrice": 90000,
    "orderStatus": "pending",
    "paymentStatus": "pending"
  }
]
```

---

### 7) Get Order By ID

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/orders/:id`
- **مثال**: `http://localhost:3000/api/orders/692b1e341448d3392cdc738a`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`

**Example Response**:

```json
{
  "_id": "692b1e341448d3392cdc738a",
  "user": "665f1a2b3c4d5e6f7a8b9c0d",
  "items": [
    {
      "product": {
        "_id": "665f1c3a9c0e4f2b4a123456",
        "name": "iPhone 15 Pro",
        "price": 45000
      },
      "quantity": 2,
      "price": 45000,
      "totalItemPrice": 90000
    }
  ],
  "paymentMethod": "cash",
  "totalPrice": 90000,
  "orderStatus": "pending",
  "paymentStatus": "pending"
}
```

---

### 8) Cancel Order

- **Method**: `PUT`
- **URL**: `http://localhost:3000/api/orders/cancel/:id`
- **مثال**: `http://localhost:3000/api/orders/cancel/692b1e341448d3392cdc738a`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`
- **Note**: يشتغل بس لو `orderStatus === "pending"`

**Example Response**:

```json
{
  "message": "Order cancelled",
  "order": {
    "_id": "692b1e341448d3392cdc738a",
    "orderStatus": "cancelled",
    "paymentStatus": "pending"
  }
}
```

---

### 9) Update Order Status (Vendor/Admin Only)

- **Method**: `PUT`
- **URL**: `http://localhost:3000/api/orders/:id/status`
- **مثال**: `http://localhost:3000/api/orders/692b1e341448d3392cdc738a/status`
- **Headers**:
  - `Authorization: Bearer <VENDOR_OR_ADMIN_TOKEN>`
  - `Content-Type: application/json`
- **Body**:

```json
{
  "status": "processing"
}
```

**Status Values**: `"pending"`, `"processing"`, `"shipped"`, `"delivered"`, `"cancelled"`

**Example Response**:

```json
{
  "message": "Order status updated",
  "order": {
    "_id": "692b1e341448d3392cdc738a",
    "orderStatus": "processing",
    "paymentStatus": "paid"
  }
}
```

---

## 💳 PAYMENT ROUTES (تحتاج User Token)

### 10) Get My Payments

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/payments`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`

**Example Response**:

```json
{
  "success": true,
  "count": 2,
  "payments": [
    {
      "_id": "665f1e4c9c0e4f2b4a112233",
      "user": "665f1a2b3c4d5e6f7a8b9c0d",
      "order": {
        "_id": "692b1e341448d3392cdc738a",
        "totalPrice": 90000
      },
      "method": "paypal",
      "amount": 90000,
      "status": "paid",
      "transactionId": "PAYPAL-1234567890"
    }
  ]
}
```

---

### 11) Get Payment By ID

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/payments/:id`
- **مثال**: `http://localhost:3000/api/payments/665f1e4c9c0e4f2b4a112233`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`

**Example Response**:

```json
{
  "success": true,
  "payment": {
    "_id": "665f1e4c9c0e4f2b4a112233",
    "user": "665f1a2b3c4d5e6f7a8b9c0d",
    "order": {
      "_id": "692b1e341448d3392cdc738a",
      "totalPrice": 90000
    },
    "method": "paypal",
    "amount": 90000,
    "status": "paid",
    "transactionId": "PAYPAL-1234567890"
  }
}
```

---

### 12) Stripe Payment Init

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/payment/stripe`
- **Headers**:
  - `Authorization: Bearer <USER_TOKEN>`
  - `Content-Type: application/json`
- **Body**:

```json
{
  "orderId": "692b1e341448d3392cdc738a"
}
```

**Example Response**:

```json
{
  "message": "Stripe payment initialized",
  "clientSecret": "pi_xxx_secret_xxx",
  "payment": {
    "_id": "665f1e4c9c0e4f2b4a112233",
    "user": "665f1a2b3c4d5e6f7a8b9c0d",
    "order": "692b1e341448d3392cdc738a",
    "method": "stripe",
    "amount": 90000,
    "status": "pending",
    "transactionId": "pi_xxx"
  }
}
```

---

### 13) Confirm Stripe Payment

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/payment/stripe/confirm`
- **Headers**:
  - `Authorization: Bearer <USER_TOKEN>`
  - `Content-Type: application/json`
- **Body**:

```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Example Response**:

```json
{
  "message": "Payment confirmed successfully",
  "payment": {
    "_id": "665f1e4c9c0e4f2b4a112233",
    "status": "paid"
  },
  "order": {
    "_id": "692b1e341448d3392cdc738a",
    "paymentStatus": "paid",
    "orderStatus": "processing"
  }
}
```

---

### 14) PayPal Payment

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/payment/paypal`
- **Headers**:
  - `Authorization: Bearer <USER_TOKEN>`
  - `Content-Type: application/json`
- **Body**:

```json
{
  "orderId": "692b1e341448d3392cdc738a"
}
```

**Example Response**:

```json
{
  "message": "PayPal payment successful",
  "payment": {
    "_id": "665f1e4c9c0e4f2b4a112233",
    "user": "665f1a2b3c4d5e6f7a8b9c0d",
    "order": "692b1e341448d3392cdc738a",
    "method": "paypal",
    "amount": 90000,
    "status": "paid",
    "transactionId": "PAYPAL-1234567890"
  },
  "order": {
    "_id": "692b1e341448d3392cdc738a",
    "paymentStatus": "paid",
    "orderStatus": "processing"
  }
}
```

**Note**: Simulation - بيعمل الدفع فورًا ويحدث حالة الطلب

---

### 15) Cash Payment

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/payment/cash`
- **Headers**:
  - `Authorization: Bearer <USER_TOKEN>`
  - `Content-Type: application/json`
- **Body**:

```json
{
  "orderId": "692b1e341448d3392cdc738a"
}
```

**Example Response**:

```json
{
  "message": "Cash payment selected",
  "payment": {
    "_id": "665f1e4c9c0e4f2b4a112233",
    "user": "665f1a2b3c4d5e6f7a8b9c0d",
    "order": "692b1e341448d3392cdc738a",
    "method": "cash",
    "amount": 90000,
    "status": "pending"
  },
  "order": {
    "_id": "692b1e341448d3392cdc738a",
    "paymentStatus": "pending",
    "orderStatus": "pending"
  }
}
```

---

## 📝 ملاحظات مهمة:

### Authentication:

- كل الـ routes تحتاج Token
- خذ الـ Token من `POST /api/auth/login` (لو Auth routes شغالة)
- استخدمه في Header: `Authorization: Bearer <TOKEN>`

### IDs:

- استبدل `:id` و `:productId` بالـ IDs الحقيقية من الـ responses
- الـ IDs بتكون ObjectId من MongoDB (مثلاً: `665f1c3a9c0e4f2b4a123456`)

### Enums:

**Order Status**:

- `"pending"`
- `"processing"`
- `"shipped"`
- `"delivered"`
- `"cancelled"`

**Payment Methods**:

- `"cash"`
- `"stripe"`
- `"paypal"`

**Payment Status**:

- `"pending"`
- `"paid"`
- `"failed"`

---

## 🎯 سيناريو كامل للتجربة:

1. **Add To Cart** → `POST /api/cart/add` (بـ User token + productId)
2. **Get Cart** → `GET /api/cart` (بـ User token) → شوف الـ totalPrice
3. **Create Order** → `POST /api/orders/create` (بـ User token) → خذ `order._id`
4. **Pay** → `POST /api/payment/paypal` أو `/api/payment/cash` (بـ User token + orderId)
5. **Get My Orders** → `GET /api/orders/myorders` (بـ User token)
6. **Get My Payments** → `GET /api/payments` (بـ User token)
7. **Update Order Status** → `PUT /api/orders/:id/status` (بـ Vendor/Admin token)

---

## 📌 Quick Reference:

| Route                     | Method | Auth | Description               |
| ------------------------- | ------ | ---- | ------------------------- |
| `/cart`                   | GET    | ✅   | جلب الكارت                |
| `/cart/add`               | POST   | ✅   | إضافة للكارت              |
| `/cart/update/:productId` | PUT    | ✅   | تحديث كمية                |
| `/cart/remove/:productId` | DELETE | ✅   | حذف من الكارت             |
| `/orders/create`          | POST   | ✅   | إنشاء طلب                 |
| `/orders/myorders`        | GET    | ✅   | جلب طلباتي                |
| `/orders/:id`             | GET    | ✅   | جلب طلب واحد              |
| `/orders/cancel/:id`      | PUT    | ✅   | إلغاء طلب                 |
| `/orders/:id/status`      | PUT    | ✅   | تحديث حالة (Vendor/Admin) |
| `/payments`               | GET    | ✅   | جلب كل الـ payments       |
| `/payments/:id`           | GET    | ✅   | جلب payment واحد          |
| `/payment/stripe`         | POST   | ✅   | تهيئة دفع Stripe          |
| `/payment/stripe/confirm` | POST   | ✅   | تأكيد دفع Stripe          |
| `/payment/paypal`         | POST   | ✅   | دفع PayPal                |
| `/payment/cash`           | POST   | ✅   | دفع كاش                   |

---

**Total Active Routes**: 15 routes


