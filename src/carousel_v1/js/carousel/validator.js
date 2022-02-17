const makeMsg = (msgContent, msgPrefix = 'Carousel plugin error: ') => {
    return `${msgPrefix}${msgContent}`;
}

export const validateParams = (options) => {
    const {
        itemsPerSlide,
        itemsPerScroll,
        initialSlide,
        autoplaySpeed,
        autoplayDir,
    } = options;

    if (itemsPerSlide <= 0) {
        return makeMsg("itemsPerSlide value should be greater than 0");
    }

    if (itemsPerScroll <= 0) {
        return makeMsg("itemsPerScroll value should be greater than 0");
    }

    if (initialSlide < 0) {
        return makeMsg("initialSlide value should be greater or equal to 0");
    }

    if (autoplaySpeed <= 0) {
        return makeMsg("autoplaySpeed value should be greater than 0");
    }

    if (!['ltr', 'rtl'].includes(autoplayDir)) {
        return makeMsg("autoplayDir value should be either \"ltr\" or \"rtl\"");
    }
}