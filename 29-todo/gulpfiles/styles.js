'use strict';

const gulp = require('gulp'),
    gulpSass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),

    gulpif = require('gulp-if'),
    arg = require('yargs')
        .alias('d', 'dev')
        .argv,

    config = {
        src: [
            './29-todo/public/src/scss/tag.manager.scss'
        ],
        dest: './29-todo/public/dist/css/.',
        csso: {
            comments: false,
            sourceMap: false
        },
        autoprefixer: {
            browsers: [
                "last 2 versions"
            ]
        },
        fonts: {
            src: [
                './bower_components/dripicons/webfont/fonts/*.*'
            ],
            dest: './29-todo/public/dist/css/fonts/.'
        }
    },

    tasks = {
        sass: sass,
        sassWatch: sassWatch,
        fonts: fonts
    };

module.exports = tasks;

function sass () {
    return gulp.src(config.src)
        .pipe(
            gulpif(arg.dev, sourcemaps.init())
        )
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(
            gulpif(arg.dev, sourcemaps.write())
        )
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(
            gulpif(!arg.dev, csso(config.csso))
        )
        .pipe(gulp.dest(config.dest));
}

function sassWatch () {
    arg.dev = true;
    return sass();
}

function fonts () {
    return gulp
        .src(config.fonts.src)
        .pipe(gulp.dest(config.fonts.dest));
}
