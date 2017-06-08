(function () {
    'use strict';

    function getDate (timestamp) {
        timestamp = timestamp || Date.now();

        var h, m, s, ms;
        ms = timestamp % 1000;
        s = Math.floor(timestamp / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);

        function padZero (num) {
            return num >= 10 ? num : '0' + num;
        }

        return {
            ms: function () {
                return padZero(ms);
            },
            seconds: function () {
                return padZero(s);
            },
            minutes: function () {
                return padZero(m);
            },
            hour: function () {
                return padZero(h);
            }
        };
    }

    window.getDate = getDate;
}());