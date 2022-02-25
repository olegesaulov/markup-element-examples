const DATA_TYPE = {
    backdrop: "backdrop",
    inputContainer: "input-container",
    value: "value",
    placeholder: "placeholder",
    arrow: "arrow",
    clear: "clear",
    item: "item",
}

const getTemplate = (data = [], placeholder = "Select", allowClear = false, selectedId = null) => {
    const { id = null, value = "" } = data.find(item => item.id === selectedId) || {};

    const getItems = () => {
        return data.map(item => {
            const classes = ["select__item"];

            if (item.id === id) {
                classes.push("selected");
            }

            return `
                <li class="${classes.join(" ")}" data-type="${DATA_TYPE.item}" data-id="${item.id}">${item.value}</li>
            `;
        }).join("");
    }

    const getValue = () => {
        return `
            <span class="select__value ${id ? '' : 'hidden'}" data-type="${DATA_TYPE.value}">${value}</span>
            <span class="select__placeholder ${id ? 'hidden' : ''}" data-type="${DATA_TYPE.placeholder}">${placeholder}</span>
        `;
    }

    const getIcon = () => {
        const isCLearIconVisible = allowClear && id;

        return `
            <i class="fa fa-chevron-down select__icon select__icon--arrow ${isCLearIconVisible ? 'hidden' : ''}" data-type="${DATA_TYPE.arrow}"></i>
            <i class="fa fa-times select__icon select__icon--clear ${isCLearIconVisible ? '' : 'hidden'}" data-type="${DATA_TYPE.clear}"></i>
        `;
    }

    return `
        <div class="select__backdrop" data-type="${DATA_TYPE.backdrop}"></div>
        <div class="select__input-container" data-type="${DATA_TYPE.inputContainer}">
            ${getValue()}
            ${getIcon()}            
        </div>
        <div class="select__droprown">
            <ul class="select__list">
                ${getItems()}
            </ul>
        </div>
    `;
}

export class Select {
    constructor(selector, options) {
        this.$el = document.querySelector(selector);
        this.options = options;
        this.selectedId = options.selectedId || null;

        this.#render();
        this.#init();
    }

    /*
        API /////////////////////////////////////////////////////////////////
    */

    get isOpen() {
        return this.$el.classList.contains("open");
    }

    get current() {
        return this.options.data.find(item => item.id === this.selectedId);
    }

    open() {
        this.$el.classList.add("open");
        this.$arrow.classList.remove("fa-chevron-down");
        this.$arrow.classList.add("fa-chevron-up");
    }

    close() {
        this.$el.classList.remove("open");
        this.$arrow.classList.add("fa-chevron-down");
        this.$arrow.classList.remove("fa-chevron-up");
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    select(id) {
        this.selectedId = id;
        const current = this.current;

        this.$value.textContent = current.value;
        this.$value.classList.remove("hidden");
        this.$placeholder.classList.add("hidden");

        if (this.options.allowClear) {
            this.$clear.classList.remove("hidden");
            this.$arrow.classList.add("hidden");
        }

        const items = this.$el.querySelectorAll(`[data-type="${DATA_TYPE.item}"]`);
        items.forEach(item => {
            item.classList.remove("selected");
        })
        const selectedItem = this.$el.querySelector(`[data-id="${id}"]`);
        selectedItem.classList.add("selected");

        this.options.onSelect && this.options.onSelect(current)

        this.close();
    }

    clear() {
        this.selectedId = null;

        this.$value.textContent = "";
        this.$value.classList.add("hidden");
        this.$placeholder.classList.remove("hidden");

        if (this.options.allowClear) {
            this.$clear.classList.add("hidden");
            this.$arrow.classList.remove("hidden");
        }

        const items = this.$el.querySelectorAll(`[data-type="${DATA_TYPE.item}"]`);
        items.forEach(item => {
            item.classList.remove("selected");
        })

        this.options.onClear && this.options.onClear()

        this.close();
    }

    destroy() {
        this.$el.removeEventListener("click", this.#clickHandler);
        this.$el.innerHTML = '';
    }

    /*
        LOGIC /////////////////////////////////////////////////////////////////
    */

    #render() {
        const { placeholder, data, allowClear } = this.options;

        this.$el.classList.add("select");
        this.$el.innerHTML = getTemplate(data, placeholder, allowClear, this.selectedId);
    }

    #init() {
        this.$el.addEventListener("click", this.#clickHandler);
        this.$arrow = this.$el.querySelector(`[data-type="${DATA_TYPE.arrow}"]`);
        this.$clear = this.$el.querySelector(`[data-type="${DATA_TYPE.clear}"]`);
        this.$value = this.$el.querySelector(`[data-type="${DATA_TYPE.value}"]`);
        this.$placeholder = this.$el.querySelector(`[data-type="${DATA_TYPE.placeholder}"]`);
    }

    #clickHandler = (event) => {
        const { type } = event.target.dataset;

        if (type === DATA_TYPE.inputContainer || type === DATA_TYPE.arrow) {
            this.toggle();
            return;
        }

        if (type == DATA_TYPE.clear) {
            this.clear();
            return;
        }

        if (type === DATA_TYPE.item) {
            this.select(event.target.dataset.id);
            return;
        }

        if (type === DATA_TYPE.backdrop) {
            this.close();
            return;
        }
    }
}