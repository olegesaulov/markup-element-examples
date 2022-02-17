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
        this._params = { ...defaultOptions, ...options };

        const errorMsg = validateParams(this._params);
        if (errorMsg) {
            throw new Error(errorMsg);
        }
    }

    init() {
        const setInitialSlide = () => {
            const { initialSlide, slidesCount } = this._params;

            const nextActiveSlide = initialSlide >= slidesCount ? slidesCount - 1 : initialSlide;
            this._setActiveSlide(nextActiveSlide);
        }

        const enableAutoplay = () => {
            if (!this._params.enableAutoplay) {
                return;
            }

            const intervalFunc = this._params.autoplayDir === 'ltr'
                ? this._onNextArrowClick
                : this._onPrevArrowClick;
            this._interval = setInterval(() => intervalFunc(false), this._params.autoplaySpeed);
        }

        const makeArrows = () => {
            const { showArrows, itemsPerSlide, itemsCount } = this._params;

            if (!showArrows || itemsPerSlide >= itemsCount) {
                return [];
            }

            return this._carouselDOM.createArrows(this._elements.content);
        }

        const makeDots = () => {
            const { showDots, itemsPerSlide, itemsCount, slidesCount } = this._params;

            if (!showDots || itemsPerSlide >= itemsCount) {
                return [];
            }

            return this._carouselDOM.createDots(this._elements.container, slidesCount);
        }

        this._carouselDOM = new CarouselDOM(this._params.prefix);
        this._elements = this._carouselDOM.findMainCarouselElements();
        this._params = {
            ...this._params,
            itemWidth: this._elements.content.clientWidth / this._params.itemsPerSlide,
            itemsCount: this._elements.items.length,
            slidesCount: 1 + Math.ceil(
                (this._elements.items.length - this._params.itemsPerSlide) / this._params.itemsPerScroll
            ),
            activeSlide: 0,
        };
        this._elements = {
            ...this._elements,
            ...makeArrows(),
            ...makeDots(),
        };
        this._interval = null;

        this._carouselDOM.setMinWidth(this._elements.items, this._params.itemWidth);
        setInitialSlide();
        enableAutoplay();
        this._initEventHandlers();
    }

    /*
        //////////////////////////////////////////////////////////////////////
        MAIN LOGIC
        //////////////////////////////////////////////////////////////////////
    */

    _getTrackPosition() {
        const {
            activeSlide,
            slidesCount,
            itemsCount,
            itemWidth,
            itemsPerSlide,
            itemsPerScroll,
        } = this._params;

        if (activeSlide === 0) {
            return 0;
        }

        if (activeSlide === slidesCount - 1) {
            return -(itemsCount * itemWidth) + (itemsPerSlide * itemWidth);
        }

        return -activeSlide * (itemsPerScroll * itemWidth);
    }

    _isPrevArrowDisabled() {
        return !this._params.enableCycleNav && this._params.activeSlide === 0;
    }

    _isNextArrowDisabled() {
        return !this._params.enableCycleNav && this._params.activeSlide === this._params.slidesCount - 1;
    }

    _updateTrackPosition(position) {
        this._carouselDOM.setTranslateX(this._elements.track, position);
    }

    _updateDisabledArrows() {
        this._carouselDOM.setDisabled(this._elements.arrowPrev, this._isPrevArrowDisabled());
        this._carouselDOM.setDisabled(this._elements.arrowNext, this._isNextArrowDisabled());
    }

    _updateActiveDot() {
        this._carouselDOM.setActiveDot(this._elements.dotItems, this._params.activeSlide);
    }

    _setActiveSlide(nextActiveSlide) {
        this._params.activeSlide = nextActiveSlide;
        this._updateTrackPosition(this._getTrackPosition());
        this._updateDisabledArrows();
        this._updateActiveDot();
    }

    /*
        //////////////////////////////////////////////////////////////////////
        EVENT HANDLERS
        //////////////////////////////////////////////////////////////////////
    */

    _onPrevArrowClick = (_clearInterval = true) => {
        if (_clearInterval) {
            clearInterval(this._interval);
        }

        if (this._isPrevArrowDisabled()) {
            return;
        }

        const nextActiveSlide = this._params.activeSlide === 0
            ? this._params.slidesCount - 1
            : this._params.activeSlide - 1;
        this._setActiveSlide(nextActiveSlide);
    }

    _onNextArrowClick = (_clearInterval = true) => {
        if (_clearInterval) {
            clearInterval(this._interval);
        }

        if (this._isNextArrowDisabled()) {
            return;
        }

        const nextActiveSlide = this._params.activeSlide === this._params.slidesCount - 1
            ? 0
            : this._params.activeSlide + 1;
        this._setActiveSlide(nextActiveSlide);
    }

    _onDotClick = (dot) => {
        clearInterval(this._interval);

        const nextActiveSlide = this._elements.dotItems?.indexOf(dot);
        this._setActiveSlide(nextActiveSlide);
    }

    _initEventHandlers() {
        const { arrowPrev, arrowNext, dotsContainer } = this._elements;

        arrowPrev?.addEventListener("click", () => this._onPrevArrowClick());

        arrowNext?.addEventListener("click", () => this._onNextArrowClick());

        dotsContainer?.addEventListener("click", (event) => {
            if (!event.target.classList.contains(this._carouselDOM.getDotClassName())) {
                return;
            }

            this._onDotClick(event.target);
        });

        document.addEventListener("keydown", (event) => {
            if (!this._params.enableArrowKeysNav) {
                return;
            }

            switch (event.keyCode) {
                case 37: { // left
                    this._onPrevArrowClick();
                    break;
                }
                case 39: { // right
                    this._onNextArrowClick();
                    break;
                }
            }
        });
    }
}