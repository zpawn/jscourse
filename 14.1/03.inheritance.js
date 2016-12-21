console.log('*** Inheritance ***');

var obj = {};   // new Object();
console.dir(obj);

obj.toString;

Object.prototype.toString = function () {
    //
};

// ...

function F () {}

var f = new F();
console.dir(f);

// ...

/**
Реализовать класс на прототипах
 */

function Sequence (arr) {
    this._current = 0;
    this._arr = arr;
}

Sequence.prototype.go = function () {};

Sequence.prototype.next = function () {};

Sequence.prototype.prev = function () {};

var s = new Sequence([{name: 'Manya'}, {name:'Valya'}]);

console.dir(s);

s.next();   // {name:'Valya'}

/**
 * 
 */
function UberArray (items) {
    if (items) {
        for (var i = 0; i < items.length; i +=1) {
            this.push(items[i]);
        }
    }
}

UberArray.prototype = Object.create(Array.prototype);

UberArray.prototype.shuffle = function () {
    this.sort(function () {
        return Math.random() > 0.5;
    });
};

var arr = new UberArray([1,2,3,4,5,6]);

arr.filter(function (item) {
    return item % 2;
});

arr.shuffle();

console.log(arr);

/**
 * if 'Object.create'' not exist, we create analog
 */
function derive (obj) {
    function f () {}
    f.prototype = obj;
    return new f();
}