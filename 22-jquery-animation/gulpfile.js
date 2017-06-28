'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

exports.build22Js = function () {
    var src = [
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/jquery.easing.1.3/index.js',
        './22-jquery-animation/task/js/Slider.js',
        './22-jquery-animation/task/js/app.js'
    ];
    var dest = './22-jquery-animation/task/dist/.';

    return gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(concat('slider.js'))
        .on('error', function(e) {
            console.log('>>> ERROR', e.message);
            this.emit('end');
        })
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest));
};

exports.build22Scss = function () {
    var src = ['./22-jquery-animation/task/sass/slider.scss'];
    var dest = './22-jquery-animation/task/dist/.';

    return gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest));
};
