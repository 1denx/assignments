function validateForm(event) {
  const checkbox = document.querySelector("#agree");
  if (!checkbox.checked) {
    event.preventDefault();
    alert("請勾選同意條款");
    return false;
  } else {
    return true;
  }
}
document
  .querySelector("#hotel-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const id = document.querySelector("#hotel").value.trim();

    if (!/^[1-9][0-9]*$/.test(id)) {
      alert("請輸入正整數");
      return;
    }

    window.location.href = `/hotel/${id}`;
  });
