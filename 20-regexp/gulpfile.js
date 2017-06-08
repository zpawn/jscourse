'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');


exports.build20Js = function () {
    var src = [
        './20-regexp/js/validate.js',
        './20-regexp/js/FormHandler.js',
        './20-regexp/js/app.js'
    ];
    var dest = './20-regexp/dist/.';

    return gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest));
};

exports.build20Css = function () {
    var src = [
        './20-regexp/css/bootstrap.min.css',
        './20-regexp/css/main.css'
    ];
    var dest = './20-regexp/dist/.';

    return gulp.src(src)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(dest));
};
