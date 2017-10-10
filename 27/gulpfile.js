'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),

    config = {
        sass: {
            src: [
                './27/task/css/styles.scss'
            ],
            dest: './27/task/.'
        },
        js: {
            src: [
                './bower_components/jquery/dist/jquery.js',
                './bower_components/popper.js/dist/umd/popper.js',
                './bower_components/bootstrap/dist/js/bootstrap.js',
                './27/task/js/TagManager.js',
                './27/task/js/app.js'
            ],
            dest: './27/task/.'
        }
    };

exports.build27Scss = function () {
    return gulp.src(config.sass.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.sass.dest));
};

exports.build27Js = function () {
    return gulp.src(config.js.src)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .on('error', function(e) {
            console.log('>>> ERROR', e.message);
            this.emit('end');
        })
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.js.dest));
};
