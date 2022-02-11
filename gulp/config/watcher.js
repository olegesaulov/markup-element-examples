import gulp from "gulp";
import { html } from "../tasks/html.js";
import { scss } from "../tasks/scss.js";
import { js } from "../tasks/js.js";
import { images } from "../tasks/images.js";
import { path } from "./path.js";

const getFolderName = (path) => {
    const pathNames = path.split("\\");
    return pathNames.length > 2 ? pathNames[1] : undefined;
}

const htmlWatcherHandler = (event, path) => html(getFolderName(path));
const scssWatcherHandler = (event, path) => scss(getFolderName(path));
const jsWatcherHandler = (event, path) => js(getFolderName(path));
const imagesWatcherHandler = (event, path) => images(getFolderName(path));

export const watcher = () => {
    gulp.watch(path.watch.html).on("all", htmlWatcherHandler);
    gulp.watch(path.watch.scss).on("all", scssWatcherHandler);
    gulp.watch(path.watch.js).on("all", jsWatcherHandler);
    gulp.watch(path.watch.images).on("all", imagesWatcherHandler);
}