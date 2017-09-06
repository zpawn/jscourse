(function () {
    'use strict';

    /**
     * Props of XMLHttpRequest:
     *  timeout
     *  responseText
     *  responseXML
     *  status
     *  statusText
     *
     * const unsigned short UNSENT              = 0; // начальное состояние
     * const unsigned short OPENED              = 1; // вызван open
     * const unsigned short HEADERS_RECEIVED    = 2; // получены заголовки
     * const unsigned short LOADING             = 3; // загружается тело (получен очередной пакет данных)
     * const unsigned short DONE                = 4; // запрос завершён
     *
     * setRequestHeader(name, value)            - set request headers
     * xhr.setRequestHeader('Content-Type', 'application/json');
     *
     * xhr.getResponseHeader('Content-Type')    - return value of response headers
     * xhr.getAllResponseHeaders()              - return all headers
     *
     * Delay:
     *      xhr.timeout = 30000;                     - set timeout of request
     *      xhr.ontimeout = function() { ... }       - then handled timeout
     *
     * Other event:
     *      loadstart   – запрос начат.
     *      progress    – браузер получил очередной пакет данных, можно прочитать текущие полученные данные в responseText.
     *      abort       – запрос был отменён вызовом xhr.abort().
     *      error       – произошла ошибка.
     *      load        – запрос был успешно (без ошибок) завершён.
     *      timeout     – запрос был прекращён по таймауту.
     *      loadend     – запрос был завершён (успешно или неуспешно)
     */
    function loadPhones() {

        var xhr = new XMLHttpRequest();

        /** open(method, url, async, user, password) */
        xhr.open('GET', '//jsonplaceholder.typicode.com/users', true);

        /** send(body) */
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;

            button.innerHTML = 'Готово!';

            if (xhr.status !== 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                console.log(JSON.parse(xhr.responseText));
            }

        };

        button.innerHTML = 'Загружаю...';
        button.disabled = true;
    }

    window.loadPhones = loadPhones;
}());
