/*
 * Реализовать функцию toArray(obj), которая принимает аргументом массивоподобный объект (например arguments), и
 * возвращает массив из тех же элементов, которые входили в массивоподобный объект.
 */
function toArray(psevdoArray) {
    var array = [];
    for (var i = 0; i < psevdoArray.length; i += 1) {
        array.push(psevdoArray[i]);
    }
    return array;

    // or
    return [].slice().call(psevdoArray);
    // or канонический пример
    return Array.prototype.slice().call(psevdoArray);
}

/*
 * Реализуй функцию queryStringToObject(queryString), которая возвращает объект. Распознавать следующие типы данных:
 * числа, строки, булевы. Помни, что некоторые символы query string могут быть закодированы.
 *
 * queryStringToObject("user=true"); // {user: true}
 * queryStringToObject("user=true&age=29"); // {user: true, age: 29}
 * queryStringToObject("user=true&age=29&name=Evgen"); // {user: true, age: 29, name: "Evgen"}
 */
function deparam (queryString) {
    var paramsArray, _params = [];
    var params = {};

    if (queryString) {
        paramsArray = decodeURIComponent(queryString).split('&');
        for (var i = 0; i < paramsArray.length; i += 1) {
            _params = paramsArray[i].split('=');
            params[_params[0]] = _params[1];
        }
    }

    return params;
}

function queryStringToObject (queryString) {
    var res;
    var keyValPairs = queryString.split('&');

    if (!queryString) {
        return {}; // empty query string
    }

    res = keyValPairs.reduce(function (reducedValue, currentKeyValue) {
        var key = currentKeyValue.split('=')[0];
        var stringifyValue = decodeURIComponent(currentKeyValue.split('=')[1]);
        var parsedValue;

        if (stringifyValue === 'true') {
            parsedValue = true;
        } else if (stringifyValue === 'false') {
            parsedValue = false;
        } else if (!isNaN(parseInt(stringifyValue, 10))) {
            parsedValue = parseInt(stringifyValue, 10);
        } else {
            parsedValue = stringifyValue;
        }

        reducedValue[key] = parsedValue;

        return reducedValue;
    }, {});

    return res;
}

console.log(deparam(''));
console.log(deparam('user=true'));
console.log(deparam('user=true&age=29'));
console.log(deparam('user=true&age=29&name=Evgen'));
console.log(deparam('phrase=mama%20mila%20ramu'));
console.log(deparam('wtf=%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%88%D0%BA%D0%B0%3D%D1%85%D0%BB%D0%B5%D0%B1%2C%D0%BC%D0%B0%D1%81%D0%BB%D0%BE%3D%D0%B6%D1%8B%D1%80'));
queryStringToObject('user=true&age=29&name=Evgen');
console.log('====================================================');

/*
 Есть структура вида:
     [{
         delta: 5,
         value: 5
     }, {
         delta: -3,
         value: 2
     }, {
         delta: 5,
         value: 7
     }, {
         delta: 0,
         value: 7
     }]
 Она подчиняется следющему правилу: каждый последующий объект массива содержит объект со свойствами delta и value.
 delta - разница значений value с предыдущим объектом.
 У тебя есть экземпляр структуры, и достоверно известно, что один (и только один) из элементов имеет неверное значение
 delta и value, и что этот элемент не является ни первым, ни последним. Необходимо написать функцию fixStruct(struct),
 которая изменяет неверное значение таким образом, чтобы его delta и value снова подчинялись правилу, описанному выше.

 Алгоритм:
 1. Сначала пишем условия чему равны delta и value
    arr[n].value = arr[n+1].value - arr[n+1].delta
    arr[n].delta = arr[n].delta - arr[n - 1].value
 2. Пишем условие для нахождения поломанного элемента
    arr[n].delta === arr[n].value - arr[n - 1].value
 3. пробегаем по циклу исключая первій и последний єлемент
 */
