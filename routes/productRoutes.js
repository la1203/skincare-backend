const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET - جلب كل المنتجات
router.get('/', productController.getProducts);

// POST - إضافة منتج (مع middleware التسجيل)
router.post('/', 
    (req, res, next) => {
        if (!req.session.userId) {
            return res.status(401).json({ message: "You must be logged in to add a product" });
        }
        next();
    },
    productController.logPostMiddleware,
    productController.createProduct
);

// PUT - تعديل منتج
router.put('/:id', productController.updateProduct);

// DELETE - حذف منتج
router.delete('/:id', productController.deleteProduct);

module.exports = router;