const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// تسجيل مستخدم جديد
router.post('/register', authController.register);

// تسجيل الدخول
router.post('/login', authController.login);

// تسجيل الخروج
router.post('/logout', authController.logout);

// جلب بيانات المستخدم الحالي
router.get('/me', authController.getMe);

module.exports = router;