function fixStruct (struct) {
    var brokenElementIndex;
    for (var i = 1; i < struct.length - 1; i += 1) {
        if (struct[i].delta !== struct[i].value - struct[i - 1].value) {
            brokenElementIndex = i;
            break;
        }
    }
    struct[brokenElementIndex].value = struct[brokenElementIndex + 1].value - struct[brokenElementIndex + 1].delta;
    struct[brokenElementIndex].delta = struct[brokenElementIndex].value - struct[brokenElementIndex - 1].value;
}

var struct = [{
    delta: 0,
    value: 1
}, {
    delta: 0,
    value: 0
}, {
    delta: 3,
    value: 5
}];

console.log(fixStruct(struct));
/*
[{
    delta: 0,
    value: 1
}, {
    delta: 1,
    value: 2
}, {
    delta: 3,
    value: 5
}]
*/

/*
 Реализовать функцию getUnique(arr), которая принимает аргументом массив или массивоподоный объект, и возвращает массив
 таких элементов, которые входят в массив аргумента, и встречаются только раз в массиве результата. Аргумент не должен
 изменяться. Порядок элементов результирующего массива должен совпадать с порядком, в котором они встречаются в
 оригинальной структуре.
 */
function getUnique (list) {
    var filteredList = [];
    for (var i = 0; i < list.length; i += 1) {
        if (filteredList.indexOf(list[i]) === -1) {
            filteredList.push(list[i]);
        }
    }
    return filteredList;
}

function getUniqueFilter (list) {
    list = Array.prototype.slice.call(list); // если нам пришел масивоподобній робїект
    return list.filter(function (elm, i, list) {
        return list.indexOf(elm) === i;
    });
}

console.log(getUnique(['a', 'b', 'b', 'a']));
console.log(getUniqueFilter(['a', 'b', 'b', 'a']));
console.log(getUniqueFilter({0: "test", 1: "foo", 2: "test", length: 3})); // масивоподобный объект
console.log('================================================');

/*
 Реализовать счетчик, сокрыв детали реализации

 Написать функцию createSummator(initialValue), с опциональным (необязательным) первым параметром, который является
 точкой отчета счетчика. Если аргумент initialValue не передан, то отчет начинается с 0. При каждом вызове функция
 возвращает объект с методами inc(num), dec(num), get(). Объектов, которые возвращает функция
 createSummator(initialValue), может быть любое количество.

 Реализация должна позволять манипуляции со значением счетчика только с использованием этих методов:
 - Вызов метода inc(num) увеличивает значение счетчика на значение аргумента num. Если метод вызван без аргумента, то значение счетчика увеличивается на 1
 - Вызов метода dec(num) уменьшает значение счетчика на значение num, если метод вызван с аргументом. Если метод вызван без аргумента, то значение счетчика уменьшается на 1
 - Вызов метода get() возвращает текущее значение счетчика.
 */

function createSummator () {

    var counter = 0;

    if (arguments[0] !== undefined) {
        counter = arguments[0];
    }

    return {
        inc: function () {
            (arguments[0] !== undefined) ? counter += arguments[0] : counter += 1;
        },
        dec: function () {
            (arguments[0] !== undefined) ? counter -= arguments[0] : counter -= 1;
        },
        get: function () {
            return counter;
        }
    };
}

var s1 = createSummator();
s1.inc();
s1.inc();
s1.inc();
console.log(s1.get()); // 3

var s2 = createSummator(10);
s2.inc(2);
s2.inc(3);
s2.inc(4);
console.log(s2.get()); // 19

var s3 = createSummator(5);
s3.inc(5);
s3.dec(10);
console.log(s3.get()); // 0
console.log('==============================================');

/*
 Отфильтровать элементы массива с нечетным индексом
 Реализовать функцию extractOddItems(arr), которая возвращает новый массив, в котором содержатся только те элементы,
 которые обладали нечетным индексом в массиве, переданном в качестве аргумента.
 Пример работы:
 extractOddItems([0,1,0,1,0,1]); // [1,1,1]
 extractOddItems([1,2,3,4,5]); [2, 4]
 */
function extractOddItems (arr) {
    return arr.filter(function (item, key) {
        return key % 2 !== 0
    });
}

console.log(extractOddItems([0,1,0,1,0,1]));
console.log(extractOddItems([1,2,3,4,5]));