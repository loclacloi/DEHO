const Product = require('../models/productModel');
const fs = require('fs');
const path = require('path');

// ✅ Lấy tất cả sản phẩm
const getAllProducts = async () => {
  return await Product.find();
};

// ✅ Lấy sản phẩm theo ID
const getProductById = async (id) => {
  return await Product.findById(id);
};

// ✅ Thêm sản phẩm
const createProduct = async (data) => {
  return await Product.create(data);
};

// ✅ Cập nhật sản phẩm
const updateProduct = async (id, data, newFiles) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Không tìm thấy sản phẩm');

  // Nếu có ảnh thumbnail mới → xóa ảnh cũ
  if (newFiles?.thumbnail && product.thumbnail) {
    const oldThumbPath = path.join(__dirname, '..', 'public', product.thumbnail);
    if (fs.existsSync(oldThumbPath)) fs.unlinkSync(oldThumbPath);
    data.thumbnail = `/images/${newFiles.thumbnail[0].filename}`;
  }

  // Nếu có ảnh images mới → xóa ảnh cũ
  if (newFiles?.images && product.images?.length) {
    product.images.forEach(img => {
      const imgPath = path.join(__dirname, '..', 'public', img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });
    data.images = newFiles.images.map(file => `/images/${file.filename}`);
  }

  return await Product.findByIdAndUpdate(id, data, { new: true });
};

// ✅ Xóa sản phẩm + ảnh
const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Không tìm thấy sản phẩm');

  // Xóa thumbnail
  if (product.thumbnail) {
    const thumbPath = path.join(__dirname, '..', 'public', product.thumbnail);
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
  }

  // Xóa images
  if (product.images?.length) {
    product.images.forEach(img => {
      const imgPath = path.join(__dirname, '..', 'public', img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });
  }

  return await Product.findByIdAndDelete(id);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
