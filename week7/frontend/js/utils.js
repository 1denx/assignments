export const showError = (field, errorText) => {
  field.classList.add("error");
  const errorEl = document.createElement("small");
  errorEl.classList.add("error-text");
  errorEl.innerText = errorText;
  field.parentElement.appendChild(errorEl);
};

export const clearErrors = () => {
  document
    .querySelectorAll(".error")
    .forEach((field) => field.classList.remove("error"));
  document
    .querySelectorAll(".error-text")
    .forEach((errorText) => errorText.remove());
};
