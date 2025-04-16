const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  customerAddress: String,
  customerNote: String,
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }
  ],
  total: Number,
  status: {
    type: String,
    enum: ['Chờ xác nhận', 'Đang chuẩn bị', 'Đang giao', 'Đã giao', 'Đã hủy'],
    default: 'Chờ xác nhận'
  },
  adminNote: String
}, { timestamps: true })
module.exports = mongoose.model('orders', orderSchema)
