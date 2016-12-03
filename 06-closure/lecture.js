function sayHi (person) {

    function getHallo (age) {
        return (age > 18) ? 'Здраствуйте' : 'Привет';
    }

    function makeMessage (person) {
        return getHallo(person.age) + ', ' + person.name + '!';
    }

    return function () {
        console.log(makeMessage(person));
    };
}

var sayHiPete = sayHi({
    name: 'Петя',
    age: 17
});

var sayHiOther = sayHi({
    name: 'Василий Петрович',
    age: 59
});

sayHiPete();
sayHiOther();

/*
 * Shadowing - перекрытие переменных из scopeChain (цепочки области видимости)
 */
function outer (a, b) {
    var args = arguments;
    function inner () {
        var a = 10;
        console.log('inner:', a, args);
    }
    inner();
    console.log('outer:', a);
}

outer(100500);