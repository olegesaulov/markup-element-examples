const linkClassName = "menu-header__link";
const burger = document.querySelector(".top-header__burger");
const bottomHeader = document.querySelector(".bottom-header");
const body = document.querySelector("body");

const headerItemClickHandler = () => {
    burger.classList.toggle("active");
    bottomHeader.classList.toggle("active");
    body.classList.toggle("lock");
}

burger.addEventListener("click", headerItemClickHandler);
bottomHeader.addEventListener("click", (event) => {
    if (!event.currentTarget.classList.contains('active')) {
        return;
    }

    if (!event.target.classList.contains(linkClassName)) {
        return;
    }

    headerItemClickHandler();
});
