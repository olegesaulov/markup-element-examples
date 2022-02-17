import { Carousel } from "./carousel/index.js";

const carousel = new Carousel({
    itemsPerSlide: 3,
    itemsPerScroll: 2,
});
carousel.init();