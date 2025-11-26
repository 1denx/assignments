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

    const formData = new FormData(signupForm);
    const res = await fetch(`${API}/api/signup`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      alert("註冊成功");
      signupForm.reset();
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

    const formData = new FormData(loginForm);
    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("member_id", data.member_id);
      localStorage.setItem("name", data.name);
      location.href = "member.html";
    } else {
      alert(data.msg);
    }
  });
}
