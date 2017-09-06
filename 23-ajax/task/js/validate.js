(function () {
    'use strict';

    function validator () {

        return {
            isEmail: function (email) {
                return /.+@.+\..+/g.test(email);
            },

            isPhone: function (value) {
                return /^\+\d{12}$/g.test(value);
            },

            isShort: function (value) {
                return /^.{0,4}$/g.test(value);
            },

            /** Простой пароль (только числа, только буквы) */
            isSimple: function (value) {
                return /^(\d)+$/g.test(value) || /^[a-zA-Z]+$/g.test(value);
            },

            /** Пароль содержит запрещенные символы (разрешенные - латинские буквы, цифры, подчеркивание, минус) */
            isForbiddenChars: function (value) {
                return /[^\w-_]+/g.test(value);
            },

            isChecked: function (value) {
                return value.checked;
            },

            isBlank: function (string) {
                return string === "";
            },

            emailIsSet: function (findEmail) {

                var STATE_READY = 4,
                    endpoint = 'https://aqueous-reaches-8130.herokuapp.com/check-email/?email=' + findEmail,
                    request = new XMLHttpRequest(),
                    response;

                request.open('get', endpoint, false);
                request.onreadystatechange = function () {
                    if (request.readyState === STATE_READY) {
                        response = JSON.parse(request.responseText);
                    }
                };
                request.send();
                return response.used;
            },

            trim: function (string) {
                return (string) ? string.replace(/^\s+|\s+$/g, '') : string
            }
        }
    }

    window.validator = validator();
}());
