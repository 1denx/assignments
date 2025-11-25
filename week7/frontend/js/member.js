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
