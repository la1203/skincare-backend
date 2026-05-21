const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();

// إعداد الـ Middlewares
app.use(express.json());
app.use(cookieParser());

// إعدادات CORS (تسمح بـ 3000 و 3001)
// قديم
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// جديد
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://skincare-frontend-1909.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// إعدادات الـ Sessions
app.use(session({
    secret: 'my_super_secret_key_skincare',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: 'lax' }
}));

// مسارات تسجيل الدخول (القديمة)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// مسارات المنتجات (الجديدة التي أضفناها الآن)
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// مسار لاختبار عمل السيرفر
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is working!" });
});

// توصيل قاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Successfully"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});