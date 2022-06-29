const menu = document.querySelector(".menu");
const openMenuBtn = document.querySelector(".open-menu");
const closeMenuBtn = document.querySelector(".close-menu");
const followingBtn = document.querySelector("#following");
const userBtn = document.querySelector("#nametitle");

function toggleMenu() {
  menu.classList.toggle("menu_opened");
}

openMenuBtn.addEventListener("click", toggleMenu);
closeMenuBtn.addEventListener("click", toggleMenu);
followingBtn.addEventListener("click", toggleMenu);
userBtn.addEventListener("click", toggleMenu);

