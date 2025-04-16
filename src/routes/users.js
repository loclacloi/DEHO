const express = require('express');
const router = express.Router();
const { getAllUsers, login, register,updateUser,sendOtp, verifyOtp,resetPassword} = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', getAllUsers);
router.post('/register', register);
router.post('/login', login)
router.put('/profile', verifyToken,updateUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router;
