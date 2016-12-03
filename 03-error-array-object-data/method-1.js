var str = 'halo world';
console.log(str.toUpperCase());

var num = 12.36;
num.toFixed(1); // 12.4
num.toFixed(5); // 12.36000

var obj1 = {value: 10};
var obj2 = obj1;
var obj3 = {value: 10};

console.log('obj1 == obj2:', obj1 == obj2);
console.log('obj1 == obj3:', obj1 == obj3);

obj1.value = 15;
console.log('obj2:', obj2);

function testArguments () {
    var countArg = arguments.length;
    console.log('countArg:', countArg);
    for (var i = 0; i < countArg; i += 1) {
        console.log(i, ':', arguments[i]);
    }
    console.log(arguments);
}

testArguments('hallo', 3);