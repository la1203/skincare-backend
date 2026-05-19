const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // يمنع تسجيل نفس الإيميل مرتين
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true }); // يضيف تلقائياً تاريخ الإنشاء والتعديل

module.exports = mongoose.model('User', userSchema);