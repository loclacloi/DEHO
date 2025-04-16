const categoriesURL = "http://localhost:8080/categories";

export async function renderCategories() {
  try {
    const res = await fetch(categoriesURL);
    const json = await res.json();
    const categories = json.data;

    const content = document.getElementById("content");
    content.innerHTML = `
      <h2>Quản lý danh mục</h2>
      <div class="search-add">
        <input type="text" id="searchCategoryInput" placeholder="🔍 Tìm danh mục..." />
        <button id="addCategoryBtn">➕ Thêm danh mục</button>
      </div>

      <table>
        <thead>
          <tr><th>STT</th><th>Tên</th><th>Slug</th><th>Hình ảnh</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          ${categories.map((c, i) => `
            <tr data-id="${c._id}">
              <td>${i + 1}</td>
              <td>${c.name}</td>
              <td>${c.slug}</td>
              <td><img src="${c.image}" width="50" /></td>
              <td>
                <button class="editBtn" data-id="${c._id}">Sửa</button>
                <button class="deleteBtn" data-id="${c._id}">Xóa</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    document.getElementById("addCategoryBtn").onclick = showAddForm;
    document.querySelectorAll(".editBtn").forEach(btn => btn.onclick = () => showEditForm(btn.dataset.id));
    document.querySelectorAll(".deleteBtn").forEach(btn => btn.onclick = () => deleteCategory(btn.dataset.id));

    document.getElementById("searchCategoryInput").oninput = (e) => {
      const keyword = e.target.value.trim().toLowerCase();
      const rows = document.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const name = row.children[1].textContent.toLowerCase();
        row.style.display = name.includes(keyword) ? "table-row" : "none";
      });
    };
  } catch (err) {
    console.error("Lỗi khi tải danh mục:", err);
  }
}
function updateRowNumbers() {
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row, index) => {
    row.children[0].textContent = index + 1; // Cập nhật cột STT
  });
}
// -------- Modal --------
function openModal(contentHTML) {
  document.getElementById("modalBody").innerHTML = contentHTML;
  document.getElementById("categoryModal").style.display = "block";
}
function closeModal() {
  document.getElementById("categoryModal").style.display = "none";
}
window.closeModal = closeModal;

// -------- Thêm --------
function showAddForm() {
  openModal(`
    <h3>Thêm danh mục mới</h3>
    <form id="addForm" enctype="multipart/form-data">
      <label>Tên danh mục</label>
      <input name="name" required />
      <label>Slug</label>
      <input name="slug" required />
      <label>Hình ảnh</label>
      <input type="file" name="image" required />
      <button type="submit">Thêm</button>
    </form>
  `);
  document.getElementById("addForm").onsubmit = handleAddSubmit;
}

async function handleAddSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const res = await fetch(`${categoriesURL}/add`, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (result.success) {
      alert("✅ Thêm thành công");
      closeModal();

      const newCat = result.data;

      const tbody = document.querySelector("tbody");
      const newRow = document.createElement("tr");
      newRow.setAttribute("data-id", newCat._id);
      newRow.innerHTML = `
        <td></td> <!-- STT sẽ được cập nhật -->
        <td>${newCat.name}</td>
        <td>${newCat.slug}</td>
        <td><img src="${newCat.image}" width="50" /></td>
        <td>
          <button class="editBtn" data-id="${newCat._id}">Sửa</button>
          <button class="deleteBtn" data-id="${newCat._id}">Xóa</button>
        </td>
      `;
      tbody.appendChild(newRow);

      newRow.querySelector(".editBtn").onclick = () => showEditForm(newCat._id);
      newRow.querySelector(".deleteBtn").onclick = () => deleteCategory(newCat._id);

      updateRowNumbers(); // Cập nhật STT
    } else throw new Error(result.message);
  } catch (err) {
    alert("❌ " + err.message);
  }
}

// -------- Sửa --------
async function showEditForm(id) {
  try {
    const res = await fetch(`${categoriesURL}`);
    const json = await res.json();
    const category = json.data.find(c => c._id === id);

    openModal(`
      <h3>Sửa danh mục</h3>
      <form id="editForm">
        <label>Tên danh mục</label>
        <input name="name" value="${category.name}" required />
        <label>Slug</label>
        <input name="slug" value="${category.slug}" required />
        <input type="hidden" name="oldImage" value="${category.image}" />
        <label>Hình ảnh (nếu cần thay)</label>
        <input type="file" name="image" />
        <button type="submit">Cập nhật</button>
      </form>
    `);
    document.getElementById("editForm").onsubmit = (e) => handleEditSubmit(e, id);
  } catch (err) {
    alert("❌ Không thể tải danh mục");
  }
}

async function handleEditSubmit(e, id) {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const res = await fetch(`${categoriesURL}/update/${id}`, {
      method: "PUT",
      body: formData,
    });
    const result = await res.json();
    if (result.success) {
      alert("✅ Cập nhật thành công");
      closeModal();

      const row = document.querySelector(`.editBtn[data-id="${id}"]`)?.closest("tr");
      if (row) {
        row.children[1].textContent = e.target.name.value;
        row.children[2].textContent = e.target.slug.value;

        const fileInput = e.target.image;
        if (fileInput.files.length > 0) {
          const reader = new FileReader();
          reader.onload = e => {
            row.children[3].querySelector("img").src = e.target.result;
          };
          reader.readAsDataURL(fileInput.files[0]);
        }
      }
    } else throw new Error(result.message);
  } catch (err) {
    alert("❌ " + err.message);
  }
}

// -------- Xoá --------
async function deleteCategory(id) {
  if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
  try {
    const res = await fetch(`${categoriesURL}/delete/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (result.success) {
      alert("✅ Đã xoá");

      const row = document.querySelector(`.deleteBtn[data-id="${id}"]`)?.closest("tr");
      if (row) row.remove();

      updateRowNumbers(); // Cập nhật STT
    } else throw new Error(result.message);
  } catch (err) {
    alert("❌ " + err.message);
  }
}
