import { validateParams } from "./validator.js";
import { CarouselDOM } from "./DOM.js";

const defaultOptions = {
    itemsPerSlide: 1,
    itemsPerScroll: 1,
    initialSlide: 0,
    prefix: "carousel",
    showArrows: true,
    showDots: true,
    enableArrowKeysNav: true,
    enableCycleNav: true,
    enableAutoplay: true,
    autoplaySpeed: 3000,
    autoplayDir: 'ltr',
}

export class Carousel {
    constructor(options) {
        this.params = { ...defaultOptions, ...options };

        const errorMsg = validateParams(this.params);
        if (errorMsg) {
            throw new Error(errorMsg);
        }
    }

    init() {
        const setInitialSlide = () => {
            const { initialSlide, slidesCount } = this.params;

            const nextActiveSlide = initialSlide >= slidesCount ? slidesCount - 1 : initialSlide;
            this.setActiveSlide(nextActiveSlide);
        }

        const enableAutoplay = () => {
            if (!this.params.enableAutoplay) {
                return;
            }

            const intervalFunc = this.params.autoplayDir === 'ltr'
                ? this.onNextArrowClick
                : this.onPrevArrowClick;
            this.interval = setInterval(() => intervalFunc(false), this.params.autoplaySpeed);
        }

        const makeArrows = () => {
            const { showArrows, itemsPerSlide, itemsCount } = this.params;

            if (!showArrows || itemsPerSlide >= itemsCount) {
                return [];
            }

            return this.carouselDOM.createArrows(this.elements.content);
        }

        const makeDots = () => {
            const { showDots, itemsPerSlide, itemsCount, slidesCount } = this.params;

            if (!showDots || itemsPerSlide >= itemsCount) {
                return [];
            }

            return this.carouselDOM.createDots(this.elements.container, slidesCount);
        }

        this.carouselDOM = new CarouselDOM(this.params.prefix);
        this.elements = this.carouselDOM.findMainCarouselElements();
        this.params = {
            ...this.params,
            itemWidth: this.elements.content.clientWidth / this.params.itemsPerSlide,
            itemsCount: this.elements.items.length,
            slidesCount: 1 + Math.ceil(
                (this.elements.items.length - this.params.itemsPerSlide) / this.params.itemsPerScroll
            ),
            activeSlide: 0,
        };
        this.elements = {
            ...this.elements,
            ...makeArrows(),
            ...makeDots(),
        };
        this.interval = null;

        this.carouselDOM.setMinWidth(this.elements.items, this.params.itemWidth);
        setInitialSlide();
        enableAutoplay();
        this.initEventHandlers();
    }

    /*
        //////////////////////////////////////////////////////////////////////
        MAIN LOGIC
        //////////////////////////////////////////////////////////////////////
    */

    getTrackPosition() {
        const {
            activeSlide,
            slidesCount,
            itemsCount,
            itemWidth,
            itemsPerSlide,
            itemsPerScroll,
        } = this.params;

        if (activeSlide === 0) {
            return 0;
        }

        if (activeSlide === slidesCount - 1) {
            return -(itemsCount * itemWidth) + (itemsPerSlide * itemWidth);
        }

        return -activeSlide * (itemsPerScroll * itemWidth);
    }

    isPrevArrowDisabled() {
        return !this.params.enableCycleNav && this.params.activeSlide === 0;
    }

    isNextArrowDisabled() {
        return !this.params.enableCycleNav && this.params.activeSlide === this.params.slidesCount - 1;
    }

    updateTrackPosition(position) {
        this.carouselDOM.setTranslateX(this.elements.track, position);
    }

    updateDisabledArrows() {
        this.carouselDOM.setDisabled(this.elements.arrowPrev, this.isPrevArrowDisabled());
        this.carouselDOM.setDisabled(this.elements.arrowNext, this.isNextArrowDisabled());
    }

    updateActiveDot() {
        this.carouselDOM.setActiveDot(this.elements.dotItems, this.params.activeSlide);
    }

    setActiveSlide(nextActiveSlide) {
        this.params.activeSlide = nextActiveSlide;
        this.updateTrackPosition(this.getTrackPosition());
        this.updateDisabledArrows();
        this.updateActiveDot();
    }

    /*
        //////////////////////////////////////////////////////////////////////
        EVENT HANDLERS
        //////////////////////////////////////////////////////////////////////
    */

    onPrevArrowClick = (_clearInterval = true) => {
        if (_clearInterval) {
            clearInterval(this.interval);
        }

        if (this.isPrevArrowDisabled()) {
            return;
        }

        const nextActiveSlide = this.params.activeSlide === 0
            ? this.params.slidesCount - 1
            : this.params.activeSlide - 1;
        this.setActiveSlide(nextActiveSlide);
    }

    onNextArrowClick = (_clearInterval = true) => {
        if (_clearInterval) {
            clearInterval(this.interval);
        }

        if (this.isNextArrowDisabled()) {
            return;
        }

        const nextActiveSlide = this.params.activeSlide === this.params.slidesCount - 1
            ? 0
            : this.params.activeSlide + 1;
        this.setActiveSlide(nextActiveSlide);
    }

    onDotClick = (dot) => {
        clearInterval(this.interval);

        const nextActiveSlide = this.elements.dotItems?.indexOf(dot);
        this.setActiveSlide(nextActiveSlide);
    }

    initEventHandlers() {
        const { arrowPrev, arrowNext, dotsContainer } = this.elements;

        arrowPrev?.addEventListener("click", () => this.onPrevArrowClick());

        arrowNext?.addEventListener("click", () => this.onNextArrowClick());

        dotsContainer?.addEventListener("click", (event) => {
            if (!event.target.classList.contains(this.carouselDOM.getDotClassName())) {
                return;
            }

            this.onDotClick(event.target);
        });

        document.addEventListener("keydown", (event) => {
            if (!this.params.enableArrowKeysNav) {
                return;
            }

            switch (event.keyCode) {
                case 37: { // left
                    this.onPrevArrowClick();
                    break;
                }
                case 39: { // right
                    this.onNextArrowClick();
                    break;
                }
            }
        });
    }
}