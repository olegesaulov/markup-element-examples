import "./burger.js";

const breakpoint = 930;
const headerLangs = document.querySelector('.header-langs');
const topHeader = document.querySelector(".top-header");
const bottomHeader = document.querySelector(".bottom-header");

const headerResizeHandler = () => {
    const documentWidth = window.innerWidth;

    if (documentWidth > breakpoint && bottomHeader.contains(headerLangs)) {
        topHeader.prepend(headerLangs);
    }

    if (documentWidth <= breakpoint && topHeader.contains(headerLangs)) {
        bottomHeader.prepend(headerLangs);
    }
}

window.addEventListener("resize", headerResizeHandler);
headerResizeHandler();