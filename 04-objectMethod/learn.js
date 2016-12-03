/**
 * (c) 2016 FF.ua. Lev Boyko, Ilya M.
 */

/*
 * @see http://learn.javascript.ru/arguments-pseudoarray
 * How check arguments in function for undefined
 */
function func (x) {

    if (x !== undefined) {
        console.log(1);
    } else {
        console.log(0);
    }
    // or short
    console.log(arguments[0] ? 1 : 0);
}

func(12);
func(undefined);
func();
console.log('===================================');

/*
 * function sum
 */
function sum () {

    var sum = 0;
    for (var i = 0; i < arguments.length; i += 1) {
        sum += arguments[i];
    }
    return sum;
}

console.log(sum());
console.log(sum(1));
console.log(sum(1, 2));
console.log(sum(1, 2, 3));
console.log(sum(1, 2, 3, 4));
console.log('===================================');

/*
 * @see http://dmitrysoshnikov.com/ecmascript/ru-chapter-5-functions/
 */
var foo = {
    bar: function (choose) {
        return (choose % 2 != 0) ? 'yes' : 'no';
    }(3)
};
console.log(foo.bar);
