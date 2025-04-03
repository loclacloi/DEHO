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
    res.status(200).json({ success: true, message: 'Đăng nhập thành công', data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
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
module.exports = {
  getAllUsers,
  register,
  login,
  updateUser
};