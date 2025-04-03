const Category = require('../models/categoryModel');
const fs = require('fs');
const path = require('path');

// ✅ Lấy tất cả danh mục
const getAllCategories = async () => {
  return await Category.find();
};

// ✅ Thêm danh mục mới
const createCategory = async (data) => {
  return await Category.create(data);
};

// ✅ Cập nhật danh mục
const updateCategory = async (id, data, newImageFile) => {
  const category = await Category.findById(id);
  if (!category) throw new Error('Không tìm thấy danh mục');

  // Nếu có ảnh mới => thay ảnh và xóa ảnh cũ
  if (newImageFile) {
    const oldPath = path.join(__dirname, '..', 'public', category.image || '');
    if (category.image && fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
    data.image = `/images/${newImageFile.filename}`;
  }

  return await Category.findByIdAndUpdate(id, data, { new: true });
};

// ✅ Xóa danh mục
const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new Error('Không tìm thấy danh mục');

  // Xóa ảnh nếu có
  if (category.image) {
    const imgPath = path.join(__dirname, '..', 'public', category.image);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  }

  return await Category.findByIdAndDelete(id);
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
