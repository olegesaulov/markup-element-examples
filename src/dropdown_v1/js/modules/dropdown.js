(() => {
    const dropdownBtnList = document.querySelectorAll('.dropdown__button');

    for (const dropdownBtn of dropdownBtnList) {
        const dropdown = dropdownBtn.parentNode;

        if (dropdown.dataset.trigger === "click") {
            dropdownBtn.addEventListener("click", () => {
                dropdown.classList.toggle("active");
            });
        } else {
            dropdownBtn.addEventListener("mouseenter", () => {
                dropdown.classList.add("active");
            });
            dropdownBtn.addEventListener("mouseleave", () => {
                dropdown.classList.remove("active");
            });
        }
    }

    document.addEventListener("click", (event) => {
        const isDropdownClicked = event.target.classList.contains("dropdown__button") || event.target.matches(".dropdown__content *");

        if (!isDropdownClicked) {
            const dropdownList = document.querySelectorAll('.dropdown');
            dropdownList.forEach(dropdown => {
                dropdown.classList.remove("active");
            });
        }
    });
})();