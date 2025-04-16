require('dotenv').config();
const sendMail = require('./helpers/sendMail');

sendMail('your-email@gmail.com', 'TEST OTP', '<h1>Gửi thử thành công</h1>')
  .then(() => console.log('✅ Gửi thành công'))
  .catch(err => console.error('❌ Gửi lỗi:', err));
