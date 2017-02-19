function debounce(f, ms) {

    var state = null;

    var COOLDOWN = 1;

    return function() {
        if (state) return;

        f.apply(this, arguments);

        state = COOLDOWN;

        setTimeout(function() { state = null }, ms);
    }

}

function f(x) { alert(x) }
var f = debounce(f, 1000);

f(1); // 1, выполнится сразу же
f(2); // игнор

setTimeout( function() { f(3) }, 100); // игнор (прошло только 100 мс)
setTimeout( function() { f(4) }, 1100); // 4, выполнится
setTimeout( function() { f(5) }, 1500); // игнор