const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);
router.post('/add', upload.single('image'), categoryController.createCategory);
router.put('/update/:id', upload.single('image'), categoryController.updateCategory);
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;
