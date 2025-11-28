import { showError, clearErrors } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initUser();
  initLogout();
  initSearch();
  initUpdate();
  initQueryLog();
});
// 顯示 username
function initUser() {
  const usernameEl = document.querySelector("#welcome_user");
  usernameEl.textContent = `${usernameEl.dataset.name}，歡迎登入系統`;
}

// 登出
function initLogout() {
  const logoutBtn = document.querySelector("#logout_btn");
  logoutBtn.addEventListener("click", () => {
    window.location.href = "/logout";
  });
}

// 查詢會員資料
function initSearch() {
  const form = document.querySelector("#form_search");
  const idField = document.querySelector("#search_id");
  const result = document.querySelector("#search_result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    result.innerHTML = "";

    const memberId = idField.value.trim();

    if (!memberId) {
      showError(idField, "請輸入有效的會員 ID");
      return;
    }

    const res = await fetch(`/api/member/${memberId}`);
    const data = await res.json();

    if (!data.data) {
      showError(idField, "查無資料");
      return;
    }

    result.innerHTML = `<p class="mt-5">${data.data.name} (${data.data.email})</p>`;
    idField.value = "";
  });
}

// 更新 username
function initUpdate() {
  const form = document.querySelector("#form_update");
  const nameField = document.querySelector("#update_name");
  const updateEl = document.querySelector("#update_result");
  const usernameEl = document.querySelector("#welcome_user");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    updateEl.innerHTML = "";

    const newName = nameField.value.trim();
    if (!newName) {
      showError(nameField, "名稱不得為空");
      return;
    }

    const res = await fetch("/api/member", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    const data = await res.json();

    if (data.ok) {
      updateEl.dataset.name = newName;
      usernameEl.innerText = `${newName}，歡迎登入系統`;
      nameField.value = "";
    } else {
      updateEl.innerHTML = `<p class="mt-5">更新失敗</p>`;
      nameField.value = "";
    }
  });
}

// 查詢紀錄
function initQueryLog() {
  const queryLogBtn = document.querySelector("#query_log_btn");
  const logList = document.querySelector("#query_log_list");

  queryLogBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/query_log");
      const data = await res.json();

      logList.innerHTML = "";

      console.log(data.data);
      if (!data.data || data.data.length === 0) {
        logList.innerHTML = `<li>目前沒有任何查詢紀錄</li>`;
        return;
      }

      logList.innerHTML = data.data
        .map(
          (record) =>
            `<li class="list-flex">
              <p>${record.searcher_name} </p>
              <p>(${record.created_at.replace("T", " ")})</p>
            </li>`
        )
        .join("");
    } catch (err) {
      logList.innerHTML = `<li>查詢失敗</li>`;
    }
  });
}
