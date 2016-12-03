/*
 * Объединить несколько функций в одну.
 * Реализовать функцию compose, которая принимает аргументами любое количество функций, и возвращает функцию, которая
 * при вызове вызовет все функции, которые compose получила аргументом.
 */
function compose () {
    var arrayFunc = arguments;
    return function () {
        for (var j = 0; j < arrayFunc.length; j += 1) {
            arrayFunc[j]();
        }
    }
}

// Maximazer way
function maxiCompose () {
    // преобразуем массивоподобный объект в массив
    var args = Array.prototype.slice.call(arguments);
    return function () {
        args.forEach(function (funcToCall) {
            funcToCall();
        });
    }
}

function log1() {console.log(111)}
function log2() {console.log(222)}
function log3() {console.log(333)}

var logAll = compose(log1, log2, log3);
var maxiLogAll = maxiCompose(log1, log2, log3);
logAll();

var num = 10;
function inc() {num += 1}
var incComposed = compose(inc);
incComposed();
console.log(num);
console.log('================================================================');

/*
 * Реализовать простейший templater
 * Описать функцию templater(templateString, dataObj). Функция, принимает аргументом строку и объект. Заменяет все
 * вхождения подстрок вида ${STRING} значениями из объекта с ключом STRING.
 * Пример использования:
 *
templater('${who} ${action} ${what}', {
    who: 'mama',
    action: 'mila',
    what: 'ramu'
}); // 'mama mila ramu'
 */


function templater (_templateString, dataObj) {

    var templateString = '';
    templateString += _templateString;

    for (var key in dataObj) {

        if (dataObj.hasOwnProperty(key)) {

            var searchVal = '${' + key + '}';
            templateString = templateString.replace(searchVal, dataObj[key]);

            while (templateString.indexOf(searchVal) !== -1) {
                templateString = templateString.replace(searchVal, dataObj[key]);
            }
        }
    }
    return templateString;
}

// maximazer way
function maxiTemplater (templateString, dataObj) {
    var subStringToReplace;
    var dataToReplace;
    for (var key in dataObj) {
        if (dataObj.hasOwnProperty(key)) {
            subStringToReplace = '${'+ key +'}';
            dataToReplace = dataObj[key];
            while (templateString.indexOf(subStringToReplace) !== -1) {
                templateString = templateString.replace(subStringToReplace, dataToReplace);
            }
        }
    }
    return templateString;
}

var tpl1 = templater('${who} ${action} ${what}', {
    who: 'mama',
    action: 'mila',
    what: 'ramu'
});

var tpl2 = templater('user ${user} user ${user} user ${user}', {
    user: 'Fedot'
});

console.log(tpl1);
console.log(tpl2);

var maxiTpl1 = maxiTemplater('${who} ${action} ${what}', {
    who: 'mama',
    action: 'mila',
    what: 'ramu'
});

var maxiTpl2 = maxiTemplater('user ${user} user ${user} user ${user}', {
    user: 'Fedot'
});
console.log(maxiTpl1);
console.log(maxiTpl2);
console.log('===================================');

/*
 Релизовать функцию createKeeper(), которая возвращает объект с 2 методами put(key, value) и get(key). Метод get(key)
 должен возвращать данные, которые были сохранены с помощью метода put, если вызывается с тем-же значением key, что и put.
 Ключами могут быть как объекты, так и примитивы, про NaN не задумываться.Если put был вызван с таким ключом, с которым
 уже был вызван ранее, старое значение перезатирается новым. Доступ к ключам и значениями должен быть возможен только
 через методы put и get.
 */
function createKeeper () {

    var _obj = {};

    return {
        put: function (key, value) {
            _obj[key] = value;
        },
        get: function (key) {
            return (_obj.hasOwnProperty(key)) ? _obj[key] : null;
        }
    }
}

//var keeper = createKeeper();
//var key1 = {};
//var key2 = {};
//var key1Copy = key1;
//
//keeper.put(key1, 999);
//keeper.put(key2, [1,2,3]);
//console.log('999:', keeper.get(key1)); // 999
//console.log('[1,2,3]:', keeper.get(key2)); // [1,2,3]
//console.log('999:', keeper.get(key1Copy)); // 999
//console.log('null:', keeper.get({})); // null
//keeper.put(key1, key2);
//console.log('true:', keeper.get(key1Copy) === key2); // true

var keeper = createKeeper();
keeper.put({}, 999);
keeper.get({});

// maximazer way
function maxiCreateKeeper () {
    var keyValuePairs = [];

    function _getKeyValuePair (key) {
        for (var i = 0; i < keyValuePairs.length; i += 1) {
            if (keyValuePairs[i].key === key) {
                return keyValuePairs[i];
            }
        }
        return null;
    }

    return {
        put: function (key, value) {

            var savedKeyValuePair = _getKeyValuePair(key);

            if (savedKeyValuePair) {
                savedKeyValuePair.value = value;
            } else {
                keyValuePairs.push({
                    key: key,
                    value: value
                });
            }
        },
        get: function (key) {
            var savedKeyValuePair = _getKeyValuePair(key);
            if (savedKeyValuePair) {
                return savedKeyValuePair.value;
            } else {
                return null;
            }
        }
    }
}

function maxiCreateKeeperV2 () {
    var keys = [];
    var values = [];
    return {
        put: function (key, value) {
            debugger;
            var sameKeyIndex = keys.indexOf(key);
            if (sameKeyIndex === -1) {
                keys.push(key);
                values.push(value);
            } else {
                values[sameKeyIndex] = value;
            }
        },
        get: function (key) {
            debugger;
            var sameKeyIndex = keys.indexOf(key);
            if (sameKeyIndex === -1) {
                return null;
            } else {
                return values[sameKeyIndex];
            }
        }
    };
}

var keeper2 = maxiCreateKeeperV2();
var key = {};

keeper2.put(key, 100);
keeper2.put(key, 200);
console.log(keeper2.get(key));