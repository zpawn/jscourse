'use strict';

var img = document.createElement('img');
img.src = 'http://jscourse.com/img/js-course.png';
document.body.appendChild(img);
console.log('await:', img.width); // this moment image don't loaded yet

var imgAsync = document.createElement('img');
imgAsync.src = 'https://avatars2.githubusercontent.com/u/11043120?v=3&s=460';
imgAsync.addEventListener('load', function () {
    console.log('async:', imgAsync.width);
}, false);
document.body.appendChild(imgAsync);

var timesCalled = 0;
setInterval(function () {
    timesCalled += 1;
    console.log('timesCalled:', timesCalled);
}, 500);