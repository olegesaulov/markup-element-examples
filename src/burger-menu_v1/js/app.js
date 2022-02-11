const header__burger = document.querySelector(".header__burger");
const header__menu = document.querySelector(".header__menu");
const body = document.querySelector("body");

[header__burger, header__menu].forEach(item => {
    item.addEventListener("click", () => {
        header__burger.classList.toggle("active");
        header__menu.classList.toggle("active");
        body.classList.toggle("lock");
    });
});