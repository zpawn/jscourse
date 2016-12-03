var config = (function () {
    'use strict'

    var _config = {
        urlRoot: '/web/v1/'
    };

    return {
        get: function (constant) {
            return _config[constant];
        }
    };
}());

console.log(config.get('urlRoot'));