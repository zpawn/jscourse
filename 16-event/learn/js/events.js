var doc = document.documentElement;

/**
 * element.addEventListener(event, handler[, phase]);
 * event    - имя события
 * handler  - ф-ция которую будет использовать обработчик
 * phase    - фаза
 */

/**
 * Mouse events:
 * 
 * click –          происходит, когда кликнули на элемент левой кнопкой мыши
 * contextmenu –    происходит, когда кликнули на элемент правой кнопкой мыши
 * mouseover –      возникает, когда на элемент наводится мышь
 * mousedown и mouseup – когда кнопку мыши нажали или отжали
 * mousemove –      при движении мыши
 */
doc.addEventListener('click', function (event) {
    // console.log('thisIsClick');
}, false);

doc.addEventListener('mousemove', function (event) {
    // console.log(event);
}, false);

/**
 * elements of Countrols:
 * 
 * submit – посетитель отправил форму <form>
 * focus –  посетитель фокусируется на элементе, например нажимает на <input>
 */

/**
 * Kyes events:
 * 
 * keydown –    когда посетитель нажимает клавишу
 * keyup –      когда посетитель отпускает клавишу
 */

/**
 * DOM events:
 * 
 * DOMContentLoaded – когда HTML загружен и обработан, DOM документа полностью построен и доступен.
 */

document.getElementById('hider').addEventListener('click', function (event) {
    document.getElementById('text').style.display = 'none';
}, false);

document.querySelector('.self-hide').addEventListener('click', function (event) {
    var _thisNode = event.target;
    _thisNode.style.display = 'none';
    setTimeout(function () {
        _thisNode.style.display = 'inline-block';
    }, 1500);
}, false);

/**
 * Task:
 */

/** Создайте меню, которое раскрывается/сворачивается при клике */
var itemMenu = document.querySelector('.menu .item');
itemMenu.addEventListener('click', function (event) {
    // var classList = Array.prototype.slice.call(this.classList);
    // if (classList.indexOf('open') === -1) {
    //     this.classList.add('open');
    // } else {
    //     this.classList.remove('open');
    // }
    this.classList.toggle('open');
}, false);

/** Есть список сообщений. Добавьте каждому сообщению по кнопке для его скрытия. */
document.addEventListener('click', function (event) {
    var elm = event.target;
    if (elm.className.indexOf('remove-button') !== -1) {
        elm.parentNode.style.display = 'none';
    }
}, false);

/** Напишите «Карусель» – ленту изображений, которую можно листать влево-вправо нажатием на стрелочки. */

/* конфигурация */
var width = 130;    // ширина изображения
var count = 3;      // количество изображений

var carousel = document.querySelector('.carousel');
var list = carousel.querySelector('.carousel-items');
var listElems = carousel.querySelectorAll('.item');

var position = 0; // текущий сдвиг влево

carousel.querySelector('.arrow-prev').addEventListener('click', function (event) {
    // Сдвиг влево. Последнее передвижение влево может быть не на 3, а на 2 или 1 элемент
    position = Math.min(position + width * count, 0)
    list.style.marginLeft = position + 'px';
}, false);

carousel.querySelector('.arrow-next').addEventListener('click', function() {
    // Сдвиг вправо. Последнее передвижение вправо может быть не на 3, а на 2 или 1 элемент
    position = Math.max(position - width * count, -width * (listElems.length - count));
    list.style.marginLeft = position + 'px';
}, false);