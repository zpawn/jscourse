/**
 * (c) 2016 FF.ua. Lev Boyko, Ilya M.
 */

function forEach (array, action) {
    for (var i = 0; i < array.length; i += 1) {
        action(array[i]);
    }
}
function log (val) {
    console.log(val);
}
function warn (val) {
    console.warn(val);
}
forEach(['Тили', 'Мили', 'Трямли'], log);
forEach(['Тили', 'Мили', 'Трямли'], warn);

// like as anonymous function
forEach(['one', 'two', 'three'], function (val) {
    console.log(val);
});