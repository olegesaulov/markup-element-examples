import * as nodePath from 'path';

const rootFolder = nodePath.basename(nodePath.resolve());
const buildFolder = './dist';
const srcFolder = './src';
const imgExtWoSvg = ['jpg', 'jpeg', 'png', 'gif', 'ico', 'webp'];

const makeFullBuildPath = (childFolder) => `${buildFolder}${childFolder ? `/${childFolder}` : ''}`;
const makeFullSrcPath = (childFolder) => `${srcFolder}${childFolder ? `/${childFolder}` : ''}`;

export const path = {
    build: {
        html: (childFolder) => `${makeFullBuildPath(childFolder)}/`,
        css: (childFolder) => `${makeFullBuildPath(childFolder)}/css/`,
        fonts: (childFolder) => `${makeFullBuildPath(childFolder)}/fonts/`,
        images: (childFolder) => `${makeFullBuildPath(childFolder)}/img/`,
        js: (childFolder) => `${makeFullBuildPath(childFolder)}/js/`,
    },
    src: {
        html: (childFolder) => `${makeFullSrcPath(childFolder)}/*.html`,
        scss: (childFolder) => `${makeFullSrcPath(childFolder)}/scss/style.scss`,
        images: (childFolder) => `${makeFullSrcPath(childFolder)}/img/**/*.{${imgExtWoSvg.join(",")}}`,
        svg: (childFolder) => `${makeFullSrcPath(childFolder)}/img/**/*.svg`,
        svgicons: (childFolder) => `${makeFullSrcPath(childFolder)}/svgicons/*.svg`,
        js: (childFolder) => `${makeFullSrcPath(childFolder)}/js/app.js`,
    },
    watch: {
        html: `${makeFullSrcPath("**")}/*.html`,
        scss: `${makeFullSrcPath("*")}/scss/**/*.scss`,
        images: `${makeFullSrcPath("*")}/img/**/*.{${[...imgExtWoSvg, "svg"].join(",")}}`,
        js: `${makeFullSrcPath("*")}/js/**/*.js`,
    },
    clean: buildFolder,
    buildFolder,
    srcFolder: (childFolder) => makeFullSrcPath(childFolder),
    rootFolder,
}