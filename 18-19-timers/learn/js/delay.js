(function () {
    function f(x) {
        alert( x );
    }

    function delay (f, ms) {
        return function () {
            var _this = this,
                args = arguments;

            setTimeout(function () {
                f.apply(_this, args);
            }, ms);
        }
    }

    var f1000 = delay(f, 1000);
    var f1500 = delay(f, 1500);

    f1000("тест"); // выведет "тест" через 1000 миллисекунд
    f1500("тест2"); // выведет "тест2" через 1500 миллисекунд
}());