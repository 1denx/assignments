const signupForm = document.querySelector("#signup_form");
const loginForm = document.querySelector("#login_form");

const showError = (field, errorText) => {
  field.classList.add("error");
  const errorEl = document.createElement("small");
  errorEl.classList.add("error-text");
  errorEl.innerText = errorText;
  field.parentElement.appendChild(errorEl);
};

const clearErrors = () => {
  document
    .querySelectorAll(".error")
    .forEach((field) => field.classList.remove("error"));
  document
    .querySelectorAll(".error-text")
    .forEach((errorText) => errorText.remove());
};

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
  signupForm.submit();
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

  loginForm.submit();
};

signupForm.addEventListener("submit", handleSignup);
loginForm.addEventListener("submit", handleLogin);
