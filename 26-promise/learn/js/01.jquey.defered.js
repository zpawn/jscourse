(function ($) {
    "use strict";

    /** Consistent Execution */
    $.ajax('http://echo.jsontest.com/id/1')
        .then(function (result) {
            console.log('consistent', JSON.stringify(result));
            return $.ajax('http://echo.jsontest.com/id/2')
        }).then(function (result) {
            console.log('consistent:', JSON.stringify(result));
            return $.ajax('http://echo.jsontest.com/id/3')
        }).then(function (result) {
            console.log('consistent:', JSON.stringify(result));
        });

    /** Parallel Execution */
    $.when(
        $.ajax('http://echo.jsontest.com/id/1'),
        $.ajax('http://echo.jsontest.com/id/2'),
        $.ajax('http://echo.jsontest.com/id/3')
    ).then(function (result1, result2, result3) {
        console.log('parallel:', JSON.stringify(result1[0]));
        console.log('parallel:', JSON.stringify(result2[0]));
        console.log('parallel:', JSON.stringify(result3[0]));
    });

    /** Consistent-Parallel Execution */
    $.ajax('http://echo.jsontest.com/id/1')
        .then(function (result1) {
            console.log('Consistent-Parallel:', JSON.stringify(result1));
            return $.when(
                $.ajax('http://echo.jsontest.com/id/2'),
                $.ajax('http://echo.jsontest.com/id/3'),
                $.ajax('http://echo.jsontest.com/id/4')
            )
        }).then(function (result2, result3, result4) {
            console.log('Consistent-Parallel:', JSON.stringify(result2[0]));
            console.log('Consistent-Parallel:', JSON.stringify(result3[0]));
            console.log('Consistent-Parallel:', JSON.stringify(result4[0]));
        }
    );

    // Параллельное выполнение неизвестного количества асинхронных операций
    var urls = ['http://echo.jsontest.com/id/1', 'http://echo.jsontest.com/id/2', 'http://echo.jsontest.com/id/3'],
        promises = $.map(urls, function (url) {
            return $.ajax(url).then(function (result) {
                console.log(JSON.stringify(result));
            });
        });

    $.when.apply(this, promises)
        .then(function () {
            console.log('done');
        });

    // Последовательное выполнение неизвестного количества асинхронных операций
    var urls = ['http://echo.jsontest.com/id/1', 'http://echo.jsontest.com/id/2', 'http://echo.jsontest.com/id/3'],
        promise = $.when();

    $.each(urls, function (index, url) {
        promise = promise
            .then(function () {
                return $.ajax(url);
            })
            .then(function (result) {
                console.log(JSON.stringify(result));
            });
    });

    promise.then(function () {
        console.log('OK');
    });

    // Простая обработка ошибок: один обработчик для всех операций
    $.ajax('http://echo.jsontest.com/id/1')
        .then(function () {
            console.log('OK 1');
            return $.ajax('http://echo.jsontest.com/id/2');
        })
        .then(function () {
            console.log('OK 2');
            return $.ajax('http://echo.jsontest.com/id/3')
        })
        .then(function () {
            console.log('OK 3');
            return $.ajax('http://echo.jsontest.com/id/4')
        })
        .then(function () {
            console.log('OK 4');
        }).fail(function () {
            console.log('error');
        });

    // Остановка выполнения цепочки после обработки ошибки
    $.ajax('http://echo.jsontest_fail.com/id/1')
        .then(function () {
            console.log('OK 1');
            return $.ajax('http://echo.jsontest.com/id/2');
        }, function () {
            console.log('error 1');
            return $.Deferred();
        }).then(function () {
            console.log('OK 2');
        }, function () {
            console.log('error 2');
        });

    // Продолжение выполнения цепочки после обработки ошибки
    $.ajax('http://echo.jsontest_fail.com/id/1')
        .then(function () {
            console.log('OK 1');
            return $.ajax('http://echo.jsontest.com/id/2');
        }, function () {
            console.log('error 1');
            return $.when();
        }).then(function () {
            console.log('OK 2');
        }, function () {
            console.log('error 2');
        })

}(jQuery));
