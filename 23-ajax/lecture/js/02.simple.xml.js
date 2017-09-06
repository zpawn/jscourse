(function () {
    "use strict";

    var STATE_READY = 4,
        url = '/jscourse.local/23-ajax/lecture/users.xml',
        request = new XMLHttpRequest();

    request.open('get', url, true);
    request.onreadystatechange = function () {
        var xmlParser = new DOMParser();
        if (request.readyState === STATE_READY) {
            var xml = xmlParser.parseFromString(request.responseText, 'application/xml');
            console.log('xml:', xml.querySelectorAll('user'));
        }
    };
    request.send();
}());
