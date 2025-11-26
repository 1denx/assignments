import { showError, clearErrors } from "./utils.js";

const API = "http://127.0.0.1:8000";

// 讀取 username 確認是否登入
const username = localStorage.getItem("name");
if (!username) {
  location.href = "index.html";
}

// 顯示 username
const welcomeEl = document.querySelector("#welcome_user");
if (welcomeEl) {
  welcomeEl.innerText = `${username}，歡迎登入系統`;
}

// 登出
const logoutBtn = document.querySelector("#logout_btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // 清除登入資訊
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");

    location.href = "index.html";
  });
}

// 顯示查詢會員 ID
const searchForm = document.querySelector("#form_search");
const idField = document.querySelector("#search_id");
const resultEl = document.querySelector("#search_result");

if (searchForm) {
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    resultEl.innerHTML = "";

    const memberId = Number(idField.value.trim());

    if (!memberId || memberId <= 0) {
      showError(idField, "請輸入有效的會員 ID");
      return;
    }

    try {
      const res = await fetch(`${API}/api/member/${memberId}`);
      const data = await res.json();

      if (!data.success) {
        showError(idField, "查無此會員");
        return;
      }

      resultEl.innerHTML = `<p class="mt-5">${data.data.name} (${data.data.email})</p>`;
    } catch (err) {
      showError(idField, "查詢失敗，請稍後再試");
      console.error(err);
    }
  });
}
