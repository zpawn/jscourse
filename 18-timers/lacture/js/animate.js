(function () {
    'use strict';

    var animate = document.querySelector('.animate'),
        left = 0,
        top = 0;

    setInterval(function () {
        left += 2;
        top += 1;
        animate.style.left = left + 'px';
        animate.style.top = top + 'px';
    }, 1000/60);
}());