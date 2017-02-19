(function () {
    'use strict';

    function Runner () {

        this.steps = 0;

        function fib(n) {
            return n <= 1 ? n : fib(n - 1) + fib(n - 2);
        }

        this.getSteps = function () {
            return this.steps;
        };

        this.step = function () {
            this.doSomethingHeavy();
            this.steps += 1;
        };

        this.doSomethingHeavy = function () {
            for (var i = 0; i < 25; i += 1) {
                this[i] = fib(i);
            }
        };
    }

    var runnerInterval = new Runner();
    var runnerTimeout = new Runner();

    // Запускаем бегунов
    var timerRunnerInterval = setInterval(function () {
        runnerInterval.step();
    }, 15);

    var timerRunnerTimeout = setTimeout(function go () {
        runnerTimeout.step();
        timerRunnerTimeout = setTimeout(go, 15);
    }, 15);

    // кто сделает больше шагов
    setTimeout(function () {
        clearInterval(timerRunnerInterval);
        clearTimeout(timerRunnerTimeout);
        console.log('runnerInterval:', runnerInterval.getSteps());
        console.log('runnerTimeout:', runnerTimeout.getSteps());
        console.timeEnd('finish')
    }, 5000);

    console.log('start...');
    console.time('finish');
}());