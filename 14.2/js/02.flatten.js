/*
Упростить массив

Реализовать ф-цию flatten(arr), которая принимает аргументом массив. Элементами массива могут быть как простые типы
данных (числа, строки), так и массивы. Ф-ция должна вернуть массив, состоящий из всех элементов вложенных массивов.
Глубина вложенности массивов может быть любая.

flatten([1, 2, 3, [1, 2, 3]]);  // [1, 2, 3, 1, 2, 3]
flatten(['mama', ['mila'], [], [['ramu']]]);    // ['mama', 'mila', 'ramu']
 */

// Общая схема работы рекурсивной схемы
function rec () {
    if (/*condition*/1) {
        return rec();
    } else {
        return 1;
    }
}

var utils = {};

utils.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

function flatten (array) {
    var result = [];

    for (var i = 0; i < array.length; i += 1) {
        if (utils.isArray(array[i])) {
            result = result.concat(flatten(array[i]));
        } else {
            result.push(array[i])
        }
    }

    return result;
}

function flattenConcat (array) {
    while (array.some(utils.isArray)) {
        array = Array.prototype.concat.apply([], array);
    }
    return array;
}

function flattenReduce (array) {
    return array.reduce(function (result, elm) {
        if (utils.isArray(elm)) {
            result = result.concat(flattenReduce(elm));
        } else {
            result.push(elm);
        }
        return result;
    }, []);
}

var testArray = ['mama', ['mila'], [], [['ramu']]];

console.log(flatten(testArray));
console.log(flattenConcat(testArray));
console.log(flattenReduce(testArray));
