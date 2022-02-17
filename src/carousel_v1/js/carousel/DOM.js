export class CarouselDOM {
    constructor(prefix) {
        this._prefix = prefix;
    }

    /*
        //////////////////////////////////////////////////////////////////////
        COMMON
        //////////////////////////////////////////////////////////////////////
    */

    setMinWidth(items, value) {
        if (!items || !items.length) {
            return;
        }

        items.forEach(item => {
            item.style.minWidth = `${value}px`;
        });
    }

    setTranslateX(item, value) {
        if (!item) {
            return;
        }

        item.style.transform = `translateX(${value}px)`;
    }

    setDisabled(item, value) {
        if (!item) {
            return;
        }

        item.disabled = value;
    }

    /*
        //////////////////////////////////////////////////////////////////////
        MAIN ELEMENTS
        //////////////////////////////////////////////////////////////////////
    */

    findMainCarouselElements() {
        return {
            container: document.querySelector(`.${this._prefix}`),
            content: document.querySelector(`.${this._prefix}__content`),
            track: document.querySelector(`.${this._prefix}__track`),
            items: document.querySelectorAll(`.${this._prefix}__item`),
        }
    }

    /*
        //////////////////////////////////////////////////////////////////////
        ARROWS
        //////////////////////////////////////////////////////////////////////
    */

    createArrows(container) {
        const arrowPrev = document.createElement('button');
        arrowPrev.className = `${this._prefix}__arrow ${this._prefix}__arrow--prev`;
        container.prepend(arrowPrev);

        const arrowNext = document.createElement('button');
        arrowNext.className = `${this._prefix}__arrow ${this._prefix}__arrow--next`;
        container.append(arrowNext);

        return { arrowPrev, arrowNext };
    }

    /*
        //////////////////////////////////////////////////////////////////////
        DOTS
        //////////////////////////////////////////////////////////////////////
    */

    getDotClassName() {
        return `${this._prefix}__dot`;
    }

    getActiveDotClassName() {
        return `${this._prefix}__dot--active`;
    }

    createDots(container, count) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = `${this._prefix}__dots`;
        container.append(dotsContainer);

        const dotItems = [];
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('span');
            dot.className = this.getDotClassName();
            dotsContainer.append(dot);
            dotItems.push(dot);
        }

        return { dotsContainer, dotItems };
    }

    setActiveDot(dots, activeDotIndex) {
        if (!dots || !dots.length) {
            return;
        }

        const activeClass = this.getActiveDotClassName();
        dots.forEach(dot => dot.classList.remove(activeClass));
        dots[activeDotIndex].classList.add(activeClass);
    }
}