'use strict';

function wait (ms) {
    var start = (new Date()).getTime();
    while (new Date() - start < ms);
}

var timesCalled = 0;
setInterval(function () {
    wait(300);
    timesCalled += 1;
    console.log('timesCalled:', timesCalled);
}, 500);