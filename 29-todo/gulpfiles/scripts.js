'use strict';

const gulp = require('gulp'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),

    gulpif = require('gulp-if'),
    arg = require('yargs')
        .alias('d', 'dev')
        .argv,

    config = {
        app: {
            src: [
                './29-todo/public/src/js/core/**/*.js',
                './29-todo/public/src/js/*.class.js',
                './29-todo/public/src/js/*.js',
                './29-todo/public/src/js/app.js'
            ],
            destFile: 'tag.manager.js',
            dest: './29-todo/public/dist/js/.'
        },

        dep: {
            src: [
                './bower_components/jquery/dist/jquery.js',
                './bower_components/popper.js/dist/umd/popper.js',
                './bower_components/bootstrap/dist/js/bootstrap.js',
                './node_modules/lodash/lodash.js',
                './bower_components/anypicker/dist/anypicker.min.js'
            ],
            destFile: 'dep.js',
            dest: './29-todo/public/dist/js/.'
        },

        sourcemaps: {
            loadMaps: true,
            largeFile: true
        },
        plumber: {
            errorHandler: notify.onError((err) => {
                return {
                    title: 'JavaScript',
                    message: err.message
                }
            })
        },
    },

    tasks = {
        dependencies: dependencies,
        js: js,
        jsWatch: jsWatch
    };

module.exports = tasks;

function js () {
    return gulp.src(config.app.src)
        .pipe(plumber(config.plumber))
        .pipe(
            gulpif(arg.dev, sourcemaps.init(config.sourcemaps))
        )
        .pipe(rename({
            dirname: ''
        }))
        .pipe(babel())
        .pipe(concat(config.app.destFile))
        .pipe(
            gulpif(arg.dev, sourcemaps.write())
        )
        .pipe(
            gulpif(!arg.dev, uglify())
        )
        .pipe(gulp.dest(config.app.dest))
}

function jsWatch () {
    arg.dev = true;
    return js();
}

function dependencies () {
    return gulp
        .src(config.dep.src)
        .pipe(
            gulpif(arg.dev, sourcemaps.init(config.sourcemaps))
        )
        .pipe(rename({
            dirname: ''
        }))
        .pipe(concat(config.dep.destFile))
        .pipe(
            gulpif(arg.dev, sourcemaps.write())
        )
        .pipe(
            gulpif(!arg.dev, uglify())
        )
        .pipe(gulp.dest(config.dep.dest))
}