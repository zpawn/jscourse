'use strict';

(function () {
    var button = document.createElement('button');
    button.innerText = 'Click Me';
    button.addEventListener('click', function () {
        console.log('button cicked');
    }, false);

    document.documentElement.addEventListener('click', function globalClick () {
        document.documentElement.removeEventListener('click', globalClick, false);
        document.body.appendChild(button);
    }, false);
}());