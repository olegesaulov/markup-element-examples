import { AUTOPLAY_DIRS, DISTANCE_TO_SWIPE } from "./constant.js";
import { validateParams, validateUpdatedParams } from "./validator.js";
import { CarouselDOM } from "./DOM.js";

const defaultOptions = {
    prefix: "carousel",
    initialSlide: 0,
    itemsPerSlide: 1,
    itemsPerScroll: 1,
    showArrows: true,
    showDots: true,
    enableArrowKeysNav: true,
    enableCycleNav: true,
    enableAutoplay: true,
    autoplaySpeed: 3000,
    autoplayDir: AUTOPLAY_DIRS.LTR,
    enableSwipe: true,
    distanceToSwipe: DISTANCE_TO_SWIPE.LG,
};

export class Carousel {
    constructor(options) {
        const params = { ...defaultOptions, ...options };

        const errorMsg = validateParams(params);
        if (errorMsg) {
            throw new Error(errorMsg);
        }

        this._params = params;
        this._carouselDOM = new CarouselDOM(this._params.prefix);
        this._elements = this._carouselDOM.findMainCarouselElements();
        this._update();
    }

    updateParams(options) {
        const nextParams = { ...this._params, ...options };

        const errorMsg = validateUpdatedParams(this._params, nextParams);
        if (errorMsg) {
            throw new Error(errorMsg);
        }

        this._params = nextParams;
        this._update();
    }

    _update() {
        const updateUI = () => {
            const remakeArrows = () => {
                const { showArrows, itemsPerSlide, itemsCount } = this._params;

                this._carouselDOM.removeItems([this._elements.arrowPrev, this._elements.arrowNext]);

                if (!showArrows || itemsPerSlide >= itemsCount) {
                    return [];
                }

                return this._carouselDOM.createArrows(this._elements.content);
            }

            const remakeDots = () => {
                const { showDots, itemsPerSlide, itemsCount, slidesCount } = this._params;

                this._carouselDOM.removeItems([this._elements.dotsContainer]);

                if (!showDots || itemsPerSlide >= itemsCount) {
                    return [];
                }

                return this._carouselDOM.createDots(this._elements.container, slidesCount);
            }

            this._elements = {
                ...this._elements,
                ...remakeArrows(),
                ...remakeDots(),
            };
            this._carouselDOM.setMinWidth(this._elements.items, this._params.itemWidth);
            this._setInitialSlide();
        }

        this._recalcAdditionalParams();
        updateUI();
        this._setUpAutoplay();
        this._initEventHandlers();
    }

    /*
        //////////////////////////////////////////////////////////////////////
        MAIN LOGIC
        //////////////////////////////////////////////////////////////////////
    */

    _recalcAdditionalParams() {
        const calcDistanceToSwipePX = (slideWidth) => {
            const { distanceToSwipe } = this._params;

            switch (distanceToSwipe) {
                case DISTANCE_TO_SWIPE.XXXS:
                    return slideWidth / 100; // 1%
                case DISTANCE_TO_SWIPE.XXS:
                    return slideWidth / 50; // 2%
                case DISTANCE_TO_SWIPE.XS:
                    return slideWidth / 33.333; // 3%
                case DISTANCE_TO_SWIPE.SM:
                    return slideWidth / 20; // 5%
                case DISTANCE_TO_SWIPE.MD:
                    return slideWidth / 13.333; // 7.5%
                case DISTANCE_TO_SWIPE.LG:
                    return slideWidth / 10; // 10%
                case DISTANCE_TO_SWIPE.XL:
                    return slideWidth / 5; // 20%
                case DISTANCE_TO_SWIPE.XXL:
                    return slideWidth / 4; // 25%
                case DISTANCE_TO_SWIPE.XXXL:
                    return slideWidth / 3; // 33%
                default:
                    return;
            }
        }

        this._params = {
            ...this._params,
            activeSlide: 0,
            itemWidth: this._getItemWidth(),
            itemsCount: this._elements.items.length,
            slidesCount: 1 + Math.ceil(
                (this._elements.items.length - this._params.itemsPerSlide) / this._params.itemsPerScroll
            ),
            distanceToSwipePX: calcDistanceToSwipePX(this._getItemWidth() * this._params.itemsPerSlide),
        };
    }

