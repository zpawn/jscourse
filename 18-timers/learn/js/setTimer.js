(function () {
    'use strict';

    function printNumbersInterval () {
        var i = 0;
        var timerId = setInterval(function () {
            console.log('interval:', i);
            i = (i < 20) ? i += 1 : clearInterval(timerId);
        }, 100);
    }

    function printNumbersTimeout () {
        var i = 0;
        setTimeout(function setNumberTimeout () {
            console.log('timeout:', i);
            if (i < 20) {
                setTimeout(setNumberTimeout, 100);
            }
            i += 1;
        }, 100);
    }

    var btnInterval = document.querySelector('#set-interval');
    var btnTimeout = document.querySelector('#set-timeout');

    btnInterval.addEventListener('click', printNumbersInterval, false);
    btnTimeout.addEventListener('click', printNumbersTimeout, false);
}());