const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');

gulp.task('css', () => {
    return gulp.src('src/scss/parallaxo.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('minifiedCss', () => {
    return gulp.src('src/scss/parallaxo.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', () => {
    return gulp.src('src/js/parallaxo.js')
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('minifiedJs', () => {
    return gulp.src('src/js/parallaxo.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('clean', () => {
    return del([
        'dist/**',
    ]);
});

gulp.task('default', gulp.series(['clean', 'css', 'minifiedCss', 'js', 'minifiedJs']));