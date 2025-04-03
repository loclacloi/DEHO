const productService = require('../services/productService');

// ✅ Lấy danh sách
const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Thêm mới
const createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, salePrice, categoryId } = req.body;
    const thumbnail = req.files?.thumbnail ? `/images/${req.files.thumbnail[0].filename}` : '';
    const images = req.files?.images?.map(file => `/images/${file.filename}`) || [];

    const newProduct = await productService.createProduct({
      name, slug, description, price, salePrice, categoryId, thumbnail, images
    });

    res.status(201).json({ success: true, message: 'Tạo sản phẩm thành công', data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Cập nhật
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, price, salePrice, categoryId } = req.body;

    const updated = await productService.updateProduct(id, {
      name, slug, description, price, salePrice, categoryId
    }, req.files);

    res.status(200).json({ success: true, message: 'Cập nhật sản phẩm thành công', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Xóa
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(200).json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
