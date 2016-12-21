console.log('*** Module ***');

(function () {

    function isArray () {}

    window.flatten = function () {};
}());

// ...

var APP = {};
APP.utils = {}; 

(function (namespaceToExportTo) {

    var toString = Object.prototype.toString;

    function ifArray (arr) {
        return toString.call(arr) === '[object Array]';
    }

    namespaceToExportTo.flatten = function (arr) {

    };
}(APP.utils));

APP.utils.flatten;