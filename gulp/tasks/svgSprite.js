import svg_sprite from "gulp-svg-sprite";

export const svgSprite = (folder) => {
    return app.gulp.src(app.path.src.svgicons(folder), {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "SVG",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(svg_sprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg",
                    example: true,
                }
            }
        }))
        .pipe(app.gulp.dest(app.path.build.images(folder)));
}