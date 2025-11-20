document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path === "/") {
    initSignup();
    initLogin();
  }

  if (path === "/member") {
    initCreateMsg();
    initDelMsg();
  }
});

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

// createMessage
function initCreateMsg() {
  const formMsg = document.querySelector("#form_msg");
  if (!formMsg) return;

  formMsg.addEventListener("submit", function (e) {
    const content = document.querySelector("#content").value.trim();
    if (!content) {
      e.preventDefault();
      alert("請輸入留言");
    }
  });
}

// deleteMessage
function initDelMsg() {
  const delBtn = document.querySelectorAll(".btn-del");

  delBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (!confirm("確定要刪除這則留言嗎？")) return;

      const res = await fetch("/deleteMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: id }),
      });

      const data = await res.json();

      if (data.success) {
        btn.parentElement.remove();
      } else {
        alert("刪除失敗：" + data.msg);
      }
    });
  });
}
