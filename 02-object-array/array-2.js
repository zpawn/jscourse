/**
 * delete
 */
var arrDelete = ["Я", "изучаю", "JavaScript"];
delete arrDelete[1];
console.log(arrDelete);
console.log('arrDelete[1]:', arrDelete[1]);

/**
 * splice - удалять элементы, вставлять элементы, заменять элементы
 */
// remove value
var arrSplice1 = ["Я", "изучаю", "JavaScript"];
arrSplice1.splice(1, 1);
console.log(arrSplice1);

// replace value
var arrSplice2 = ["Я", "сейчас", "изучаю", "JavaScript"];
arrSplice2.splice(0, 3, 'We', 'learn');
console.log(arrSplice2);

// return value
var arrSplice3 = ["Я", "сейчас", "изучаю", "JavaScript"];
var removeValue = arrSplice3.splice(0, 2);
console.log('remove value:', removeValue);

// insert value
var arrSplice4 = ["Я", "изучаю", "JavaScript"];
arrSplice4.splice(2, 0, 'сложный', 'язык');
console.log(arrSplice4);

// insert from end
var arrEnd = [1, 2, 5],
    arrEndCopy = arrEnd.slice();
arrEnd.splice(-1, 0, 3, 4);
console.log(arrEndCopy,'<->',arrEnd);

/**
 * slice - копирует участок массива от begin до end, не включая end. Исходный массив при этом не меняется.
 */
var arrSlice = ["Почему", "надо", "учить", "JavaScript"];
console.log(arrSlice.slice(1));
console.log(arrSlice.slice(-2));

/**
 * sort - по умолчанию sort сортирует, преобразуя элементы к строке
 */
var arrSort = [1,2,15,3,45,12];
function sortFn(a, b){
    if(a > b) return 1;
    if(a < b) return -1;
}
console.log(arrSort.sort());
console.log(arrSort.sort(sortFn));

/**
 * reverse
 */
var arrReverse = [1,2,15,3,45,12];
console.log(arrReverse.reverse());

/**
 * Метод arr.concat(value1, value2, … valueN) создаёт новый массив, в который копируются элементы из arr,
 * а также value1, value2, ... valueN.
 */
var arrConcat = [1,2];
console.log(arrConcat.concat(3));
console.log(arrConcat.concat([3,4], 5));

/**
 * indexOf/lastIndexOf
 * Метод arr.indexOf(searchElement[, fromIndex]) возвращает номер элемента searchElement в массиве arr или -1, если его нет.
 * Поиск начинается с номера fromIndex, если он указан. Если нет — с начала массива.
 * Для поиска используется строгое сравнение ===.
 */
var arr = [1, 0, false];
console.log(arr.indexOf(0));        // 1
console.log(arr.indexOf(false));    // 2
console.log(arr.indexOf(null));     // -1

/**
 * Object.keys(obj)
 */
var user = {
    name: "Петя",
    age: 30
};
console.log(Object.keys(user));