import gulp from "gulp";
import fs from "fs";
import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";
import { watcher } from "./gulp/config/watcher.js";

global.app = {
    isBuild: process.argv.includes("--build"),
    isDev: !process.argv.includes("--build"),
    gulp,
    path,
    plugins,
}

import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";
import { svgSprite } from "./gulp/tasks/svgSprite.js";
import { zip } from "./gulp/tasks/zip.js";

const getInnerFolders = () => {
    return fs.readdirSync(path.srcFolder(), { withFileTypes: true })
        .filter(item => item.isDirectory())
        .map(dir => dir.name);
}

const svgSpriteTask = () => {
    const tasks = getInnerFolders().map(folder => () => svgSprite(folder));
    return gulp.parallel(tasks);
}

const fontsTask = (folder) => gulp.series(
    () => otfToTtf(folder),
    () => ttfToWoff(folder),
    () => fontsStyle(folder),
);

const mainTask = (folder) => gulp.parallel(
    () => html(folder),
    () => scss(folder),
    () => js(folder),
    () => images(folder),
);

const folderTask = (folder) => {
    return gulp.series(fontsTask(folder), mainTask(folder));
}

const foldersTask = () => {
    const tasks = getInnerFolders().map(folder => folderTask(folder));
    return gulp.parallel(tasks);
}

const initTask = () => {
    return gulp.series(reset, () => html());
}

export const dev = gulp.series(initTask(), foldersTask(), gulp.parallel(watcher, server));
export const build = gulp.series(initTask(), foldersTask());
export const createZip = gulp.series(initTask(), foldersTask(), zip);
export const createSvgSprite = svgSpriteTask();

gulp.task('default', dev);