// services/userService.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const Mailjet = require('node-mailjet'); 
const crypto = require('crypto');


const getAllUsers = async () => {
  try {
    return await User.find();
  } catch (err) {
    throw new Error('Không thể lấy danh sách người dùng');
  }
};

const register = async (userData) => {
  const { email, password, name, phone, role } = userData;

  // Kiểm tra nếu email đã tồn tại
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email đã tồn tại');

  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    phone,
    password: hashedPassword,
    role: role || 'customer' // Mặc định là customer
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
  // Tìm người dùng trong cơ sở dữ liệu
  const user = await User.findOne({ email });
  if (!user) throw new Error('Tài khoản không tồn tại');  

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Sai mật khẩu');  // Nếu không khớp, báo lỗi

  // Tạo JWT token
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


// Hàm tạo mã OTP ngẫu nhiên
const generateOtp = () => {
  return crypto.randomBytes(3).toString('hex'); // Mã OTP 6 ký tự
};

// Hàm gửi OTP qua email
const sendOtp = async (email) => {
  try {
    // Tìm người dùng với email (không phân biệt hoa thường)
    const user = await User.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
    if (!user) {
      throw new Error('Email không tồn tại');
    }

    // Tạo mã OTP
    const otp = generateOtp();

    // Lưu OTP và thời gian hết hạn vào cơ sở dữ liệu
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP hết hạn sau 10 phút
    await user.save();

    // Khởi tạo client Mailjet với cú pháp mới
    const mailjetClient = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET,
    });

    // Gửi email qua Mailjet
    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'ntloc4405@gmail.com', // Địa chỉ email gửi
              Name: 'Thành Lộc',
            },
            To: [
              {
                Email: email,
              },
            ],
            Subject: 'Mã OTP để thay đổi mật khẩu',
            TextPart: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`,
            HTMLPart: `<h3>Mã OTP của bạn là: <strong>${otp}</strong></h3><p>Mã này sẽ hết hạn sau 10 phút.</p>`,
          },
        ],
      });

    // Gửi email và xử lý kết quả
    const response = await request;
    console.log('Email sent:', response.body);
    return response.body;
  } catch (error) {
    console.error('Error in sendOtp:', error.message);
    throw new Error(error.message || 'Không thể gửi mã OTP');
  }
};

// Kiểm tra OTP
const verifyOtp = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) {
    throw new Error('Mã OTP không hợp lệ');
  }

  // Kiểm tra thời gian hết hạn của OTP
  if (user.otpExpiry < Date.now()) {
    throw new Error('Mã OTP đã hết hạn');
  }

  return true;  // OTP hợp lệ
};

// Thay đổi mật khẩu
const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email không tồn tại');
  }

  // Mã hóa mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Cập nhật mật khẩu người dùng
  user.password = hashedPassword;
  user.otp = undefined;  // Xóa OTP sau khi đổi mật khẩu
  user.otpExpiry = undefined;  // Xóa thời gian hết hạn OTP
  await user.save();

  return user;
};
module.exports = {
  register,
  login,
  getAllUsers,
  updateUser,
  sendOtp,
  verifyOtp,
  resetPassword
};
