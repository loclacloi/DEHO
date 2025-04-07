const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // 'Bearer <token>'
  if (!token) return res.status(401).json({ message: 'Thiếu token xác thực' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = verifyToken;
