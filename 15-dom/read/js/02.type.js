console.log(document.body.toString());
console.log(document.body.querySelector('input').toString());
console.log(document.body.querySelector('a'));

/* 
interface Node {
    // Всевозможные значения nodeType
    const unsigned short ELEMENT_NODE = 1;
    const unsigned short ATTRIBUTE_NODE = 2;
    const unsigned short TEXT_NODE = 3;
    const unsigned short CDATA_SECTION_NODE = 4;
    const unsigned short ENTITY_REFERENCE_NODE = 5;
    const unsigned short ENTITY_NODE = 6;
    const unsigned short PROCESSING_INSTRUCTION_NODE = 7;
    const unsigned short COMMENT_NODE = 8;
    const unsigned short DOCUMENT_NODE = 9;
    const unsigned short DOCUMENT_TYPE_NODE = 10;
    const unsigned short DOCUMENT_FRAGMENT_NODE = 11;
    const unsigned short NOTATION_NODE = 12;
}
*/

console.log('--- only node-elements: ---');
var elementNodes = document.body.childNodes;

for (var i = 0; i < elementNodes.length; i += 1) {
    if (elementNodes[i].nodeType !== 1) continue;
    console.log(i + ':', elementNodes[i] + ':', elementNodes[i].nodeName, elementNodes[i].tagName);
}

console.log('--- innerHTML: ---');  // внутреннее содержимое
var inner = document.querySelector('.content-html');
console.log(inner.innerHTML);
inner.innerHTML = '<p>new paragraf content</p>';

console.log('--- outerHTML: ---');  // содержимое с блоком целиком
var outer = document.querySelector('.content-html');
console.log(outer.outerHTML);
outer.outerHTML = '<p>new outerHTML content</p>';
console.log(outer.data);

console.log('--- textContent: ---');
var name = '<b>Армен Тамзарян</b>',
    nameBlock = document.querySelector('.text-content');

nameBlock.children[0].innerHTML = name;
nameBlock.children[1].textContent = name;   //  присваивание через textContent – один из способов защиты от вставки на сайт произвольного HTML-кода.