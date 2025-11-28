import { showError, clearErrors } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initSignup();
  initLogin();
});

const handleSignup = (e) => {
  e.preventDefault();
  clearErrors();

  const name = document.querySelector("#signup_name");
  const email = document.querySelector("#signup_email");
  const pwd = document.querySelector("#signup_pwd");

  const nameVal = name.value.trim();
  const emailVal = email.value.trim();
  const pwdVal = pwd.value.trim();

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (nameVal === "") {
    showError(name, "請輸入姓名");
  }
  if (!emailPattern.test(emailVal)) {
    showError(email, "請輸入有效的電子郵件");
  }
  if (pwdVal === "") {
    showError(pwd, "請輸入密碼");
  }
  const errorInputs = document.querySelectorAll(".error");
  if (errorInputs.length > 0) return;

  e.target.submit();
};
const handleLogin = (e) => {
  e.preventDefault();
  clearErrors();

  const email = document.querySelector("#login_email");
  const pwd = document.querySelector("#login_pwd");

  const emailVal = email.value.trim();
  const pwdVal = pwd.value.trim();

  if (emailVal === "") {
    showError(email, "請輸入電子郵件");
  }
  if (pwdVal === "") {
    showError(pwd, "請輸入密碼");
  }
  const errorInputs = document.querySelectorAll(".error");
  if (errorInputs.length > 0) return;

  e.target.submit();
};

// signup
function initSignup() {
  const form = document.querySelector("#signup_form");
  if (!form) return;

  form.addEventListener("submit", handleSignup);
}
// login
function initLogin() {
  const form = document.querySelector("#login_form");
  if (!form) return;

  form.addEventListener("submit", handleLogin);
}
