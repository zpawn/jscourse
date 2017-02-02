var outer = document.querySelector('.outer'),
    inner = document.querySelector('.inner'),
    text = document.querySelector('.text');

outer.addEventListener('click', function (event) {
    console.log(this, 'phase:' + event.eventPhase);
}, false);

inner.addEventListener('click', function (event) {
    console.log(this, 'phase:' + event.eventPhase);
}, false);

inner.addEventListener('click', function (event) {
    console.log(this, 'phase:' + event.eventPhase);
}, true);

text.addEventListener('click', function (event) {
    console.log(this, 'phase:' + event.eventPhase);
}, false);

/** Создайте дерево, которое по клику на заголовок скрывает-показывает детей: */
document.querySelector('.tree').addEventListener('click', function (event) {
    var nextSibling = event.target.nextElementSibling;
    if (nextSibling && nextSibling.tagName == 'UL') {
        event.target.nextElementSibling.classList.toggle('open');
    }
}, false);