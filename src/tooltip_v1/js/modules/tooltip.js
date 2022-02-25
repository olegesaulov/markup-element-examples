(() => {
    const classes = {
        top: ["tooltip", "tooltip--top"],
        right: ["tooltip", "tooltip--right"],
        bottom: ["tooltip", "tooltip--bottom"],
        left: ["tooltip", "tooltip--left"],
    }

    const createToolTip = (text = "", type = "bottom") => {
        const tooltip = document.createElement("div");
        tooltip.classList.add(...(classes[type] ?? classes.bottom));
        tooltip.innerHTML = text;

        return tooltip;
    }

    for (const container of document.querySelectorAll("[data-tooltip-text]")) {
        container.classList.add("tooltip-container");

        const text = container.dataset.tooltipText;
        const type = container.dataset.tooltipType;
        const tooltip = createToolTip(text, type);
        container.append(tooltip);
    }
})()