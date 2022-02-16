export const carousel = (options) => {
    const {
        itemsPerSlide = 1,
        itemsPerScroll = 1,
        initialSlideIndex = 0,
        prefix = "carousel",
    } = options;

    const container = document.querySelector(`.${prefix}`);
    const content = document.querySelector(`.${prefix}__content`);
    const track = document.querySelector(`.${prefix}__track`);
    const items = document.querySelectorAll(`.${prefix}__item`);

    const itemWidth = content.clientWidth / itemsPerSlide;
    const itemsCount = items.length;
    const slidesCount = 1 + Math.ceil((itemsCount - itemsPerSlide) / itemsPerScroll);
    let activeSlideIndex = initialSlideIndex >= slidesCount ? slidesCount - 1 : initialSlideIndex;

    const createArrows = () => {
        const arrowPrev = document.createElement('button');
        const arrowNext = document.createElement('button');
        arrowPrev.className = `${prefix}__arrow ${prefix}__arrow--prev`;
        arrowNext.className = `${prefix}__arrow ${prefix}__arrow--next`;
        content.prepend(arrowPrev);
        content.append(arrowNext);

        return [arrowPrev, arrowNext];
    }

    const createDots = () => {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = `${prefix}__dots`;
        container.append(dotsContainer);

        if (itemsPerSlide >= itemsCount) {
            return;
        }

        if (itemsPerScroll > itemsPerSlide) {
            return;
        }

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
        if (activeSlideIndex === 0) {
            return 0;
        }

        if (activeSlideIndex === slidesCount - 1) {
            return -(itemsCount * itemWidth) + itemsPerSlide * itemWidth;
        }

        return -(activeSlideIndex) * itemsPerScroll * itemWidth;
    }

    const setItemsWidthStyle = () => {
        items.forEach(item => {
            item.style.minWidth = `${itemWidth}px`;
        });
    }

    const setTrackPositionStyle = (position) => {
        track.style.transform = `translateX(${position}px)`;
    }

    const setArrowsDisabledStyle = () => {
        arrowPrev.disabled = activeSlideIndex === 0;
        arrowNext.disabled = activeSlideIndex === slidesCount - 1;
    }

    const setActiveDotStyle = () => {
        dotItems.forEach(dot => dot.classList.remove(`${prefix}__dot--active`));
        dotItems[activeSlideIndex].classList.add(`${prefix}__dot--active`);
    }

    arrowPrev.addEventListener("click", () => {
        activeSlideIndex -= 1;
        setTrackPositionStyle(getTrackPosition());
        setArrowsDisabledStyle();
        setActiveDotStyle();
    });

    arrowNext.addEventListener("click", () => {
        activeSlideIndex += 1;
        setTrackPositionStyle(getTrackPosition());
        setArrowsDisabledStyle();
        setActiveDotStyle();
    });

    dotsContainer.addEventListener("click", (event) => {
        if (!event.target.classList.contains(`${prefix}__dot`)) {
            return;
        }

        activeSlideIndex = dotItems.indexOf(event.target);
        setTrackPositionStyle(getTrackPosition());
        setArrowsDisabledStyle();
        setActiveDotStyle();
    });

    setItemsWidthStyle();

    setTrackPositionStyle(getTrackPosition());
    setArrowsDisabledStyle();
    setActiveDotStyle();
};