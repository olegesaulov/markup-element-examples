import { AUTOPLAY_DIRS, DISTANCE_TO_SWIPE } from "./constant.js";

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
        distanceToSwipe,
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

    if (!Object.values(AUTOPLAY_DIRS).includes(autoplayDir)) {
        return makeMsg(`autoplayDir value should be one of [${Object.values(AUTOPLAY_DIRS).join(", ")}]`);
    }

    if (!Object.values(DISTANCE_TO_SWIPE).includes(distanceToSwipe)) {
        return makeMsg(`distanceToSwipe value should be one of [${Object.values(DISTANCE_TO_SWIPE).join(", ")}]`);
    }
}

export const validateUpdatedParams = (prevOptions, nextOptions) => {
    const errorMsg = validateParams(nextOptions);

    if (errorMsg) {
        return errorMsg;
    }

    if (prevOptions.prefix !== nextOptions.prefix) {
        return makeMsg("prefix value could not be updated");
    }
}