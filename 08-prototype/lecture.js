//
// function
console.log('function:');
var position = {
    x: 0,
    y: 0
};
function walk (obj, x, y) {
    obj.x = x;
    obj.y = y;
}
function talk (obj) {
    console.log('I am at x: ' + obj.x + ', y: ' + obj.y);
}

walk(position, 10, 23);
talk(position);

//
// object property
console.log('object property:');
var position = {
    x: 0,
    y: 0,
    walk: function (x, y) {
        this.x += x || 0;
        this.y += y || 0;
    },
    talk: function () {
        console.log('I am at x: ' + this.x + ', y: ' + this.y);
    }
};
position.walk(10, 23);
position.talk();

//
// class instance
console.log('class instance:');
function createWalkyTalky (x, y) {
    return {
        x: x || 0,
        y: y || 0,
        walk: function (x, y) {
            this.x += x || 0;
            this.y += y || 0;
        },
        talk: function () {
            console.log('I am at x: ' + this.x + ', y: ' + this.y);
        }
    };
}

var pos1 = createWalkyTalky(50);
var pos2 = createWalkyTalky(12, 46);
pos1.talk();
pos2.walk(100, 10);
pos2.talk();
console.dir(pos1);

//
// Prototype v0.1
console.log('Prototype v0.1');
function createWalkyTalky2 (x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.walk = function (x, y) {
        this.x += x || 0;
        this.y += y || 0;
    };
    this.talk = function () {
        console.log('I am at x: ' + this.x + ', y: ' + this.y);
    }
}

var wt1 = new createWalkyTalky2();
var wt2 = new createWalkyTalky2(10, 20);

wt2.walk(10);

wt1.talk();
wt2.talk();
console.dir(wt1);

//
// Prototype
console.log('Prototype:');
function WalkyTalky (x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

WalkyTalky.prototype.walk = function (x, y) {
    this.x += x || 0;
    this.y += y ||0;
};

WalkyTalky.prototype.talk = function () {
    console.log('I am at x: ' + this.x + ', y: ' + this.y);
};

var wt1 = new WalkyTalky();
var wt2 = new WalkyTalky(10, 20);

wt2.walk(10);

wt1.talk();
wt2.talk();
console.dir(wt1);

/*
Создать массив из масивоподобного объекта
 */
function toArray (obj) {
    return [].slice().call(obj);
    // канонический пример
    return Array.prototype.slice().call(obj);
}

console.log('max:', Math.max(1,2,3,4,5,6,7,90,80));

var number = [1,2,3,4,5,6,7,90,80];
console.log('max:', Math.max.apply(Math, number));

/*
 Создать объект из массивов данных
 Реализовать функцию createObject(arrOfKeys, arrOfData), которая принимает аргументами два массива, и возвращает объект,
 в котором названия ключей это строки из массива arrOfKeys, а значения - элементы из массива arrOfData. В ключ, стоящий
 на первом месте массива arrOfKeys должно быть записано значение, стоящее на первом месте arrOfData. Если данных меньше,
 чем ключей, заполняй значения ключей как undefined. Пример работы:
 createObject(['foo'], ['bar']); // {foo: 'bar'}
 createObject(['foo', 'extra'], ['bar']); // {foo: 'bar', extra: undefined}
 */
console.log('==========================================');
function createObject (arrOfKey, arrOfData) {
    return arrOfKey.reduce(function (result, key, keyIndex) {
        result[key] = arrOfData[keyIndex];
        return result;
    }, {});
}


createObject([], []);
//createObject(['foo'], []);

/*
 Просуммировать числа из массива, которые больше 100
 Реализовать функцию sumOnly100Plus, которая принимает аргументом массив, и возвращает сумму всех чисел массива, которые
 больше 100. В массиве могут быть не только числовые данные, их никак не учитывать. Пример работы:
 sumOnly100Plus([150, "200", " ", 30, 300]); // 450
 */
console.log('=================================================');
function sumOnly100Plus (arr) {
    return arr.reduce(function (res, value) {
        if (typeof value === "number" && value > 100) {
            res += value;
        }
        return res;
    }, 0);
}