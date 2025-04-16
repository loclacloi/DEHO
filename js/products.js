const productsURL = "http://localhost:8080/products";

// ===== HIỂN THỊ DANH SÁCH SẢN PHẨM =====
export async function renderProducts() {
  try {
    const res = await fetch(productsURL);
    const json = await res.json();
    const products = json.data;

    const content = document.getElementById("content");
    content.innerHTML = `
      <h2>Quản lý sản phẩm</h2>
      <div class="search-add">
        <input type="text" id="searchProductInput" placeholder="🔍 Tìm sản phẩm..." />
        <button id="addProductBtn" class="highlight">➕ Thêm sản phẩm</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>STT</th><th>Tên</th><th>Giá</th><th>Giảm</th><th>Ảnh</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${products.map((p, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${p.name}</td>
              <td>${p.price.toLocaleString()}đ</td>
              <td>${p.salePrice?.toLocaleString() || '0'}đ</td>
              <td><img src="${p.thumbnail}" width="50" /></td>
              <td>
                <button  type="submit" class="viewBtn" data-id="${p._id}">Xem</button>
                <button  type="submit" class="editBtn" data-id="${p._id}">Sửa</button>
                <button  type="submit" class="deleteBtn" data-id="${p._id}">Xóa</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    document.getElementById("searchProductInput").oninput = (e) => {
      const keyword = e.target.value.trim().toLowerCase();
      document.querySelectorAll("tbody tr").forEach((row) => {
        const name = row.children[1].textContent.toLowerCase();
        row.style.display = name.includes(keyword) ? "table-row" : "none";
      });
    };

    document.getElementById("addProductBtn").onclick = showAddProductForm;
    document.querySelectorAll(".viewBtn").forEach(btn => btn.onclick = () => showProductDetails(btn.dataset.id));
    document.querySelectorAll(".editBtn").forEach(btn => btn.onclick = () => showEditProductForm(btn.dataset.id));
    document.querySelectorAll(".deleteBtn").forEach(btn => btn.onclick = () => deleteProduct(btn.dataset.id));

  } catch (err) {
    console.error("❌ Lỗi khi tải sản phẩm:", err);
  }
}

// ===== MODAL =====
function openModal(contentHTML) {
  document.getElementById("modalBody").innerHTML = contentHTML;
  document.getElementById("categoryModal").style.display = "block";

  // CHẶN TẤT CẢ SUBMIT FORM TRONG MODAL NẾU CHƯA ĐƯỢC GÁN ĐÚNG
  document.querySelectorAll("#modalBody form").forEach(form => {
    form.addEventListener("submit", (e) => {
      if (!form.onsubmit) e.preventDefault(); // Nếu chưa gán form.onsubmit thì chặn reload
    });
  });
}

function closeModal() {
  document.getElementById("categoryModal").style.display = "none";
}
window.closeModal = closeModal;

// ===== LẤY CHI TIẾT THEO ID =====
async function getProductById(id) {
  const res = await fetch(`${productsURL}/${id}`);
  const json = await res.json();
  return json.data;
}

// ===== XEM CHI TIẾT =====
async function showProductDetails(id) {
  try {
    const product = await getProductById(id);
    openModal(`
      <h3>Chi tiết sản phẩm</h3>
      <p><strong>Tên:</strong> ${product.name}</p>
      <p><strong>Mô tả:</strong> ${product.description}</p>
      <p><strong>Giá:</strong> ${product.price.toLocaleString()}đ</p>
      <p><strong>Giá giảm:</strong> ${product.salePrice?.toLocaleString() || '0'}đ</p>
      <p><strong>Danh mục:</strong> ${product.categoryId}</p>
      <p><strong>Ảnh thumbnail:</strong><br><img src="${product.thumbnail}" width="100" /></p>
      <p><strong>Ảnh chi tiết:</strong><br>
        ${(product.images || []).map(img => `<img src="${img}" width="80" />`).join(" ")}
      </p>
    `);
  } catch (err) {
    alert("❌ Không thể tải chi tiết sản phẩm");
  }
}

// ===== THÊM SẢN PHẨM =====
function showAddProductForm() {
  openModal(`
    <h3>Thêm sản phẩm mới</h3>
    <form id="addProductForm" enctype="multipart/form-data">
      <input name="name" placeholder="Tên sản phẩm" required />
      <input name="slug" placeholder="Slug" required />
      <input name="description" placeholder="Mô tả" required />
      <input name="price" type="number" placeholder="Giá" required />
      <input name="salePrice" type="number" placeholder="Giá giảm" />
      <input name="categoryId" placeholder="ID danh mục" required />
      <label>Thumbnail</label><input type="file" name="thumbnail" required />
      <label>Hình ảnh chi tiết</label><input type="file" name="images" multiple />
      <button type="submit">Thêm</button>
    </form>
  `);

  document.getElementById("addProductForm").onsubmit = handleAddProduct;
}

async function handleAddProduct(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  try {
    const res = await fetch(`${productsURL}/add`, {
      method: "POST",
      body: formData
    });
    const result = await res.json();
    if (result.success) {
      alert("✅ Đã thêm sản phẩm");
      closeModal();
      renderProducts();
    } else throw new Error(result.message);
  } catch (err) {
    alert("❌ " + err.message);
  }
}

// ===== SỬA SẢN PHẨM =====
async function showEditProductForm(id) {
  try {
    const product = await getProductById(id);
    openModal(`
      <h3>Sửa sản phẩm</h3>
      <form id="editProductForm" enctype="multipart/form-data">
        <input name="name" value="${product.name}" required />
        <input name="slug" value="${product.slug}" required />
        <input name="description" value="${product.description}" required />
        <input name="price" type="number" value="${product.price}" required />
        <input name="salePrice" type="number" value="${product.salePrice || 0}" />
        <input name="categoryId" value="${product.categoryId}" required />
        <input type="hidden" name="oldThumbnail" value="${product.thumbnail}" />
        <input type="hidden" name="oldImages" value="${product.images.join(',')}" />
        <label>Thumbnail (nếu đổi)</label><input type="file" name="thumbnail" />
        <label>Ảnh chi tiết (nếu đổi)</label><input type="file" name="images" multiple />
        <button type="submit">Cập nhật</button>
      </form>
    `);

    document.getElementById("editProductForm").onsubmit = (e) => handleEditProduct(e, id);
  } catch (err) {
    alert("❌ Lỗi tải sản phẩm");
  }
}

async function handleEditProduct(e, id) {
  e.preventDefault();
  const formData = new FormData(e.target);
  try {
    const res = await fetch(`${productsURL}/${id}`, {
      method: "PUT",
      body: formData
    });
    const result = await res.json();
    if (result.success) {
      alert("✅ Cập nhật thành công");
      closeModal();
      renderProducts();
    } else throw new Error(result.message);
  } catch (err) {
    alert("❌ " + err.message);
  }
}

// ===== XOÁ SẢN PHẨM =====
async function deleteProduct(id) {
  if (!confirm("Bạn có chắc muốn xoá sản phẩm này?")) return;
  try {
    const res = await fetch(`${productsURL}/delete/${id}`, {
      method: "DELETE"
    });
    const result = await res.json();
    if (result.success) {
      alert("✅ Đã xoá");
      renderProducts();
    } else throw new Error(result.message);
  } catch (err) {
    alert("❌ " + err.message);
  }
}
