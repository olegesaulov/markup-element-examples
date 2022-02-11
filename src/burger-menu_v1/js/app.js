const header__burger = document.querySelector(".header__burger");
const header__menu = document.querySelector(".header__menu");
const body = document.querySelector("body");

const headerItemClickHandler = () => {
    header__burger.classList.toggle("active");
    header__menu.classList.toggle("active");
    body.classList.toggle("lock");
}

header__burger.addEventListener("click", headerItemClickHandler);
header__menu.addEventListener("click", (event) => {
    if (!event.currentTarget.classList.contains('active')) {
        return;
    }

    headerItemClickHandler();
});
