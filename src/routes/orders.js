const express = require('express')
const router = express.Router()
const { getAllOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController')

router.get('/', getAllOrders)
router.get('/:id', getOrderById)
router.put('/:id', updateOrderStatus)

module.exports = router
