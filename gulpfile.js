'use strict';

const gulp = require('gulp');

/** Lesson 20: RegExp */
gulp.task('20:css', require('./20-regexp/gulpfile.js').build20Css);
gulp.task('20:js', require('./20-regexp/gulpfile.js').build20Js);
gulp.task('20:build', gulp.parallel('20:css', '20:js' ));
gulp.task('20:watch', function () {
    gulp.watch('./20-regexp/js/**/*.js', gulp.series('20:js'));
});
