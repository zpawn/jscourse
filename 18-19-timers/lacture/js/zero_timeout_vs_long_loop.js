'use strict';

var arr = [];

setTimeout(function () {
    console.log('length:', arr.length);
}, 0);

for (var i = 0; i < 199999; i += 1) {
    arr.push(new Date());
}