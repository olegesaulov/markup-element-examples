export const carousel = (options) => {
    const {
        itemsPerSlide = 1,
        itemsPerScroll = 1,
        initialSlide = 1,
        prefix = "carousel",
    } = options;

    const container = document.querySelector(`.${prefix}`);
    const content = document.querySelector(`.${prefix}__content`);
    const track = document.querySelector(`.${prefix}__track`);
    const items = document.querySelectorAll(`.${prefix}__item`);

    const itemWidth = content.clientWidth / itemsPerSlide;
    const itemsCount = items.length;
    const slideCount = 1 + Math.ceil((itemsCount - itemsPerSlide) / itemsPerScroll);
    let trackPosition = 0;

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
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('span');
            dot.className = `${prefix}__dot`;
            dotsContainer.append(dot);
            dotItems.push(dot);
        }

        return [dotsContainer, dotItems];
    }

    const [arrowPrev, arrowNext] = createArrows();
    const [dotsContainer, dotItems] = createDots();

    const getActiveSlideIndex = (currentPosition) => {
        return
    }

    const getTrackPositionShift = (itemsLeft) => {
        return itemsLeft >= itemsPerScroll
            ? itemsPerScroll * itemWidth
            : itemsLeft * itemWidth;
    }

    const getShownItemsCount = (currentPosition) => {
        return (Math.abs(currentPosition) + itemsPerSlide * itemWidth) / itemWidth;
    }

    const handleDotClick = (index) => {

    }

    const setItemsWidthStyle = () => {
        items.forEach(item => {
            item.style.minWidth = `${itemWidth}px`;
        });
    }

    const setTrackPositionStyle = () => {
        track.style.transform = `translateX(${trackPosition}px)`;
    }

    const setArrowsDisabledStyle = () => {
        arrowPrev.disabled = trackPosition === 0;
        arrowNext.disabled = trackPosition <= -(itemsCount - itemsPerSlide) * itemWidth;
    }

    arrowPrev.addEventListener("click", () => {
        const itemsLeft = Math.abs(trackPosition) / itemWidth;
        trackPosition += getTrackPositionShift(itemsLeft);
        setTrackPositionStyle();
        setArrowsDisabledStyle();
    });

    arrowNext.addEventListener("click", () => {
        const itemsShown = getShownItemsCount(trackPosition);
        const itemsLeft = itemsCount - itemsShown;
        trackPosition -= getTrackPositionShift(itemsLeft);
        setTrackPositionStyle();
        setArrowsDisabledStyle();
    });

    dotsContainer.addEventListener("click", (event) => {
        if (!event.target.classList.contains(`${prefix}__dot`)) {
            return;
        }


    })

    setItemsWidthStyle();
    setArrowsDisabledStyle();
};