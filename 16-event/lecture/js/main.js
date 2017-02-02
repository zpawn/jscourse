var text = document.querySelector('body');

text.addEventListener('click', function (event) {
    console.log(event);
}, false);

text.addEventListener('click', function (event) {
    console.warn(event);
}, false);

function logEvent (event) {
    console.log('event', event);
}

window.addEventListener('resize', logEvent, false);
window.addEventListener('click', logEvent, false);  // arguments[2] - фаза события. 