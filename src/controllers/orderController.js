const orderService = require('../services/orderService')

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders()
    res.status(200).json({ success: true, message: 'Lấy danh sách đơn hàng thành công', data: orders })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id)
    res.status(200).json({ success: true, message: 'Lấy chi tiết đơn hàng thành công', data: order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const updated = await orderService.updateOrderStatus(req.params.id, req.body)
    res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus
}