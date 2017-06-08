'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const del = require('del');

/**
 * Compile SASS
 */
gulp.task('sass', function() {
    return gulp.src('30-gulp/frontend/**/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('30-gulp/public/css'))
});

/**
 * Concat all app files
 */
gulp.task('concat:js', function () {
    return gulp
        .src('30-gulp/frontend/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('30-gulp/public/js'));
});

/**
 * Puild project
 */
gulp.task('build', ['clean', 'sass', 'concat:js', 'assets']);

/**
 * Copy files in public dir
 */
gulp.task('assets', function () {
    return gulp
        .src('./vendor/bootstrap-sass/assets/fonts/bootstrap/**/*.*')
        .pipe(debug({title: 'src'}))
        .pipe(gulp.dest('30-gulp/public/fonts'));
});

/**
 * Clean public
 */
gulp.task('clean', function () {
    return del('30-gulp/public');
});
