'use strict';

(function () {
    var timer = document.querySelector('.timer');
    window.timer = setInterval(function () {
        var now = (new Date()).getTime();
        timer.innerText = now;
    }, 200);
}());

(function () {
    var input = document.querySelector('input'),
        inputText = document.querySelector('.input-text');
    var keyupTimeout;
    input.addEventListener('keyup', function (event) {
        clearTimeout(keyupTimeout);
        keyupTimeout = setTimeout(function () {
            inputText.innerText = input.value;
        }, 100);
    }, false);
}());

(function () {
    var outer = document.querySelector('.outer'),
    inner = document.querySelector('.inner'),
    hidingTimeout;

    outer.addEventListener('mouseout', function () {
        console.log('mouseOut');
        hidingTimeout = setTimeout(function () {
            inner.style.display = 'none';
        }, 1000);
    }, false);

    outer.addEventListener('mouseenter', function () {
        console.log('mouseEnter');
        clearTimeout(hidingTimeout);
        inner.style.display = 'block';
    }, false);
}());