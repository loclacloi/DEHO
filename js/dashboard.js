export function renderDashboard() {
    const content = document.getElementById("content");
  
    fetch("http://localhost:8080/orders")
      .then((response) => response.json())
      .then((data) => {
        const orders = data.data;
  
        content.innerHTML = `
          <div class="dashboard">
            <h2>Bảng điều khiển</h2>
            <div class="order-section">
              <h3>Đơn hàng đang chờ xử lý</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders
                    .filter((order) => order.status === "Chờ xác nhận")
                    .map((order) => `
                      <tr>
                        <td>${order._id}</td>
                        <td>${order.customerName}</td>
                        <td>${order.total}</td>
                        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>${order.status}</td>
                        <td><button onclick="viewOrderDetails('${order._id}')">Xem</button></td>
                      </tr>
                    `)
                    .join("")}
                </tbody>
              </table>
            </div>
  
            <div class="order-section">
              <h3>Đơn hàng đã hoàn thành</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Ngày tạo</th>
                    <th>Trạng thái</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders
                    .filter((order) => order.status === "Đã giao")
                    .map((order) => `
                      <tr>
                        <td>${order._id}</td>
                        <td>${order.customerName}</td>
                        <td>${order.total}</td>
                        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>${order.status}</td>
                        <td><button onclick="viewOrderDetails('${order._id}')">Xem</button></td>
                      </tr>
                    `)
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }
  
  function viewOrderDetails(orderId) {
    window.location.href = `order-details.html?id=${orderId}`;
  }
  