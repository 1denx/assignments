const mobileMenuBtn = document.querySelector(".mobile_menu");
const navMenu = document.querySelector(".nav_menu");
const closeBtn = document.querySelector(".btn");

mobileMenuBtn.addEventListener("click", () => {
  navMenu.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  navMenu.classList.remove("open");
});

document.addEventListener("click", (e) => {
  if (
    navMenu.classList.contains("open") &&
    !navMenu.contains(e.target) &&
    !mobileMenuBtn.contains("e.target")
  ) {
    navMenu.classList.remove("open");
  }
});
