/*
 Реализовать класс на прототипах
 Реализовать класс Sequence(arr). Конструктор принимает аргументом массив элементов. Имеет методы (описанные в прототипе)
 go, next, prev. Запоминает на каком элементе из массива сейчас находится "указатель".

 Метод go(index) возвращает элемент из массива с индексом index, или последний элемент массива, если index больше длины
 массива. Запоминает индекс возвращенного элемента. Метод next() возвращает следующий элемент из массива идущий за
 запомненным индексом, или первый элемент массива, если последний запомненный индекс - индекс последнего элемента.
 Метод prev() возвращает предыдущий элемент из массива идущий перед запомненным индексом, или последний элемент массива,
 если последний запомненный индекс - индекс первого элемента.

 var s1 = new Sequence(['one', 'two', 'three'])
 s1.go(2);  // 'three'
 s1.next(); // 'one'
 s1.next(); // 'two'

 var s2 = new Sequence([{name: 'Manya'}, {name:'Valya'}]);
 s2.go(100500); // {name: 'Valya'} последний элемент, так как индекс выходит за границы максимального
 s2.prev(); // {name: 'Manya'}
 s2.prev(); // {name: 'Valya'}
*/

function Sequence (items) {
//    this._items = items;
    this._items = Array.prototype.slice.call(items);
    this._index = 0;
}

Sequence.prototype.go = function (index) {
    if (index > this._items.length - 1) {
        index = this._items.length - 1
    }
    if (index < 0) {
        index = 0;
    }
    this._index = index;
    return this.currentItem();
};

Sequence.prototype.next = function () {
    if ( (this._index + 1) > this._items.length - 1) {
        this._index = 0;
    } else {
        this._index += 1;
    }
    this.currentItem();
};

Sequence.prototype.prev = function () {
    if ( this._index == 0 ) {
        this._index = this._items.length - 1
    } else {
        this._index -= 1;
    }
    this.currentItem();
};

Sequence.prototype.currentItem = function () {
    console.log(this._items[this._index]);
    return this._items[this._index];
};

var s1 = new Sequence(['one', 'two', 'three']);
s1.go(1);  // 'three'
s1.next(); // 'one'
s1.next(); // 'two'

var s2 = new Sequence([{name: 'Manya'}, {name:'Valya'}]);
s2.go(100500); // {name: 'Valya'} последний элемент, так как индекс выходит за границы максимального
s2.prev(); // {name: 'Manya'}
s2.prev(); // {name: 'Valya'}

var s3 = new Sequence([{name: 'Mila'}, {name: 'Sasha'}, {name: 'Elena'}, {name: 'Katya'}]);
s3.go(3);
s3.next(); // {name: 'Mila'}