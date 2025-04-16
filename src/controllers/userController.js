// controllers/userController.js
const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, message: 'Lấy danh sách người dùng thành công', data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const newUser = await userService.register(req.body);
    res.status(201).json({ success: true, message: 'Đăng ký thành công', data: newUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy từ JWT
    const updatedUser = await userService.updateUser(userId, req.body);
    res.status(200).json({ success: true, message: 'Cập nhật thông tin thành công', data: updatedUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra email có được cung cấp không
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email',
      });
    }

    // Gọi service để gửi OTP
    await userService.sendOtp(email);

    // Trả về phản hồi thành công
    return res.status(200).json({
      success: true,
      message: 'Mã OTP đã được gửi vào email của bạn.',
    });
  } catch (error) {
    console.error('Error in sendOtp controller:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    await userService.verifyOtp(email, otp);
    res.status(200).json({
      success: true,
      message: 'Mã OTP xác thực thành công',
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await userService.resetPassword(email, newPassword);
    res.status(200).json({
      success: true,
      message: 'Mật khẩu đã được thay đổi thành công',
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAllUsers,
  register,
  login,
  updateUser,
  sendOtp,
  verifyOtp,
  resetPassword
};
