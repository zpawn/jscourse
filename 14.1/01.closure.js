console.log('*** Closure ***');

var a = 20;
var b = 50;

function f () {
    // ..., arguments
    var a = 30;
    console.log(a, b);
}

f();
console.log(a);

// ...

var cache = [];
function cachePush (arg) {
    cache.push(arg);
}
cachePush(10);
cachePush(20);
cachePush(30);
console.log(cache);

// ...

function createCounter () {
    var value = 0;
    return function () {
        value += 1;
        console.log(value);
    }
}

var c = createCounter();
c();
c();
c();
c();

var c2 = createCounter();
c2();
c2();
c2();
c2();

// NFE (Name Function Expresion)
var a = function fff () {
    ggg();
};
a();

var a = function () {
    ggg();
};
a();

[1,2,3,4,5,6,7].filter(function filterPrimes (num) {
    return isPrime(num);
});