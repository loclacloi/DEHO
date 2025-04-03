const express = require('express')
const router = express.Router()
const upload = require('../middlewares/uploadMiddleware')
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')

router.get('/', getAllProducts)
router.post('/add', upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 5 }]), createProduct)
router.put('/update/:id', upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 5 }]), updateProduct)
router.delete('/delete/:id', deleteProduct)

module.exports = router
