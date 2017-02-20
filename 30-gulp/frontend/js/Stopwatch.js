(function () {
    'use strict';

    function Stopwatch () {}

    Stopwatch.prototype.start = function () {
        console.log('thisIsStart');
    };

    Stopwatch.prototype.stop = function () {
        console.log('thisIsStop');
    };

    Stopwatch.prototype.lap = function () {
        console.log('thisIsLap');
    };

    Stopwatch.prototype.reset = function () {
        console.log('thisIsReset');
    };

    window.Stopwatch = Stopwatch;
}());