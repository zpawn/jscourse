'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');

/**
 * Compile SASS
 */
gulp.task('sass', function() {
    return gulp.src('30-gulp/frontend/**/app.scss')
//        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
//        .pipe(sourcemaps.write())   // add sourceMap in same file
//        .pipe(sourcemaps.write('.'))   // add sourceMap in single file
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
 * Concat app and compile SASS
 */
gulp.task('build', ['sass', 'concat:js']);