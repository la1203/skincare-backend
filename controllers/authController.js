const User = require('../models/User');
const bcrypt = require('bcryptjs');

// دالة التسجيل (Register)
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // التأكد إذا كان الإيميل مسجل مسبقاً
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already registered!" });
        }

        // تشفير كلمة المرور (الشرط الإلزامي في الوثيقة)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // إنشاء المستخدم الجديد في قاعدة البيانات
        const newUser = await User.create({ name, email, password: hashedPassword });

        // حفظ معلومات المستخدم في الـ Session
        req.session.userId = newUser._id;

        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// دالة تسجيل الدخول (Login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // البحث عن المستخدم
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // التحقق من كلمة المرور
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // حفظ الـ Session
        req.session.userId = user._id;

        res.status(200).json({ message: "Login successful!", user: user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// دالة تسجيل الخروج (Logout)
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out successfully!" });
    });
};
exports.getMe = (req, res) => {
      if (!req.session.userId) return res.json({ user: null });
      User.findById(req.session.userId).select('-password')
          .then(user => res.json({ user }))
          .catch(() => res.json({ user: null }));
  };