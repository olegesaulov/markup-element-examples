const validateCarouselParams = (options) => {
    const { autoplayDir } = options;

    const msgPrefix = 'Carousel plugin error: '

    if (!['ltr', 'rtl'].includes(autoplayDir)) {
        return `${msgPrefix}autoplayDir option value should be either "ltr" or "rtl"`;
    }
}

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

export const carousel = (options) => {
    const params = { ...defaultOptions, ...options };

    const errorMsg = validateCarouselParams(params);
    if (errorMsg) {
        throw new Error(errorMsg);
    }

    const container = document.querySelector(`.${params.prefix}`);
    const content = document.querySelector(`.${params.prefix}__content`);
    const track = document.querySelector(`.${params.prefix}__track`);
    const items = document.querySelectorAll(`.${params.prefix}__item`);

    const itemWidth = content.clientWidth / params.itemsPerSlide;
    const itemsCount = items.length;
    const slidesCount = 1 + Math.ceil((itemsCount - params.itemsPerSlide) / params.itemsPerScroll);
    let activeSlide = 0;
    let interval = null;

    const createArrows = () => {
        if (!params.showArrows || params.itemsPerSlide >= itemsCount) {
            return [];
        }

        const arrowPrev = document.createElement('button');
        arrowPrev.className = `${params.prefix}__arrow ${params.prefix}__arrow--prev`;
        content.prepend(arrowPrev);

        const arrowNext = document.createElement('button');
        arrowNext.className = `${params.prefix}__arrow ${params.prefix}__arrow--next`;
        content.append(arrowNext);

        return [arrowPrev, arrowNext];
    }

    const createDots = () => {
        if (!params.showDots || params.itemsPerSlide >= itemsCount) {
            return [];
        }

        const dotsContainer = document.createElement('div');
        dotsContainer.className = `${params.prefix}__dots`;
        container.append(dotsContainer);

        const dotItems = [];
        for (let i = 0; i < slidesCount; i++) {
            const dot = document.createElement('span');
            dot.className = `${params.prefix}__dot`;
            dotsContainer.append(dot);
            dotItems.push(dot);
        }

        return [dotsContainer, dotItems];
    }

    const [arrowPrev, arrowNext] = createArrows();
    const [dotsContainer, dotItems] = createDots();

    const getTrackPosition = () => {
        if (activeSlide === 0) {
            return 0;
        }

        if (activeSlide === slidesCount - 1) {
            return -(itemsCount * itemWidth) + (params.itemsPerSlide * itemWidth);
        }

        return -activeSlide * (params.itemsPerScroll * itemWidth);
    }

    const isLeftArrowDisabled = () => !params.enableCycleNav && activeSlide === 0;

    const isRightArrowDisabled = () => !params.enableCycleNav && activeSlide === slidesCount - 1;

    const updateTrackPositionStyle = (position) => {
        track.style.transform = `translateX(${position}px)`;
    }

    const updateArrowsStyle = () => {
        if (arrowPrev) {
            arrowPrev.disabled = isLeftArrowDisabled();
        }

        if (arrowNext) {
            arrowNext.disabled = isRightArrowDisabled();
        }
    }

    const updateDotsStyle = () => {
        if (!dotItems) {
            return;
        }

        const activeClass = `${params.prefix}__dot--active`;
        dotItems.forEach(dot => dot.classList.remove(activeClass));
        dotItems[activeSlide].classList.add(activeClass);
    }

    const setActiveSlide = (nextActiveSlide) => {
        activeSlide = nextActiveSlide;
        updateTrackPositionStyle(getTrackPosition());
        updateArrowsStyle();
        updateDotsStyle();
    }

    const onPrevArrowClicked = (_clearInterval = true) => {
        if (_clearInterval) {
            clearInterval(interval);
        }

        if (isLeftArrowDisabled()) {
            return;
        }

        const nextActiveSlide = activeSlide === 0 ? slidesCount - 1 : activeSlide - 1;
        setActiveSlide(nextActiveSlide);
    }

    const onNextArrowClicked = (_clearInterval = true) => {
        if (_clearInterval) {
            clearInterval(interval);
        }

        if (isRightArrowDisabled()) {
            return;
        }

        const nextActiveSlide = activeSlide === slidesCount - 1 ? 0 : activeSlide + 1;
        setActiveSlide(nextActiveSlide);
    }

    const onDotClicked = (dot) => {
        clearInterval(interval);
        const nextActiveSlide = dotItems?.indexOf(dot);
        setActiveSlide(nextActiveSlide);
    }

    arrowPrev?.addEventListener("click", () => onPrevArrowClicked());

    arrowNext?.addEventListener("click", () => onNextArrowClicked());

    dotsContainer?.addEventListener("click", (event) => {
        if (!event.target.classList.contains(`${params.prefix}__dot`)) {
            return;
        }

        onDotClicked(event.target);
    });

    document.addEventListener("keydown", (event) => {
        if (!params.enableArrowKeysNav) {
            return;
        }

        switch (event.keyCode) {
            case 37: { // left
                onPrevArrowClicked();
                break;
            };
            case 39: { // right
                onNextArrowClicked();
                break;
            }
        }
    });

    const init = () => {
        items.forEach(item => {
            item.style.minWidth = `${itemWidth}px`;
        });

        const nextActiveSlide = params.initialSlide >= slidesCount ? slidesCount - 1 : params.initialSlide;
        setActiveSlide(nextActiveSlide);

        if (params.enableAutoplay) {
            const intervalFunc = params.autoplayDir === 'ltr' ? onNextArrowClicked : onPrevArrowClicked;
            interval = setInterval(() => intervalFunc(false), params.autoplaySpeed);
        }
    }

    init();
};