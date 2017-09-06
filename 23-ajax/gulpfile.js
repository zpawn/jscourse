'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

exports.build23Js = function () {
    var src = [
        './23-ajax/task/js/validate.js',
        './23-ajax/task/js/FormHandler.js',
        './23-ajax/task/js/app.js'
    ];
    var dest = './23-ajax/task/dist/.';

    return gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest));
};

exports.build23Css = function () {
    var src = [
        './23-ajax/task/css/bootstrap.min.css',
        './23-ajax/task/css/main.css'
    ];
    var dest = './23-ajax/task/dist/.';

    return gulp.src(src)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(dest));
};
