/**
 * (c) 2016 FF.ua. Lev Boyko, Ilya M.
 */

/*
 * Реализовать функцию sumOnly100Plus, которая принимает аргументом массив, и возвращает сумму всех чисел массива,
 * которые больше 100. В массиве могут быть не только числовые данные, их никак не учитывать.
 * sumOnly100Plus([150, "200", " ", 30, 300]); // 450
 */
function sumOnly100Plus (array) {

    var sum = 0;

    for (var i = 0; i < array.length; i += 1) {
        if ((typeof array[i] == 'number') && array[i] > 100) {
            sum += array[i];
        }
    }

    return sum;
}
console.log(
    sumOnly100Plus([150, "200", " ", 30, 300])
);

/*
 *  Реализовать функцию extractOddItems(arr), которая возвращает новый массив, в котором содержатся только те элементы,
 *  которые обладали нечетным индексом в массиве, переданном в качестве аргумента.
 *  extractOddItems([0,1,0,1,0,1]); // [1,1,1]
 *  extractOddItems([1,2,3,4,5]); [2, 4]
 */
function extractOddItems (array) {
    var newArray = [];

    for (var i = 0; i < array.length; i += 1) {
        if (i % 2 != 0) {
            newArray.push(array[i]);
        }
    }

    return newArray;
}

var arr1 = [0,1,0,1,0,1];
var arr2 = [1,2,3,4,5];
console.log(extractOddItems(arr1));

/*
 * Дописать функцию contains(where, what). Если все элементы массива what содержатся в массиве where, функция должна
 * возвращать true. Пустой массив является подмножеством любого массива. Порядок вхождения элементов в массив не имеет значения.
 * contains([1,2,3], [3,2]); // true
 * contains([1,2,3], [3,2,1,2,3]); // true
 */
function inArray(where, what) {

    for (var j = 0; j < what.length; j += 1) {
        if (where.indexOf(what[j]) === -1) {
            return false;
        }
    }
    return true;
}
var inArrayWhere1 = [1,2,3];
var inArrayWhat1 = [3,2];
var inArrayWhere2 = [1,2,3];
var inArrayWhat2 = [3,2,1,2,3];

console.log(inArray(inArrayWhere2, inArrayWhat2));

/*
 * Реализовать функцию extend(obj1, obj2), которая скопирует свойства из объекта obj2 в объект obj1. Функция должна
 * возвращать obj1. Значения одинаковых ключей должны перетирать оригинальные.
 * extend({foo: 'bar', baz: 1}, {foo: true, zoop: 0}); // {foo: true, baz: 1, zoop: 0}
 */
function extend (obj1, obj2) {

    for (var key in obj2) {
        obj1[key] = obj2[key];
    }

    return obj1;
}

var obj1 = {foo: 'bar', baz: 1};
var obj2 = {foo: true, zoop: 0};
console.log(extend(obj1, obj2));

/*
 * Реализовать функцию createObject(arrOfKeys, arrOfData), которая принимает аргументами два массива, и возвращает объект,
 * в котором названия ключей это строки из массива arrOfKeys, а значения - элементы из массива arrOfData. В ключ,
 * стоящий на первом месте массива arrOfKeys должно быть записано значение, стоящее на первом месте arrOfData.
 * Если данных меньше, чем ключей, заполняй значения ключей как undefined.
 * createObject(['foo'], ['bar']); // {foo: 'bar'}
 * createObject(['foo', 'extra'], ['bar']); // {foo: 'bar', extra: undefined}
 */
function createObject (arrOfKeys, arrOfData) {

    var obj = {};

    for (var i = 0; i < arrOfKeys.length; i +=1) {
        obj[arrOfKeys[i]] = arrOfData[i];
    }

    return obj;
}

console.log(createObject(['foo'], ['bar']));
console.log(createObject(['foo', 'extra'], ['bar']));