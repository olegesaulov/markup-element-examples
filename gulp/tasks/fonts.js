import fs from "fs";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";

export const otfToTtf = (folder) => {
    return app.gulp.src(`${app.path.srcFolder(folder)}/fonts/*.otf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(fonter({
            formats: ["ttf"]
        }))
        .pipe(app.gulp.dest(`${app.path.srcFolder(folder)}/fonts/`))
}

export const ttfToWoff = (folder) => {
    return app.gulp.src(`${app.path.srcFolder(folder)}/fonts/*.ttf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(fonter({
            formats: ["woff"]
        }))
        .pipe(app.gulp.dest(`${app.path.build.fonts(folder)}`))
        .pipe(app.gulp.src(`${app.path.srcFolder(folder)}/fonts/*.ttf`))
        .pipe(ttf2woff2())
        .pipe(app.gulp.dest(`${app.path.build.fonts(folder)}`));
}

export const fontsStyle = (folder) => {
    let srcFontsFile = `${app.path.srcFolder(folder)}/scss/fonts.scss`;

    fs.readdir(app.path.build.fonts(folder), function (err, buildFontsFiles) {
        if (!buildFontsFiles) {
            return;
        }

        if (fs.existsSync(srcFontsFile)) {
            console.log('Файл scss/fonts.scss уже существует. Для обновления файла его нужно удалить');
            return;
        }

        fs.writeFile(srcFontsFile, "", cb);
        let newFileOnly;
        for (let i = 0; i < buildFontsFiles.length; i++) {
            let buildFontFileName = buildFontsFiles[i].split(".")[0];
            if (newFileOnly !== buildFontFileName) {
                let fontName = buildFontFileName.split("-")[0] ? buildFontFileName.split("-")[0] : buildFontFileName;
                let fontWeight = buildFontFileName.split("-")[1] ? buildFontFileName.split("-")[1] : buildFontFileName;

                if (fontWeight.toLowerCase() === 'thin') {
                    fontWeight = 100;
                } else if (fontWeight.toLowerCase() === 'extralight') {
                    fontWeight = 200;
                } else if (fontWeight.toLowerCase() === 'light') {
                    fontWeight = 300;
                } else if (fontWeight.toLowerCase() === 'medium') {
                    fontWeight = 500;
                } else if (fontWeight.toLowerCase() === 'semibold') {
                    fontWeight = 600;
                } else if (fontWeight.toLowerCase() === 'bold') {
                    fontWeight = 700;
                } else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
                    fontWeight = 800;
                } else if (fontWeight.toLowerCase() === 'black') {
                    fontWeight = 900;
                } else {
                    fontWeight = 400;
                }

                fs.appendFile(srcFontsFile,
                    `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${buildFontFileName}.woff2") format("woff2"), url("../fonts/${buildFontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb
                );
                newFileOnly = buildFontFileName;
            }
        }
    });

    return app.gulp.src(`${app.path.srcFolder(folder)}`);
    function cb() { }
}