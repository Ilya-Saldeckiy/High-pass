const { src, dest, series, watch } = require('gulp');
const concat =require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autopreFixes = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass')(require('sass'));
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const notify = require("gulp-notify");
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browsersync = require('browser-sync').create();
const resurses = () => {
    return src('src/resurses/**')
    .pipe(dest('build'))
    .pipe(dest('dev'))
}

const clean = () => {
    return del(['build'])
}

const styles = () => {
    return src('src/styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autopreFixes({
            cascade: false,
        }))
        .pipe(sourcemaps.write())
        .pipe(dest('dev'))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest('build'))
        .pipe(browsersync.stream())
}

const htmlMinify = () => {
    return src('src/**/*.html')
        .pipe(dest('dev'))
        .pipe(htmlMin({
            collapseWhitespace: true,
        }))
        .pipe(dest('build'))
        .pipe(browsersync.stream())
}

const svgSprites = () => {
    return src('src/images/svg/**/*.svg')
        .pipe(svgSprite({
            mode: {
                stack:{
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest('build/images'))
        .pipe(dest('dev/images'))
}

const watchFiles = () => {
    browsersync.init({
        server: {
            baseDir: 'build'
        }
    })
}

const images = () => {
    return src([
        'src/images/**/*.jpg',
        'src/images/**/*.png',
        'src/images/*.svg',
        'src/images/**/*.jpeg',
    ])
        .pipe(image())
        .pipe(dest('build/images'))
        .pipe(dest('dev/images'))
}

const scripts = () => {
    return src([
        'src/js/components/**/*.js',
        'src/js/main.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(dest('dev'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify().on('error',notify.onError()))
    .pipe(dest('build'))
    .pipe(browsersync.stream())
}

watch('src/**/*.html', htmlMinify);
watch('src/styles/**/*.scss', styles);
watch('src/images/svg/**/*.svg', svgSprites);
watch('src/js/**/*.js', scripts);
watch('src/resurses/**', resurses);

exports.styles = styles;
exports.scripts = scripts;
exports.htmlMinify = htmlMinify;
exports.default = series(clean ,htmlMinify, resurses , styles, svgSprites, images, scripts, watchFiles);