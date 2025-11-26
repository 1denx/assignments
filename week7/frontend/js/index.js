import { showError, clearErrors } from "./utils.js";

const API = "http://127.0.0.1:8000";

const emailRegex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

const username = localStorage.getItem("name");
if (username) {
  location.href = "member.html";
}

// 註冊
const signupForm = document.querySelector("#signup_form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const nameField = document.querySelector("#signup_name");
    const emailField = document.querySelector("#signup_email");
    const pwdField = document.querySelector("#signup_pwd");

    let hasError = false;

    if (nameField.value.trim() === "") {
      showError(nameField, "姓名不可為空");
      hasError = true;
    }

    if (emailField.value.trim() === "") {
      showError(emailField, "信箱不可為空");
      hasError = true;
    } else if (!emailRegex.test(emailField.value.trim())) {
      showError(emailField, "請輸入正確的 Email 格式");
      hasError = true;
    }

    if (pwdField.value.trim() === "") {
      showError(pwdField, "密碼不可為空");
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      password: pwdField.value.trim(),
    };

    const res = await fetch(`${API}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.msg || "註冊失敗");
      signupForm.reset();
      return;
    }

    if (data.ok) {
      alert("註冊成功");
      signupForm.reset();
      return;
    }
  });
}

// 登入
const loginForm = document.querySelector("#login_form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const emailField = document.querySelector("#login_email");
    const pwdField = document.querySelector("#login_pwd");

    let hasError = false;

    if (emailField.value.trim() === "") {
      showError(emailField, "信箱不可為空");
      hasError = true;
    } else if (!emailRegex.test(emailField.value.trim())) {
      showError(emailField, "請輸入正確的 Email 格式");
      hasError = true;
    }

    if (pwdField.value.trim() === "") {
      showError(pwdField, "密碼不可為空");
      hasError = true;
    }

    if (hasError) return;

    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailField.value.trim(),
        password: pwdField.value.trim(),
      }),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.msg || "登入失敗");
      return;
    }
    if (!data.data) {
      alert("查無此帳號");
      return;
    }
    if (!data.data.id || !data.data.name) {
      alert("登入資料異常");
      return;
    }

    localStorage.setItem("member_id", data.data.id);
    localStorage.setItem("name", data.data.name);
    location.href = "member.html";
  });
}
