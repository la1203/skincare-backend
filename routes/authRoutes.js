const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// مسار التسجيل
router.post('/register', authController.register);

// مسار تسجيل الدخول
router.post('/login', authController.login);

// مسار تسجيل الخروج
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);

module.exports = router;