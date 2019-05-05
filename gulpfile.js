// подключаем модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
/*
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
]
*/

const cssFiles = [
    './src/css/colour.sass',
    './src/css/main.sass'   
]

const jsFiles = [
    './src/js/lib.js',
    './src/js/canvas.js',
    './src/js/main.js'
]

// таск для стилей css
function styles() {
    // шаблон для поиска файлов css
    // все файлы по шаблону './src/css/**/*.css'
    return gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    // конкатенация файлов
    .pipe(concat('style.css'))
    // добавяляем префиксы
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    // минификация
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(sourcemaps.write('./'))
    // итоговая папка для стилей
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

// таск для скриптов js
function scripts() {
    // шаблон для поиска файлов js
    // все файлы по шаблону './src/js/**/*.js'
    return gulp.src(jsFiles)
    // конкатенация файлов
    .pipe(concat('script.js'))
    // минификация
    .pipe(uglify({
        toplevel: true
    }))
    // итоговая папка для скриптов
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}

function page() {
    return gulp.src('./src/index.pug')
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
}

// удалить все файлы в указанной папке
function clean() {
    return del(['build/*'])
}

// отслеживание изменения файлов
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    // следить за css файлами
    //gulp.watch('./src/css/**/*.css', styles)
    gulp.watch('./src/css/**/*.sass', styles)
    // следить за js файлами
    gulp.watch('./src/js/**/*.js', scripts)
    gulp.watch('./src/*.pug', page)
    // перезагружать браузер при изменении html файла
    gulp.watch('./src/*.pug').on('change', browserSync.reload)
}

gulp.task('pug', page);
// таск, вызывающий функцию styles
gulp.task('styles', styles);
// таск, вызывающий функцию scripts
gulp.task('scripts', scripts);
// таск, вызывающий функцию clean
gulp.task('del', clean);
// таск, вызывающий функцию watch
gulp.task('watch', watch);
// таск для удаления файлов в папке build и запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(page, styles, scripts)));

gulp.task('dev', gulp.series('build', 'watch'));