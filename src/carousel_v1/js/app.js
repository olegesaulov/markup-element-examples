import { Carousel } from "./carousel/index.js";

const carousel = new Carousel({
    itemsPerSlide: 3,
    itemsPerScroll: 2,
});

// setTimeout(() => {
//     carousel.updateParams({
//         itemsPerSlide: 1,
//         itemsPerScroll: 1,
//     })
// }, 6000);