const Order = require('../models/orderModel')

const getAllOrders = async () => await Order.find()
const getOrderById = async (id) => await Order.findById(id)
const updateOrderStatus = async (id, data) => await Order.findByIdAndUpdate(id, data, { new: true })

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus
}
