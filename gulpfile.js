'use strict';

const gulp = require('gulp');

/**
 * minimatch:
 *      ** - all recursive dirs
 *      *.* - all ext
 */
gulp.task('dest', function () {
    return gulp.src('30-gulp/source/**/*.*')
        .on('data', function (file) {
            console.dir(file);
        })
        .pipe(gulp.dest('30-gulp/dest'));
});

/**
 *
 */
gulp.task('dest:info', function () {
    // return gulp.src('30-gulp/source/**/*.{js,css}')
    // or
    return gulp.src(['30-gulp/source/**/*.js', '30-gulp/source/**/*.css'])
        .on('data', function (file) {
            console.log({
                contents:   file.contents,
                path:       file.path,
                cwd:        file.cwd,
                base:       file.base,
                // path component helpers
                relative:   file.relative,
                dirname:    file.dirname,
                basename:   file.basename,
                stem:       file.stem,
                extname:    file.extname
            });
        })
        .pipe(gulp.dest('30-gulp/dest'));
});