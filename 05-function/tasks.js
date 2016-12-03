/*
 * Реализуй функцию sum(), которая суммирует все передаваемые ей аргументы. В аргументах могут быть любые данные
 * sum(10, 20); // 30
 */

function sum () {
    var result;
    for (var i = 0; i < arguments.length; i += 1) {
        if (result == undefined) {
            result = arguments[i];
        } else {
            result += arguments[i];
        }
    }

    // or
    //==========================
    var result = (typeof arguments[0] === 'number') ? 0 : '';
    for (var i = 0; i < arguments.length; i += 1) {
        result += arguments[0];
    }
    // or
    //==========================
    var result = arguments[0];
    for (var i = 1; i < arguments.length; i += 1) {
        result += arguments[i];
    }

    return result;
}

console.log(sum(20,30, 'off'));
console.log(sum('mama ', 'mila ', 'ramu'));
console.log('=======================================');

/*
 * Реализовать функцию isInArray , проверяющую вхождение элементов в массив. Первый аргумент функции - массив,
 * последующие - элементы, вхождение в массив которых проверяется. Функция возвращает true, если все аргументы, кроме
 * первого являются элементами массива.
 */
function isInArray(array) {
    for (var i = 1; i < arguments.length; i += 1) {
        if (array.indexOf(arguments[i]) === -1) {
            return false;
        }
    }
    return true;
}
console.log(isInArray([1], 1));         // true
console.log(isInArray([1], 1, 2));      // false
console.log(isInArray([1, 2], 1, 2));   // true
console.log('=======================================');

/*
 * Реализовать функцию every(arr, func), которая принимает аргументами массив arr и функцию func. Возвращает true,
 * если функция func вернет для каждого элемента массива true. В функцию func нужно передавать аргументами элемет
 * массива, индекс элемента массива и сам массив.
 *
 * Проверка на то, что все элементы массива - строки
 * every(['mama', 'mila', 'ramu'], function (arrayItem) {
 *  return typeof arrayItem === 'string';
 * }); // true
 *
 * Проверка на то, что все элементы массива больше своих индексов
 * every([4, 8, 1], function (arrayItem, itemIndex) {
 *  return arrayItem > itemIndex
 * }); // false
 */
function every(arr, func) {

    for (var i = 0; i < arr.length; i += 1) {
        if (!func(arr[i], i, arr)) {
            return false;
        }
    }

    return true;
}

console.log(every([4, 8, 1], function (arrayItem, itemIndex) {
    return arrayItem > itemIndex;
}));

console.log(every([4, 8, 1], function (arrayItem, itemIndex) {
    return arrayItem > itemIndex;
}));
console.log('=======================================');

/*
 * Релизовать функцию execFunctions(arrOfFunctions), которая получает аргументом массив функций arrOfFunctions, и
 * возвращает массив, где каждый элемент это результат вызова функции стоящей на индексе, что и элемент.
 */

function return10() {
    return 10;
}

function returnUser() {
    return {name: "Evgen"};
}

function empty() {}

function execFunctions (arrOfFunctions) {
    var arrayOfFunc = [];
    if (arrOfFunctions.length) {
        for (var i = 0; i < arrOfFunctions.length; i += 1) {
            arrayOfFunc.push(arrOfFunctions[i]());
        }
    }
    return arrayOfFunc;
}

console.log(execFunctions([return10, returnUser, empty])); // [10, {name: "Evgen"}, undefined]
console.log('=======================================');

/*
 * Реализовать функцию getName(path), которая возвращает название папки или файла из строки пути. Разделители сегментов
 * путей - юниксовые ("/").
 */
function getName(path) {
    var fileFolderName;
    var pathArray = path.split('/');

    for (var i = pathArray.length - 1; i != 0; i -= 1) {
        if (!!pathArray[i]) {
            fileFolderName = pathArray[i];
            break;
        }
    }
    return fileFolderName;

    // or
    //=============================
    var pathSegments = path.split('/');
    var lastSegment;

    while (!lastSegment || !pathSegments.length) {
        lastSegment = pathSegments.pop();
    }

    // or
    //=============================
    return path.split('/').reduceRight(function (prev, pathSegments) {
        return prev || pathSegments;
    }, '');
}

var path1 = '/users/dmitry/Dropbox/';
var path2 = '/users/dmitry/Dropbox';
var path3 = '/users/dmitry/Dropbox/main.js';

console.log(getName(path1));
console.log(getName(path2));
console.log(getName(path3));