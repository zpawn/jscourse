(function () {
    "use strict";

    var STATE_READY = 4,
        endpoint = '/jscourse.local/23-ajax/lecture/template.html',
        request = new XMLHttpRequest();

    request.open('get', endpoint, true);
    request.onreadystatechange = function () {

        var div = document.createElement('div'),
            insertPoint = document.getElementById('header');

        if (request.readyState === STATE_READY) {
            div.innerHTML = request.responseText;
            insertPoint.parentNode.insertBefore(div.querySelector('#list'), insertPoint);
        }
    };
    request.send();
}());