    _getItemWidth() {
        return this._elements.content.clientWidth / this._params.itemsPerSlide;
    }

    _getTrackPosition() {
        const {
            activeSlide,
            slidesCount,
            itemsCount,
            itemWidth,
            itemsPerScroll,
        } = this._params;

        if (activeSlide === 0) {
            return 0;
        }

        if (activeSlide === slidesCount - 1) {
            return -(itemsCount * itemWidth) + this._elements.content.clientWidth;
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

    _setInitialSlide() {
        const { initialSlide, slidesCount } = this._params;

        const nextActiveSlide = initialSlide >= slidesCount ? slidesCount - 1 : initialSlide;
        this._setActiveSlide(nextActiveSlide);
    }

    _setUpAutoplay() {
        clearInterval(this._interval);

        if (!this._params.enableAutoplay) {
            return;
        }

        const autoplayFunc = this._params.autoplayDir === AUTOPLAY_DIRS.LTR
            ? this._onNextArrowClick
            : this._onPrevArrowClick;
        this._interval = setInterval(() => autoplayFunc(false), this._params.autoplaySpeed);
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

    _onKeydown = (event) => {
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
    }

    _onResize = (event) => {
        const updateItemsWidth = () => {
            this._params.itemWidth = this._getItemWidth();
            this._carouselDOM.setMinWidth(this._elements.items, this._params.itemWidth);
        }

        updateItemsWidth();
        this._updateTrackPosition(this._getTrackPosition());
    }

    _onTrackPointerDown = (event) => {
        event.preventDefault(); // prevent selection start (browser action)
        this._params.clientXSlideChanged = event.clientX;
        this._elements.track.setPointerCapture(event.pointerId);
    }

    _onTrackPointerMove = (event) => {
        const { clientXSlideChanged, distanceToSwipePX } = this._params;

        if (clientXSlideChanged === undefined || clientXSlideChanged === null) {
            return;
        }

        if (clientXSlideChanged - event.clientX <= -distanceToSwipePX) {
            this._params.clientXSlideChanged = event.clientX;
            this._onPrevArrowClick();
        }

        if (clientXSlideChanged - event.clientX >= distanceToSwipePX) {
            this._params.clientXSlideChanged = event.clientX;
            this._onNextArrowClick();
        }
    }

    _onTrackPointerUp = (event) => {
        this._params.clientXSlideChanged = null;
    }

    _initEventHandlers() {
        const { arrowPrev, arrowNext, dotsContainer, track } = this._elements;

        arrowPrev?.addEventListener("click", () => this._onPrevArrowClick());

        arrowNext?.addEventListener("click", () => this._onNextArrowClick());

        dotsContainer?.addEventListener("click", (event) => {
            if (!event.target.classList.contains(this._carouselDOM.getDotClassName())) {
                return;
            }

            this._onDotClick(event.target);
        });

        if (this._params.enableSwipe) {
            track.ondragstart = () => false; // prevent drag&drop start (browser action)
            track.onpointerdown = this._onTrackPointerDown;
            track.onpointermove = this._onTrackPointerMove;
            track.onpointerup = this._onTrackPointerUp;
        } else {
            track.ondragstart = () => { };
            track.onpointerdown = () => { };
            track.onpointermove = () => { };
            track.onpointerup = () => { };
        }

        document.removeEventListener("keydown", this._onKeydown);
        document.addEventListener("keydown", this._onKeydown);

        window.removeEventListener("resize", this._onResize);
        window.addEventListener("resize", this._onResize);
    }
}