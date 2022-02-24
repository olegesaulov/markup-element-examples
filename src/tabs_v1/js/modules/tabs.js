(() => {
    const defaultTabKey = "tab1";
    let activeTabKey = "tab2";

    const tabsContainer = document.querySelector(".tabs__header");

    const setActive = (key) => {
        const currActiveTabBtn = document.querySelector(`.tab-btn[data-key=${activeTabKey}]`);
        const currActiveTabContent = document.querySelector(`.tab-content[data-key=${activeTabKey}]`);
        currActiveTabBtn.classList.remove("active");
        currActiveTabContent.classList.remove("active");

        activeTabKey = key;

        const nextActiveTabBtn = document.querySelector(`.tab-btn[data-key=${activeTabKey}]`);
        const nextActiveTabContent = document.querySelector(`.tab-content[data-key=${activeTabKey}]`);
        nextActiveTabBtn.classList.add("active");
        nextActiveTabContent.classList.add("active");
    }

    setActive(activeTabKey);

    tabsContainer.addEventListener("click", (event) => {
        if (!event.target.classList.contains("tab-btn")) {
            return;
        }

        setActive(event.target.dataset.key || defaultTabKey);
    });
})();