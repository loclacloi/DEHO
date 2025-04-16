import { renderCategories } from "./categories.js";
import { renderProducts } from "./products.js";
import { renderUsersByRole } from "./users.js";
import { renderOrders } from "./orders.js";
import { renderDashboard } from "./dashboard.js";

let currentTab = localStorage.getItem("currentTab") || "dashboard";

document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");

  const buttons = [
    { id: "btnDashboard", tab: "dashboard", action: renderDashboard },
    { id: "btnCategories", tab: "category", action: renderCategories },
    { id: "btnProducts", tab: "product", action: renderProducts },
    { id: "btnAdmins", tab: "admin", action: () => renderUsersByRole("admin") },
    { id: "btnCustomers", tab: "customer", action: () => renderUsersByRole("customer") },
    { id: "btnOrders", tab: "order", action: renderOrders }
  ];

  buttons.forEach(({ id, tab, action }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        buttons.forEach(({ id }) => document.getElementById(id)?.classList.remove("active"));
        btn.classList.add("active");
        content.innerHTML = "<p>Đang tải...</p>";
        currentTab = tab;
        localStorage.setItem("currentTab", currentTab);
        action();
      });
    }
  });



  // Toggle submenu
  const userMenuBtn = document.getElementById("btnUserMenu");
  const userSubmenu = document.getElementById("userSubmenu");

  if (userMenuBtn && userSubmenu) {
    userMenuBtn.addEventListener("click", () => {
      userMenuBtn.parentElement.classList.toggle("active");
    });
  }
});


