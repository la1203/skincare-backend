const Product = require('../models/Product');

// Middleware للتسجيل
exports.logPostMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const userId = req.session.userId || 'Unknown';

    console.log(`[${timestamp}] POST request by User ID: ${userId}`);

    next();
};

// جلب كل المنتجات مع الفلترة والترتيب
exports.getProducts = async (req, res) => {
    try {

        const { search, skinType, sort } = req.query;

        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (skinType && skinType !== 'All') {
            query.skinType = skinType;
        }

        let products = await Product.find(query);

        // ترتيب
        if (sort === 'price-asc') {
            products.sort((a, b) => a.price - b.price);
        }

        if (sort === 'price-desc') {
            products.sort((a, b) => b.price - a.price);
        }

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};

// إضافة منتج جديد
exports.createProduct = async (req, res) => {
    try {

        const newProduct = new Product({
            ...req.body,
            creatorId: req.session.userId
        });

        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};

// تعديل منتج - أي مستخدم مسجل دخول يقدر يعدل
exports.updateProduct = async (req, res) => {
    try {

        if (!req.session.userId) {
            return res.status(401).json({
                message: "You must login first"
            });
        }

        const { id } = req.params;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(updatedProduct);

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};

// حذف منتج - أي مستخدم مسجل دخول يقدر يحذف
exports.deleteProduct = async (req, res) => {
    try {

        if (!req.session.userId) {
            return res.status(401).json({
                message: "You must login first"
            });
        }

        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};