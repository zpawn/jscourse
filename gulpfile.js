'use strict';

const gulp = require('gulp');

/** Lesson 20: RegExp */
gulp.task('20:css', require('./20-regexp/gulpfile.js').build20Css);
gulp.task('20:js', require('./20-regexp/gulpfile.js').build20Js);
gulp.task('20:build', gulp.parallel('20:css', '20:js' ));
gulp.task('20:watch', function () {
    gulp.watch('./20-regexp/js/**/*.js', gulp.series('20:js'));
});

/** Lesson 22: jQuery Slider */
gulp.task('22:sass', require('./22-jquery-animation/gulpfile.js').build22Scss);
gulp.task('22:js', require('./22-jquery-animation/gulpfile.js').build22Js);
gulp.task('22:build', gulp.parallel('22:sass', '22:js'));
gulp.task('22:watch', function () {
    gulp.watch('./22-jquery-animation/task/js/**/*.js', gulp.series('22:js'));
    gulp.watch('./22-jquery-animation/task/sass/**/*.scss', gulp.series('22:sass'));
});
