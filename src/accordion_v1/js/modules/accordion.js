export const initAccordeon = (containerId, activeKeys = [], expandAll = false) => {
    let activePanelKeys = [...activeKeys];

    if (!expandAll && activePanelKeys.length > 1) {
        throw new Error("Accordeon with expandAll === false can't contains more than one active panel keys");
    }

    const container = document.querySelector(containerId);
    const panels = container.querySelectorAll(".panel-accordion");

    const setActive = (nextKeys) => {
        for (const currKey of activePanelKeys) {
            const currActivePanel = container.querySelector(`.panel-accordion[data-key=${currKey}]`);
            currActivePanel.classList.remove("active");
        }

        activePanelKeys = nextKeys;

        for (const nextKey of nextKeys) {
            const nextActivePanel = container.querySelector(`.panel-accordion[data-key=${nextKey}]`);
            nextActivePanel.classList.add("active");
        }
    }

    const getNextKeys = (clickedKey) => {
        const index = activePanelKeys.indexOf(clickedKey);

        if (expandAll) {
            return index === -1
                ? [...activePanelKeys, clickedKey]
                : [...activePanelKeys.slice(0, index), ...activePanelKeys.slice(index + 1)];
        }

        return index === -1 ? [clickedKey] : [];
    }

    setActive(activePanelKeys);

    panels.forEach(panel => {
        panel.addEventListener("click", (event) => {
            if (!event.target.parentNode.classList.contains("panel-accordion__header")) {
                return;
            }

            const key = event.target.parentNode.parentNode.dataset.key;
            setActive(getNextKeys(key));
        });
    });
};