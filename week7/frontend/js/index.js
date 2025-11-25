const API = "http://127.0.0.1:8000";

const username = localStorage.getItem("name");
if (username) {
  location.href = "member.html";
}

// 註冊
const signupForm = document.querySelector("#signup_form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    const res = await fetch(`${API}/api/signup`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      alert("註冊成功");
    } else {
      alert(data.msg);
    }
  });
}

// 登入
const loginForm = document.querySelector("#login_form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("name", data.name);
      location.href = "member.html";
    } else {
      alert(data.msg);
    }
  });
}
