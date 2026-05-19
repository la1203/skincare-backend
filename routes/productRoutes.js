const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// جلب المنتجات (الكل يمكنهم الوصول)
router.get('/', productController.getProducts);

// إضافة منتج (المستخدم يجب أن يكون مسجلاً)
router.post('/', (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "You must be logged in to add a product" });
    }
    next();
}, productController.createProduct);

module.exports = router;