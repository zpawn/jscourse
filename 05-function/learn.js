/**
 * @see http://learn.javascript.ru/closures-usage
 */

function makeCounter () {
    var currentCount = 0;
    return function () {
        return currentCount += 1;
    }
}

var counter = makeCounter();

console.log(counter());
console.log(counter());
console.log(counter());

console.log('==============================');

say('Vasia');
var phrase = 'Hallo';
function say(name) {
    console.log(name + ', ' + phrase);
}

console.log('==============================');

var value = 0;

function f () {
    if (1) {
        value = true;
    } else {
        var value = false;
    }
    console.log('value:', value);
}

f();

console.log('==============================');

function test () {
    console.log(window);
    var window = 5;
    console.log(window);
}
test();

console.log('==============================');

var a = 5;

(function () {
    console.log(a);
})();

console.log('==============================');
var newCurrentCount = 1;

function newMakeCounter() {
    return function() {
        return newCurrentCount++;
    };
}

var newCounter = newMakeCounter();
var newCounter2 = newMakeCounter();

console.log(newCounter());
console.log(newCounter());
console.log(newCounter2());
console.log(newCounter2());

/*
 * Напишите функцию sum, которая работает так: sum(a)(b) = a+b
 * Например:
 *  sum(1)(2) = 3
 *  sum(5)(-1) = 4
 */
function sum (a) {
    return function (b) {
        return a + b;
    };
}
console.log('closure sum:', sum(2)(3));

/*
 * В некоторых языках программирования существует объект «строковый буфер», который аккумулирует внутри себя значения.
 * Его функционал состоит из двух возможностей:
 * 1. Добавить значение в буфер.
 * 2. Получить текущее содержимое.
 * Задача – реализовать строковый буфер на функциях в JavaScript, со следующим синтаксисом:
 *
 * Создание объекта: var buffer = makeBuffer();.
 *
 * Вызов makeBuffer должен возвращать такую функцию buffer, которая при вызове buffer(value) добавляет значение в
 * некоторое внутреннее хранилище, а при вызове без аргументов buffer() – возвращает его. Пример:
 *
 * function makeBuffer() { ... ваш код ... }
 * var buffer = makeBuffer();
 *
 * // добавить значения к буферу
 * buffer('Замыкания');
 * buffer(' Использовать');
 * buffer(' Нужно!');
 *
 * //получить текущее значение
 * alert( buffer() ); // Замыкания Использовать Нужно!
 *
 * Буфер должен преобразовывать все данные к строковому типу:
 * var buffer = makeBuffer();
 * buffer(0);
 * buffer(1);
 * buffer(0);
 *
 * alert( buffer() ); // '010'
 * Решение не должно использовать глобальные переменные.
 */
function makeBuffer () {

    var _buffer = [];

    return function (_value) {
        var value = _value || (typeof _value === "number") ? _value.toString() : undefined;
        if (value === undefined) {
            return _buffer.join(' ');
        } else {
            _buffer.push(value);
        }
        return true;
    }
}

var buffer = makeBuffer();
buffer('Замыкания');
buffer('Использовать');
buffer('Нужно!');

var buffer2 = makeBuffer();
buffer2(0);
buffer2(1);
buffer2(0);

console.log('closure buffer:', buffer2());

/*
 * Добавьте буферу из решения задачи Функция - строковый буфер метод buffer.clear(), который будет очищать текущее содержимое буфера:
 * buffer.clear();
 */
function cleanMakeBuffer () {

    var _buffer = [];

    function cleanBuffer (_value) {
        var value = _value || (typeof _value === "number") ? _value.toString() : undefined;
        if (value === undefined) {
            return _buffer.join(' ');
        } else {
            _buffer.push(value);
        }
    };

    cleanBuffer.clear = function () {
        _buffer = [];
    };

    return cleanBuffer;
}

var cleanBuffer = cleanMakeBuffer();
cleanBuffer('Замыкания');
cleanBuffer('Использовать');
cleanBuffer('Нужно!');

console.log('cleanMakeBuffer:', cleanBuffer());
cleanBuffer.clear();
console.log('after clean:', cleanBuffer());

/*
 * У нас есть массив объектов:
     var users = [{
         name: "Вася",
         surname: 'Иванов',
         age: 20
     }, {
         name: "Петя",
         surname: 'Чапаев',
         age: 25
     }, {
         name: "Маша",
         surname: 'Медведева',
         age: 18
     }];

 * сделать сортировку по полю
 *
 * users.sort(byField('name'));
 * users.sort(byField('age'));
 */

function byField (field) {
    return function (a, b) {
        return a[field] > b[field] ? 1 : -1;
    }
}

var users = [{
    name: "Вася",
    surname: 'Иванов',
    age: 20
}, {
    name: "Петя",
    surname: 'Чапаев',
    age: 25
}, {
    name: "Маша",
    surname: 'Медведева',
    age: 18
}];

users.sort(byField('name'));
users.forEach(function(user) {
    console.log(user.name);
}); // Вася, Маша, Петя

users.sort(byField('age'));
users.forEach(function(user) {
    console.log(user.name);
}); // Маша, Вася, Петя

/*
 * Создайте функцию filter(arr, func), которая получает массив arr и возвращает0 новый, в который входят только те
 * элементы arr, для которых func возвращает true.
 * var arr = [1, 2, 3, 4, 5, 6, 7];
 * console.log(filter(arr, function(a) {
 *      return a % 2 == 0
 * })); // 2,4,6
 */
var arrayOfNumber = [1, 2, 3, 4, 5, 6, 7];

function filter(array, condition) {

    var newArray = [];

    for (var i = 0; i < array.length; i += 1) {
        if (condition(array[i])) {
            newArray.push(array[i]);
        }
    }

    return newArray;
}

console.log('filter:', filter(arrayOfNumber, function (a) {
    return a % 2 == 0
}));

/*
 * Создайте набор «готовых фильтров»: inBetween(a,b) – «между a,b», inArray([...]) – "в массиве [...]".
 * Использование должно быть таким:
 * filter(arr, inBetween(3,6)) – выберет только числа от 3 до 6,
 * filter(arr, inArray([1,2,3])) – выберет только элементы, совпадающие с одним из значений массива.
 */

function inBetween (a, b) {
    return function (num) {
        return (num >= a && num <= b);
    };
}

function inArray (array) {
    return function (num) {
        return (array.indexOf(num) !== -1);
    }
}

console.log('inBetween:', filter(arrayOfNumber, inBetween(3,6)));
console.log('inArray:', filter(arrayOfNumber, inArray([1,2,3])));

/*
 * Следующий код создает массив функций-стрелков shooters. По замыслу, каждый стрелок должен выводить свой номер:
 */

console.log('====================================================');
function makeArmy() {

    var shooters = [];

    for (var i = 0; i < 10; i++) {
        var shooter = function() { // функция-стрелок
            console.log('shooter:', i ); // выводит свой номер
        };
        shooters.push(shooter);
    }

    return shooters;
}

var army = makeArmy();

army[0];
army[5];