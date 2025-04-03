const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const getAllUsers = async () => {
  try {
    return await User.find();
  } catch (err) {
    throw new Error('Không thể lấy danh sách người dùng');
  }
};
const register = async (userData) => {
  const { email, password, name, phone,role } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email đã tồn tại');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    phone,
    password: hashedPassword,
    role: role || 'customer'
  });

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role

  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email }); // <-- kiểm tra email
  if (!user) throw new Error('Tài khoản không tồn tại');

  const isMatch = await bcrypt.compare(password, user.password); // kiểm tra mật khẩu
  if (!isMatch) throw new Error('Sai mật khẩu');

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    SECRET_KEY,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};


const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) throw new Error('Không tìm thấy người dùng');
  return user;
};
module.exports = {
  register,
  login,
  getAllUsers,
  updateUser
};
