# 📚 API Documentation

**Base URL**: `http://localhost:3000/api`

---

## 🔐 AUTH ROUTES (لا تحتاج Token)

### 1) Register User/Vendor

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "name": "User One",
  "email": "user1@example.com",
  "password": "123456",
  "role": "user"
}
```

أو للـ Vendor:

```json
{
  "name": "Vendor One",
  "email": "vendor1@example.com",
  "password": "123456",
  "role": "vendor"
}
```

### 2) Login

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "email": "user1@example.com",
  "password": "123456"
}
```

- **Response**: يرجع `token` - استخدمه في Header: `Authorization: Bearer <TOKEN>`

---

## 🛒 CART ROUTES (تحتاج User Token)

### 3) Get Cart

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/cart`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`
- **Response**: يرجع الكارت مع `totalPrice` و `totalItems`

### 4) Add To Cart

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

### 5) Update Cart Item Quantity

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

### 6) Remove From Cart

- **Method**: `DELETE`
- **URL**: `http://localhost:3000/api/cart/remove/:productId`
- **مثال**: `http://localhost:3000/api/cart/remove/665f1c3a9c0e4f2b4a123456`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`

---

## 📦 ORDER ROUTES (تحتاج User Token)

### 7) Create Order

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

### 8) Get My Orders

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/orders/myorders`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`

### 9) Get Order By ID

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/orders/:id`
- **مثال**: `http://localhost:3000/api/orders/692b1e341448d3392cdc738a`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`

### 10) Cancel Order

- **Method**: `PUT`
- **URL**: `http://localhost:3000/api/orders/cancel/:id`
- **مثال**: `http://localhost:3000/api/orders/cancel/692b1e341448d3392cdc738a`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`
- **Note**: يشتغل بس لو `orderStatus === "pending"`

### 11) Update Order Status (Vendor/Admin Only)

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

---

## 💳 PAYMENT ROUTES (تحتاج User Token)

### 12) Get My Payments

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/payments`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`

### 13) Get Payment By ID

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/payments/:id`
- **مثال**: `http://localhost:3000/api/payments/665f1e4c9c0e4f2b4a112233`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`

### 14) Stripe Payment Init

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

- **Response**: يرجع `clientSecret` - استخدمه في الفرونت إند لإكمال الدفع

### 15) Confirm Stripe Payment

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

### 16) PayPal Payment

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

- **Note**: Simulation - بيعمل الدفع فورًا ويحدث حالة الطلب

### 17) Cash Payment

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

---

## 🛍️ PRODUCT ROUTES

### 18) Add Product (Vendor/Admin Only)

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/products`
- **Headers**:
  - `Authorization: Bearer <VENDOR_OR_ADMIN_TOKEN>`
  - `Content-Type: application/json`
- **Body**:

```json
{
  "name": "iPhone 15 Pro",
  "price": 45000,
  "description": "Latest iPhone with amazing features and great camera.",
  "category": "smartphones",
  "stock": 10,
  "image": "https://example.com/images/iphone15pro.png"
}
```

**Categories**: `"electronics"`, `"smartphones"`, `"clothes"`, `"food"`, `"other"`

### 19) Get All Products (Public - لا يحتاج Token)

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/products`
- **Query Parameters (اختياري)**:
  - `?page=1` - رقم الصفحة
  - `?limit=10` - عدد المنتجات في الصفحة
  - `?category=smartphones` - فلترة حسب الفئة
  - `?minPrice=1000` - أقل سعر
  - `?maxPrice=50000` - أعلى سعر
  - `?q=iphone` - بحث نصي
  - `?sort=price` - ترتيب حسب (price, createdAt, etc.)
  - `?order=desc` - ترتيب (asc أو desc)
- **مثال**: `http://localhost:3000/api/products?page=1&limit=10&category=smartphones&minPrice=1000&maxPrice=50000&sort=price&order=desc`

### 20) Update Product (Vendor/Admin Only)

- **Method**: `PUT`
- **URL**: `http://localhost:3000/api/products/:id`
- **مثال**: `http://localhost:3000/api/products/665f1c3a9c0e4f2b4a123456`
- **Headers**:
  - `Authorization: Bearer <VENDOR_OR_ADMIN_TOKEN>`
  - `Content-Type: application/json`
- **Body** (أي حقل عايز تغيره):

```json
{
  "price": 42000,
  "stock": 15
}
```

أو:

```json
{
  "name": "iPhone 15 Pro Max",
  "description": "Updated description"
}
```

### 21) Delete Product (Vendor/Admin Only)

- **Method**: `DELETE`
- **URL**: `http://localhost:3000/api/products/:id`
- **مثال**: `http://localhost:3000/api/products/665f1c3a9c0e4f2b4a123456`
- **Headers**: `Authorization: Bearer <VENDOR_OR_ADMIN_TOKEN>`

---

## 📝 ملاحظات مهمة:

### Authentication:

- كل الـ routes (ماعدا `/auth/register`, `/auth/login`, و `GET /products`) تحتاج Token
- خذ الـ Token من `POST /api/auth/login`
- استخدمه في Header: `Authorization: Bearer <TOKEN>`

### Roles:

- **User**: يقدر يستخدم Cart, Orders, Payments
- **Vendor**: يقدر يضيف/يعدل/يحذف Products + يغير Order Status
- **Admin**: نفس صلاحيات Vendor

### IDs:

- استبدل `:id` و `:productId` بالـ IDs الحقيقية من الـ responses
- الـ IDs بتكون ObjectId من MongoDB (مثلاً: `665f1c3a9c0e4f2b4a123456`)

### Enums:

**Categories**:

- `"electronics"`
- `"smartphones"`
- `"clothes"`
- `"food"`
- `"other"`

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

1. **Register User** → `POST /api/auth/register` (مع `"role": "user"`)
2. **Login User** → `POST /api/auth/login` → خذ الـ `token`
3. **Register Vendor** → `POST /api/auth/register` (مع `"role": "vendor"`)
4. **Login Vendor** → `POST /api/auth/login` → خذ الـ `token`
5. **Add Product** → `POST /api/products` (بـ Vendor token)
6. **Get Products** → `GET /api/products` → خذ `product._id`
7. **Add To Cart** → `POST /api/cart/add` (بـ User token + productId)
8. **Get Cart** → `GET /api/cart` (بـ User token) → شوف الـ totalPrice
9. **Create Order** → `POST /api/orders/create` (بـ User token) → خذ `order._id`
10. **Pay** → `POST /api/payment/paypal` أو `/api/payment/cash` (بـ User token + orderId)
11. **Get My Orders** → `GET /api/orders/myorders` (بـ User token)
12. **Update Order Status** → `PUT /api/orders/:id/status` (بـ Vendor token)

---

## 🔧 Environment Variables (.env):

```env
MONGO_URL=mongodb://localhost:27017/final_db
JWT_SECRET=my_super_secret_jwt_key_123456789
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
PORT=3000
```

---

## 📌 Quick Reference:

| Route                     | Method | Auth | Description               |
| ------------------------- | ------ | ---- | ------------------------- |
| `/auth/register`          | POST   | ❌   | تسجيل مستخدم/بائع         |
| `/auth/login`             | POST   | ❌   | تسجيل دخول                |
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
| `/products`               | POST   | ✅   | إضافة منتج (Vendor/Admin) |
| `/products`               | GET    | ❌   | جلب كل المنتجات           |
| `/products/:id`           | PUT    | ✅   | تعديل منتج (Vendor/Admin) |
| `/products/:id`           | DELETE | ✅   | حذف منتج (Vendor/Admin)   |

---

**Last Updated**: 2024
