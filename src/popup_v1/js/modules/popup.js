export const showPopup = (selector) => {
    const popup = document.querySelector(selector);
    popup && popup.classList.add("show");
}

export const hidePopup = (selector) => {
    const popup = document.querySelector(selector);
    popup && popup.classList.remove("show");
}