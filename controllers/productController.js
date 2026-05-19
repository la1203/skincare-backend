const Product = require('../models/Product');

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

        if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
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
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};