(function () {
    "use strict";

    /**
     * Simple request
     */
    var endpoint = '/jscourse.local/23-ajax/lecture/users.json';
    var request = new XMLHttpRequest();
    var STATE_READY = 4;
    request.open('get', endpoint, true);
    request.onreadystatechange = function () {
        console.log('readyState:', request.readyState);
        if (request.readyState === STATE_READY) {
            var res = JSON.parse(request.responseText);
            res.sort();
            console.log('json:', res);
        }
    };
    request.send();
}());
