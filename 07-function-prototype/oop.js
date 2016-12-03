/*
 * mixin (примесь) - альтернатива множественному наследованию, которого в JS нет.
 * Это независимые элементы, которые могут быть подмешаны в любой из объектов, расширяя его функциональность
 */
// helper для расширения объектов
Object.extend = function (destination, source) {
    for (var property in source) if (source.hasOwnProperty(property)) {
        destination[property] = source[property];
    }
    return destination;
};

var X = {a: 10, b: 20};
var Y = {c: 30, d: 40};

console.log('X:', X);
console.log('Y:', Y);

Object.extend(X, Y);
console.log(X);