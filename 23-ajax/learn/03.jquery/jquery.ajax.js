(function ($) {

    /** Загрузка HTML кода в необходимый нам DOM элемент */
    $('#example').load('ajax/example.html');


    /** Основной метод, а все последующие методы лишь обертки */
    $.ajax({
        // params
        async: '',          // — асинхронность запроса, по умолчанию true
        cache: '',          // — вкл/выкл кэширование данных браузером, по умолчанию true
        contentType: '',    // — по умолчанию «application/x-www-form-urlencoded»
        data: '',           // — передаваемые данные — строка иль объект
        dataFilter: '',     // — фильтр для входных данных
        dataType: '',       // — тип данных возвращаемых в callback функцию (xml, html, script, json, text, _default)
        global: '',         // — тригер — отвечает за использование глобальных AJAX Event'ов, по умолчанию true
        ifModified: '',     // — тригер — проверяет были ли изменения в ответе сервера, дабы не слать еще запрос, по умолчанию false
        jsonp: '',          // — переустановить имя callback функции для работы с JSONP (по умолчанию генерируется на лету)
        processData: '',    // — по умолчанию отправляемые данный заворачиваются в объект, и отправляются как «application/x-www-form-urlencoded», если надо иначе — отключаем
        scriptCharset: '',  // — кодировочка — актуально для JSONP и подгрузки JavaScript'ов
        timeout: '',        // — время таймаут в миллисекундах
        type: '',           // — GET либо POST
        url: '',            // — url запрашиваемой страницы

        // events

        // срабатывает перед отправкой запроса
        beforeSend: function () {
        },

        // если произошла ошибка
        error: function () {
        },

        // если ошибок не возникло
        success: function (data, textStatus) {
        },

        // срабатывает по окончанию запроса
        complete: function () {
        }
    });


    /** Загружает страницу, используя для передачи данных GET/POST запрос */
    $.get('url', {data: ''}, function successCallback (data, textStatus, jqXHR) {
        // ...
    }, 'json');

    $.post('ajax/example.xml', {data: ''}, function successCallback (data, textStatus, jqXHR) { // загрузку XML из файла example.xml
        // ...
    }, 'xml');                                      // указываем явно тип данных


    /** Загружает данные в формате JSON */
    $.getJSON('url', {data: ''}, function successCallback (data, textStatus, jqXHR) {
        // ...
    });


    /** Load a JavaScript file from the server using a GET HTTP request, then execute it. */
    $.getScript('url', function successCallback () {
        // ...
    });

    /**
     * Ajax Events:
     *
     * ajaxStart    — Данный метод вызывается в случае когда побежал AJAX запрос, и при этом других запросов нету
     * beforeSend   — Срабатывает до отправки запроса, позволяет редактировать XMLHttpRequest. Локальное событие
     * ajaxSend     — Срабатывает до отправки запроса, аналогично beforeSend
     * success      — Срабатывает по возвращению ответа, когда нет ошибок ни сервера, ни вернувшихся данных. Локальное событие
     * ajaxSuccess  — Срабатывает по возвращению ответа, аналогично success
     * error        — Срабатывает в случае ошибки. Локальное событие
     * ajaxError    — Срабатывает в случае ошибки
     * complete     — Срабатывает по завершению текущего AJAX запроса (с ошибкои или без — срабатывает всегда).Локальное событие
     * ajaxComplete — Глобальное событие, аналогичное complete
     * ajaxStop     — Данный метод вызывается в случае когда больше нету активных запросов
     */

    /** Example: loading spinner */
    $("#loading").bind("ajaxSend", function () {
        $(this).show(); // показываем элемент
    }).bind("ajaxComplete", function () {
        $(this).hide(); // скрываем элемент
    });

}(jQuery));
