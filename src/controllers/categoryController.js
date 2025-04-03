const categoryService = require('../services/categoryService');

// ✅ Lấy danh sách
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Thêm mới
const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : '';

    const newCate = await categoryService.createCategory({ name, slug, image });

    res.status(201).json({ success: true, message: 'Thêm thành công', data: newCate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Cập nhật
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const updated = await categoryService.updateCategory(id, { name, slug }, req.file);
    res.status(200).json({ success: true, message: 'Cập nhật thành công', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Xóa
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    res.status(200).json({ success: true, message: 'Đã xóa' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
