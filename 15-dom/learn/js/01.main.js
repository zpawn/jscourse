// Напишите код, который получит элемент HEAD.
var head = document.documentElement.firstElementChild;

// Напишите код, который получит UL.
var ul = document.body.children[1];

// Напишите код, который получит второй LI. Будет ли ваш код работать в IE8-, если комментарий переместить 
// между элементами LI?
var secondLi = ul.lastElementChild;

// Придумайте самый короткий код для проверки, пуст ли элемент elem.
// «Пустой» – значит нет дочерних узлов, даже текстовых.
var checkUl = document.querySelector('.is-empty');

if (!checkUl.children.length) {}
if (!checkUl.firstElementChild) {}

// Напишите код, который выделит все ячейки в таблице по диагонали.
// Вам нужно будет получить из таблицы table все диагональные td и выделить их, используя код:
var table = document.body.querySelector('.mark-cell'),
    tr = table.rows;

for (var i = 0; i < tr.length; i += 1) {
    tr[i].cells[(tr.length - 1) - i].style.backgroundColor = '#ff0';
    tr[i].cells[i].style.backgroundColor = '#f00';
}