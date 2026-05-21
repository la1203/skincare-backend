const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();

// ===============================
// Middlewares
// ===============================
app.use(express.json());
app.use(cookieParser());

// ===============================
// CORS Configuration
// ===============================
app.use(cors({
    origin: 'https://skincare-frontend-1909.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// ===============================
// Trust Proxy for Render
// ===============================
app.set('trust proxy', 1);

// ===============================
// Session Configuration
// ===============================
app.use(session({
    secret: 'my_super_secret_key_skincare',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none',
        httpOnly: true
    }
}));

// ===============================
// Routes
// ===============================
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// ===============================
// Test Route
// ===============================
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is working!" });
});

// ===============================
// MongoDB Connection
// ===============================
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB Successfully");
    })
    .catch((err) => {
        console.log("❌ MongoDB Connection Error:", err);
    });

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});