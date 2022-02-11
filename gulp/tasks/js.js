import webpack from "webpack-stream";

export const js = (folder) => {
    return app.gulp.src(app.path.src.js(folder), { sourcemaps: app.isDev })
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "JS",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(webpack({
            mode: app.isBuild ? "production" : "development",
            output: {
                filename: "app.min.js",
            }
        }))
        .pipe(app.gulp.dest(app.path.build.js(folder)))
        .pipe(app.plugins.browsersync.stream());
}