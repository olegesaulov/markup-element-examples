export class Modal {
    constructor(options) {
        this.animationSpeed = 500;
        this.isClosing = false;
        this.isDestroyed = false;
        this.options = options;

        this.#createModal(this.options);
        this.#initHandlers();
    }

    open() {
        if (this.isDestroyed) {
            return;
        }

        !this.isClosing && this.$modal.classList.add("open");
        typeof this.options.onOpen === "function" && this.options.onOpen();
    }

    close() {
        if (this.isDestroyed) {
            return;
        }

        this.isClosing = true;
        this.$modal.classList.remove("open");
        this.$modal.classList.add("hide");
        setTimeout(() => {
            this.$modal.classList.remove("hide");
            this.isClosing = false;
            typeof this.options.onClose === "function" && this.options.onClose();
        }, this.animationSpeed);
    }

    setTitle(title) {
        this.$modalTitle.textContent = title;
    }

    setContent(content) {
        this.$modalContent.innerHTML = content;
    }

    destroy() {
        this.$modal.remove();
        this.#removeListeners();
        this.isDestroyed = true;
    }

    // logic   
    #createModal(options) {
        const DEFAULT_WIDTH = "500px";

        this.$modal = document.createElement("div");
        this.$modal.classList.add("modal");
        this.$modal.innerHTML = `
            <div class="modal__overlay" data-closable="true">
                <div class="modal__window" style="width: ${options.width || DEFAULT_WIDTH}">
                    <div class="modal__header">
                        <h3 class="modal__title" data-title>${options.title || "Title"}</h3>
                        ${options.closable ? '<div class="modal__close" data-closable="true">&times</div>' : ''}                        
                    </div>
                    <div class="modal__body" data-content>
                        ${options.content || ""}
                    </div>

                </div>
            </div>
        `;

        this.$modalTitle = this.$modal.querySelector("[data-title]");
        this.$modalContent = this.$modal.querySelector("[data-content]");

        const footer = this.#createFooter(options.buttons);
        this.$modalContent.after(footer);

        document.body.append(this.$modal);
    }

    #createFooter(buttons = []) {
        if (!buttons.length) {
            return document.createElement("div");
        }

        const $footer = document.createElement("div");
        $footer.classList.add("modal__footer");

        for (const button of buttons) {
            const $btn = document.createElement("button");
            $btn.classList.add("modal__btn", button.className);
            $btn.textContent = button.title;
            $btn.addEventListener("click", button.onClick || (() => { }));

            $footer.append($btn);
        }

        return $footer;
    }

    #modalClickhandler = (event) => {
        if (event.target.dataset.closable === "true") {
            this.close();
        }
    }

    #initHandlers() {
        this.$modal.addEventListener("click", this.#modalClickhandler);
    }

    #removeListeners() {
        this.$modal.removeEventListener("click", this.#modalClickhandler);
    }
}