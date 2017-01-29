/*
document.documentElement - <html>
document.body - <body>
*/

console.log('--- List of nodes: ---');

for (var i = 0; i < document.body.childNodes.length; i += 1) {
    console.log(document.body.childNodes[i]);
}

/*
elm.childNodes[0] === elm.firstChild;
elm.childNodes[elm.childNodes.length - 1] === elm.lastChild;
*/

console.log('--- Iterate collection of nodes: ---');

var elms = document.documentElement.childNodes;
elms = Array.prototype.slice.call(elms);

elms.forEach(function (elm) {
    console.log(elm);
});

console.log('--- or ---');

Array.prototype.forEach.call(elms, function (elm) {
    console.log(elm);
});

/*
children        – только дочерние узлы-элементы, то есть соответствующие тегам.
firstElementChild, lastElementChild         – соответственно, первый и последний дети-элементы.
previousElementSibling, nextElementSibling  – соседи-элементы.
parentElement   – родитель-элемент.
*/

console.log('--- onle node-elements: ---');

for (var i = 0; i < document.body.children.length; i += 1) {
    console.log(document.body.children[i]);
}

console.log('--- table methods: ---');

var table = document.querySelector('table'),
    tbody = table.querySelector('tbody'),
    tr = table.querySelector('tr'),
    td = tr.lastElementChild;

console.log('rows:', table.rows);                       // коллекция строк TR таблицы.
console.log('caption:', table.caption);                 // ссылки на элементы таблицы caption, tHead, tFoot.
console.log('tbody:', table.tBodies);                   // коллекция элементов таблицы TBODY, по спецификации их может быть несколько.

console.log('tbody.rows:', tbody.rows);                 // коллекция строк TR секции.

console.log('tr.cells:', tr.cells);                     // коллекция ячеек TD/TH
console.log('tr.sectionRowIndex:', tr.sectionRowIndex); // номер строки в текущей секции THEAD/TBODY
console.log('tr.rowIndex:', tr.rowIndex);               // номер строки в таблице

console.log('td.cellIndex:', td.cellIndex);             // номер ячейки в строке

console.log('inner:', table.rows[0].cells[0].innerHTML);