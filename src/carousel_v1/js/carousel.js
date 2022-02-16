export const carousel = (options) => {
    const {
        itemsPerSlide = 1,
        itemsPerScroll = 1,
        initialSlide = 0,
        prefix = "carousel",
        showArrows = true,
        showDots = true,
        enableArrowKeysNavigaiton = true,
    } = options;

    const container = document.querySelector(`.${prefix}`);
    const content = document.querySelector(`.${prefix}__content`);
    const track = document.querySelector(`.${prefix}__track`);
    const items = document.querySelectorAll(`.${prefix}__item`);

    const itemWidth = content.clientWidth / itemsPerSlide;
    const itemsCount = items.length;
    const slidesCount = 1 + Math.ceil((itemsCount - itemsPerSlide) / itemsPerScroll);
    let activeSlide = 0;

    const createArrows = () => {
        if (!showArrows || itemsPerSlide >= itemsCount) {
            return [];
        }

        const arrowPrev = document.createElement('button');
        arrowPrev.className = `${prefix}__arrow ${prefix}__arrow--prev`;
        content.prepend(arrowPrev);

        const arrowNext = document.createElement('button');
        arrowNext.className = `${prefix}__arrow ${prefix}__arrow--next`;
        content.append(arrowNext);

        return [arrowPrev, arrowNext];
    }

    const createDots = () => {
        if (!showDots || itemsPerSlide >= itemsCount) {
            return [];
        }

        const dotsContainer = document.createElement('div');
        dotsContainer.className = `${prefix}__dots`;
        container.append(dotsContainer);

        const dotItems = [];
        for (let i = 0; i < slidesCount; i++) {
            const dot = document.createElement('span');
            dot.className = `${prefix}__dot`;
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
            return -(itemsCount * itemWidth) + (itemsPerSlide * itemWidth);
        }

        return -activeSlide * (itemsPerScroll * itemWidth);
    }

    const isLeftArrowDisabled = () => activeSlide === 0;

    const isRightArrowDisabled = () => activeSlide === slidesCount - 1;

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

        const activeClass = `${prefix}__dot--active`;
        dotItems.forEach(dot => dot.classList.remove(activeClass));
        dotItems[activeSlide].classList.add(activeClass);
    }

    const onActiveSlideChanged = () => {
        updateTrackPositionStyle(getTrackPosition());
        updateArrowsStyle();
        updateDotsStyle();
    }

    const onPrevArrowClicked = () => {
        if (!isLeftArrowDisabled()) {
            activeSlide -= 1;
            onActiveSlideChanged();
        }
    }

    const onNextArrowClicked = () => {
        if (!isRightArrowDisabled()) {
            activeSlide += 1;
            onActiveSlideChanged();
        }
    }

    arrowPrev?.addEventListener("click", onPrevArrowClicked);

    arrowNext?.addEventListener("click", onNextArrowClicked);

    dotsContainer?.addEventListener("click", (event) => {
        if (!event.target.classList.contains(`${prefix}__dot`)) {
            return;
        }

        activeSlide = dotItems?.indexOf(event.target);
        onActiveSlideChanged();
    });

    document.addEventListener("keydown", (event) => {
        if (!enableArrowKeysNavigaiton) {
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

        activeSlide = initialSlide >= slidesCount ? slidesCount - 1 : initialSlide;
        onActiveSlideChanged();
    }

    init();
};