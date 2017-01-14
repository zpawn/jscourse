'use strict'

console.dir(document.body);
console.dir(document.body.outerHTML);
console.dir(document.documentElement);  // main document node - <html>

// выбор по селектоу
//------------------
document.querySelector('li + li');
document.querySelector('.navigation');      // ссылка на dom-узел с классом 'navigation'

var lis = document.querySelectorAll('li');  // возвращает коллекцию

for (var i = 0; i < lis.length; i += 1) {
    console.log(lis[i]);
}

console.log('-------------------------------------');

// можно искать внутри контекста
var nav = document.querySelector('.nav-2');
console.log(nav.querySelectorAll('li'));

/*
childNodes - коллекция все дочерние элементы
parentNode - ссылка на ближайшего родителя
nextSibling - следующий рядом стоящий элемент
previousSibling
*/

var body = document.body.childNodes;  // в выборку попадают узлы с комментариями, пустыми строками и переносов строк

// исключить комментарии, пустые строки и переносы строк
document.querySelectorAll('body > *');

// или можно отфильтровать
Array.prototype.filter.call(body, function (node) {
    return node.nodeType === 1;
});

var input = document.querySelector('input');
// input.disabled = true;
input.setAttribute('type', 'password');

// получить значение
input.value

// установить значение
input.value = '100500';

// Работа с узлами (создание удаление)
//------------------------------------
var div = document.createElement('div');
console.log('createNode:', div);
div.innerText = 'Hello, there!';
document.querySelector('ul li').appendChild(div);

var a = document.createElement('a');
a.href = 'http://yandex.ru';
a.innerText = 'Go to Yandex';
div.appendChild(a);

function copyLis () {
    var ulMain = document.querySelector('.navigation');
    var donorLis = document.querySelectorAll('.navigation.nav-2 > li');
    for (var i = 0; i < donorLis.length; i += 1) {
        ulMain.appendChild(donorLis[i]);
    }
};

function copyLisBefore () {
    var ulMain = document.querySelector('.navigation');
    var donorLis = document.querySelectorAll('.navigation.nav-2 > li');
    for (var i = 0; i < donorLis.length; i += 1) {
        ulMain.insertBefore(donorLis[i], ulMain.firstChild);
    }
}

function cloneLisBefore () {
    var ulMain = document.querySelector('.navigation');
    var donorLis = document.querySelectorAll('.navigation.nav-2 > li');
    for (var i = 0; i < donorLis.length; i += 1) {
        ulMain.insertBefore(donorLis[i].cloneNode(true), ulMain.firstChild);
    }
}