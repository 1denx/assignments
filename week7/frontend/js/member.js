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
    localStorage.removeItem("member_id");
    localStorage.removeItem("name");

    location.href = "index.html";
  });
}

// 取得會員資料
async function loadMember(memberId, fromId) {
  try {
    const res = await fetch(`${API}/api/member/${memberId}?from=${fromId}`);
    const data = await res.json();
    console.log("會員資料", data);
    return data;
  } catch (err) {
    console.error("取得會員資料失敗", err);
    return null;
  }
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
    const myId = localStorage.getItem("member_id");

    if (!memberId || memberId <= 0) {
      showError(idField, "請輸入有效的會員 ID");
      return;
    }

    const data = await loadMember(memberId, myId);

    if (!data.data) {
      showError(idField, "查無此會員");
      idField.value = "";
      return;
    }

    resultEl.innerHTML = `<p class="mt-5">${data.data.name} (${data.data.email})</p>`;
    idField.value = "";
  });
}

// 更新 username
const updateForm = document.querySelector("#form_update");
const nameField = document.querySelector("#update_name");
const updateEl = document.querySelector("#update_result");

if (updateForm) {
  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    updateEl.innerHTML = "";

    const newName = nameField.value.trim();
    if (!newName) {
      showError(nameField, "名稱不可為空");
      return;
    }

    const memberId = localStorage.getItem("member_id");
    if (!memberId) {
      location.href = "index.html";
      return;
    }

    try {
      const res = await fetch(
        `${API}/api/member?member_id=${memberId}&from=${memberId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName }),
        }
      );

      const data = await res.json();

      if (data.ok) {
        updateEl.innerHTML = `<p class="mt-5">已更新</p>`;
        nameField.value = "";

        localStorage.setItem("name", newName);
        if (welcomeEl) {
          welcomeEl.innerText = `${newName}，歡迎登入系統`;
        }
      } else {
        updateEl.innerHTML = `<p class="mt-5">更新失敗</p>`;
        nameField.value = "";
      }
    } catch (err) {
      showError(nameField, "更新失敗");
      console.error(err);
    }
  });
}

// 查詢紀錄
const queryLogBtn = document.querySelector("#query_log_btn");
const logList = document.querySelector("#query_log_list");

if (queryLogBtn) {
  queryLogBtn.addEventListener("click", async () => {
    const myId = localStorage.getItem("member_id");

    if (!myId) return;

    try {
      const res = await fetch(`${API}/api/member/${myId}/query_log`);
      const data = await res.json();

      if (!data.data || data.data.length === 0) {
        logList.innerHTML = "<li>目前沒有任何查詢紀錄</li>";
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
