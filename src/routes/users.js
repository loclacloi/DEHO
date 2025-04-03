const express = require('express');
const router = express.Router();
const { getAllUsers, login, register,updateUser } = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', getAllUsers);
router.post('/register', register);
router.post('/login', login)
router.put('/profile', verifyToken,updateUser);

module.exports = router;
