/**
 * Релизовать функцию createList(listData, listContainer, itemContainer), возвращаюшую узел списка. 
 * Использовать innerHTML нельзя. Второй и третий аргументы не обязательные. Значения по 
 * умолчанию для них - ul и li. listData - массив. listData Может содержать как элементы (текст), 
 * так и массивы элементов. Глубина вложенности массивов любая.
 * 
 
 createList(['мясо', 'рыба'])
 <ul>
     <li>мясо</li>
     <li>рыба</li>
 </ul>
 
 createList(['мясо', ['яблоки', 'бананы']], 'ol')
 <ol>
     <li>мясо</li>
     <li>
     <ol>
         <li>яблоки</li>
         <li>бананы</li>
     </ol>
     </li>
 </ol>
 
 createList(['мясо', ['яблоки', 'бананы']], 'div', 'div')
 <div>
     <div>мясо</div>
     <div>
     <div>
         <div>яблоки</div>
         <div>бананы</div>
     </div>
     </div>
 </div>
 */

function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function concatElm (data, container, item) {

    var resultItem,
        resultContainer = document.createElement(container);

    for (var i = 0; i < data.length; i += 1) {
        resultItem = document.createElement(item);
        if (isArray(data[i])) {
            resultItem.appendChild(concatElm(data[i], container, item));
        } else {
            resultItem.innerText = data[i];
        }
        resultContainer.appendChild(resultItem);
    }

    return resultContainer;
}

function createList (listData, listContainer, itemContainer) {
    var container = listContainer || 'ul',
        item = itemContainer || 'li',
        result = concatElm(listData, container, item);

    document.body.appendChild(result);
    
}

createList(['мясо', 'рыба']);
createList(['мясо', ['яблоки', 'бананы']], 'ol');
createList(['мясо', ['яблоки', 'бананы']], 'div', 'div');

/**
 * Реализовать функцию getExternalLinks, которая возвращает массив ссылок, 
 * ведущих на внешние ресурсы (то есть не на тот домен, где запускается скрипт)
 */

/**
 * Реализовать функцию getUniqueTags, которая возвращает массив названий тегов, 
 * присутствуещих на странице. В массиве каждого типа тег должен присутствовать в единственном экземпляре.
 */