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

(function (window, validator) {
    'use strict';

    function FormHandler (formId) {
        var f = this;
        f._form = document.getElementById(formId);
        f._focusedElm = {};
        f._focusedTimeoutId = 0;
        f._notification = f._createNotification();
        f._errors = [];

        ////

        f._eventListener();

        return f;
    }

    FormHandler.prototype._eventListener = function () {
        this._form.addEventListener('focus', this._onFocus.bind(this), true);
        this._form.addEventListener('blur', this._onBlur.bind(this), true);
        this._form.addEventListener('keyup', this._onKeyup.bind(this), false);
        this._form.addEventListener('submit', this._onSubmit.bind(this), false);
    };

    FormHandler.prototype._onFocus = function (e) {
        this._focusedElm = e.target;
        clearTimeout(this._focusedTimeoutId);
    };

    FormHandler.prototype._onBlur = function (e) {
        this._focusedElm = {};
        clearTimeout(this._focusedTimeoutId);
    };

    FormHandler.prototype._onKeyup = function (e) {
        if (this._focusedElm.value) {
            this._validateFields();
        }
    };

    FormHandler.prototype._onSubmit = function (e) {

        var f = this,
            fields = Array.prototype.slice.call(this._form.elements, 0);

        fields.forEach(function (elm) {
            f._checkField(elm);
        });

        f._markErrors();

        if (f._errors.length) {
            e.preventDefault();
        } else {
            console.log('form submited');
        }
    };

    FormHandler.prototype._validateFields = function () {

        if (this._focusedTimeoutId !== 0) clearTimeout(this._focusedTimeoutId);

        this._clearErrors();

        this._focusedTimeoutId = window.setTimeout(function () {
            this._checkField(this._focusedElm);
            this._markErrors();
        }.bind(this), 750);
    };

    FormHandler.prototype._checkField = function (elm) {

        var _ = validator,
            value = _.trim(elm.value);

        if (elm.classList.contains('js-required')) {
            if (_.isBlank(value)) {
                this._errors.push({
                    elm: elm,
                    message: 'Поле, обязательное к заполнению не заполнено'
                });
            }
        }

        if (elm.classList.contains('js-email')) {
            if (!_.isBlank(value) && !_.isEmail(value)) {
                this._errors.push({
                    elm: elm,
                    message: 'Ошибка в email-е'
                });
            }

            if (_.emailIsSet(value, this._getEmails())) {
                this._errors.push({
                    elm: elm,
                    message: 'email уже занят'
                });
            }
        }

        if (elm.classList.contains('js-password')) {

            if (_.isShort(value)) {
                this._errors.push({
                    elm: elm,
                    message: 'Пароль слишком короток (до 5 символов)'
                });
            } else {
                if (_.isSimple(value)) {
                    this._errors.push({
                        elm: elm,
                        message: 'Простой пароль (только числа, только буквы)'
                    });
                }

                if (_.isForbiddenChars(value)) {
                    this._errors.push({
                        elm: elm,
                        message: 'Пароль содержит запрещенные символы (разрешенные - латинские буквы, цифры, подчеркивание, минус)'
                    });
                }
            }
        }

        if (elm.classList.contains('js-phone')) {
            if (!_.isPhone(value)) {
                this._errors.push({
                    elm: elm,
                    message: 'Международный формат записи телефона не выдержан'
                });
            }
        }

        if (elm.classList.contains('js-agree')) {
            if (!_.isChecked(elm)) {
                this._errors.push({
                    elm: elm,
                    message: 'Галочка "Согласен со всем" не поставлена'
                });
            }
        }
    };

    FormHandler.prototype._createNotification = function () {
        var notification = document.createElement('div');
        notification.className = 'alert alert-danger';
        return notification;
    };

    FormHandler.prototype._markErrors = function () {
        var f = this;
        this._errors.forEach(function (field, index) {
            var notification = f._notification.cloneNode(false);
            notification.innerText = field.message;

            f._errors[index]['notification'] = notification;

            var parent = f._findParent(field.elm, 'form-group');

            parent.classList.add('has-error');
            parent.appendChild(notification);
        });
    };

    FormHandler.prototype._findParent = function (elm, selector) {
        var parent = elm.parentElement;
        while (!parent.classList.contains(selector)) {
            parent = parent.parentElement;
        }
        return parent;
    };

    FormHandler.prototype._clearErrors = function () {
        var f = this;
        this._errors.forEach(function (field) {
            field.elm.parentElement.classList.remove('has-error');
            field.notification.remove();
        });
        f._errors = [];
    };

    FormHandler.prototype._getEmails = function () {
        return ['author@mail.com', 'foo@mail.com', 'tester@mail.com'];
    };

    window.FormHandler = FormHandler;
}(window, window.validator));

/*
 Релизовать валидацию формы. Валидировать поля формы надо в процессе набора (но не показывать ошибки до того, как
 пользователь что-то ввел). Форму нельзя мочь отправить, если есть ошибки. Если показаны ошибки, кнопка отправки
 формы должна быть неактивной (код неактивной кнопки закомментирован). Поля, обязательные к заполнению помечены звездочками.
 Поля с ошибкой должны подсвечиваться должным образом (который можно увидеть, раскомментировав код на бутстрап странице).
 Все регулярки должны быть написаны самостоятельно.

 Возможные ошибочные ситуации. Для каждой придумать и выводить поясняющее сообщение. Из сообщения должно быть ясно в
 чем проблема. Варианты ("что-то не так") не использовать.
 1. Поле, обязательное к заполнению не заполнено
 2. Ошибка в email-е
 3. email уже занят (сверяться со статическим списком email-ов, который хоранится на глобальном уровне в переменной usedEmails)
 ['author@mail.com', 'foo@mail.com', 'tester@mail.com']
 4. Пароль слишком короток (до 5 символов)
 5. Простой пароль (только числа, только буквы)
 6. Пароль содержит запрещенные символы (разрешенные - латинские буквы, цифры, подчеркивание, минус)
 7. Международный формат записи телефона не выдержан
 8. Галочка "Согласен со всем" не поставлена

 Решение должно работать в ие9+

 Добавить к заданию с валидацией формы серверную валидацию email-а (использован ли он). Запрос с валидацией емейла
 слать на сервер https://aqueous-reaches-8130.herokuapp.com (я разрешил кроссдоменные запросы для этого сервера).
 jQuery использовать нельзя, синхронные запросы использовать нельзя. В папку с заданием положить все файлы формы.

 */

(function () {
    var infoForm = new FormHandler('infoForm');
}());

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZhbGlkYXRlLmpzIiwiRm9ybUhhbmRsZXIuanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0b3IgKCkge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpc0VtYWlsOiBmdW5jdGlvbiAoZW1haWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLy4rQC4rXFwuLisvZy50ZXN0KGVtYWlsKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGlzUGhvbmU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAvXlxcK1xcZHsxMn0kL2cudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpc1Nob3J0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gL14uezAsNH0kL2cudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKiog0J/RgNC+0YHRgtC+0Lkg0L/QsNGA0L7Qu9GMICjRgtC+0LvRjNC60L4g0YfQuNGB0LvQsCwg0YLQvtC70YzQutC+INCx0YPQutCy0YspICovXG4gICAgICAgICAgICBpc1NpbXBsZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC9eKFxcZCkrJC9nLnRlc3QodmFsdWUpIHx8IC9eW2EtekEtWl0rJC9nLnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqINCf0LDRgNC+0LvRjCDRgdC+0LTQtdGA0LbQuNGCINC30LDQv9GA0LXRidC10L3QvdGL0LUg0YHQuNC80LLQvtC70YsgKNGA0LDQt9GA0LXRiNC10L3QvdGL0LUgLSDQu9Cw0YLQuNC90YHQutC40LUg0LHRg9C60LLRiywg0YbQuNGE0YDRiywg0L/QvtC00YfQtdGA0LrQuNCy0LDQvdC40LUsINC80LjQvdGD0YEpICovXG4gICAgICAgICAgICBpc0ZvcmJpZGRlbkNoYXJzOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gL1teXFx3LV9dKy9nLnRlc3QodmFsdWUpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaXNDaGVja2VkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuY2hlY2tlZDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGlzQmxhbms6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nID09PSBcIlwiO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW1haWxJc1NldDogZnVuY3Rpb24gKGZpbmRFbWFpbCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIFNUQVRFX1JFQURZID0gNCxcbiAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnQgPSAnaHR0cHM6Ly9hcXVlb3VzLXJlYWNoZXMtODEzMC5oZXJva3VhcHAuY29tL2NoZWNrLWVtYWlsLz9lbWFpbD0nICsgZmluZEVtYWlsLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCksXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlO1xuXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vcGVuKCdnZXQnLCBlbmRwb2ludCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09PSBTVEFURV9SRUFEWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnVzZWQ7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB0cmltOiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKSA6IHN0cmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnZhbGlkYXRvciA9IHZhbGlkYXRvcigpO1xufSgpKTtcbiIsIihmdW5jdGlvbiAod2luZG93LCB2YWxpZGF0b3IpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBGb3JtSGFuZGxlciAoZm9ybUlkKSB7XG4gICAgICAgIHZhciBmID0gdGhpcztcbiAgICAgICAgZi5fZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZvcm1JZCk7XG4gICAgICAgIGYuX2ZvY3VzZWRFbG0gPSB7fTtcbiAgICAgICAgZi5fZm9jdXNlZFRpbWVvdXRJZCA9IDA7XG4gICAgICAgIGYuX25vdGlmaWNhdGlvbiA9IGYuX2NyZWF0ZU5vdGlmaWNhdGlvbigpO1xuICAgICAgICBmLl9lcnJvcnMgPSBbXTtcblxuICAgICAgICAvLy8vXG5cbiAgICAgICAgZi5fZXZlbnRMaXN0ZW5lcigpO1xuXG4gICAgICAgIHJldHVybiBmO1xuICAgIH1cblxuICAgIEZvcm1IYW5kbGVyLnByb3RvdHlwZS5fZXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuX29uRm9jdXMuYmluZCh0aGlzKSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX29uQmx1ci5iaW5kKHRoaXMpLCB0cnVlKTtcbiAgICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX29uS2V5dXAuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgICAgICB0aGlzLl9mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMuX29uU3VibWl0LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICB9O1xuXG4gICAgRm9ybUhhbmRsZXIucHJvdG90eXBlLl9vbkZvY3VzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdGhpcy5fZm9jdXNlZEVsbSA9IGUudGFyZ2V0O1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fZm9jdXNlZFRpbWVvdXRJZCk7XG4gICAgfTtcblxuICAgIEZvcm1IYW5kbGVyLnByb3RvdHlwZS5fb25CbHVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdGhpcy5fZm9jdXNlZEVsbSA9IHt9O1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fZm9jdXNlZFRpbWVvdXRJZCk7XG4gICAgfTtcblxuICAgIEZvcm1IYW5kbGVyLnByb3RvdHlwZS5fb25LZXl1cCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLl9mb2N1c2VkRWxtLnZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl92YWxpZGF0ZUZpZWxkcygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEZvcm1IYW5kbGVyLnByb3RvdHlwZS5fb25TdWJtaXQgPSBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgIHZhciBmID0gdGhpcyxcbiAgICAgICAgICAgIGZpZWxkcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2Zvcm0uZWxlbWVudHMsIDApO1xuXG4gICAgICAgIGZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChlbG0pIHtcbiAgICAgICAgICAgIGYuX2NoZWNrRmllbGQoZWxtKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZi5fbWFya0Vycm9ycygpO1xuXG4gICAgICAgIGlmIChmLl9lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZm9ybSBzdWJtaXRlZCcpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEZvcm1IYW5kbGVyLnByb3RvdHlwZS5fdmFsaWRhdGVGaWVsZHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX2ZvY3VzZWRUaW1lb3V0SWQgIT09IDApIGNsZWFyVGltZW91dCh0aGlzLl9mb2N1c2VkVGltZW91dElkKTtcblxuICAgICAgICB0aGlzLl9jbGVhckVycm9ycygpO1xuXG4gICAgICAgIHRoaXMuX2ZvY3VzZWRUaW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGVja0ZpZWxkKHRoaXMuX2ZvY3VzZWRFbG0pO1xuICAgICAgICAgICAgdGhpcy5fbWFya0Vycm9ycygpO1xuICAgICAgICB9LmJpbmQodGhpcyksIDc1MCk7XG4gICAgfTtcblxuICAgIEZvcm1IYW5kbGVyLnByb3RvdHlwZS5fY2hlY2tGaWVsZCA9IGZ1bmN0aW9uIChlbG0pIHtcblxuICAgICAgICB2YXIgXyA9IHZhbGlkYXRvcixcbiAgICAgICAgICAgIHZhbHVlID0gXy50cmltKGVsbS52YWx1ZSk7XG5cbiAgICAgICAgaWYgKGVsbS5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLXJlcXVpcmVkJykpIHtcbiAgICAgICAgICAgIGlmIChfLmlzQmxhbmsodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBlbG06IGVsbSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ9Cf0L7Qu9C1LCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0Log0LfQsNC/0L7Qu9C90LXQvdC40Y4g0L3QtSDQt9Cw0L/QvtC70L3QtdC90L4nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxtLmNsYXNzTGlzdC5jb250YWlucygnanMtZW1haWwnKSkge1xuICAgICAgICAgICAgaWYgKCFfLmlzQmxhbmsodmFsdWUpICYmICFfLmlzRW1haWwodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBlbG06IGVsbSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ9Ce0YjQuNCx0LrQsCDQsiBlbWFpbC3QtSdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8uZW1haWxJc1NldCh2YWx1ZSwgdGhpcy5fZ2V0RW1haWxzKCkpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBlbG06IGVsbSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ2VtYWlsINGD0LbQtSDQt9Cw0L3Rj9GCJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsbS5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLXBhc3N3b3JkJykpIHtcblxuICAgICAgICAgICAgaWYgKF8uaXNTaG9ydCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGVsbTogZWxtLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn0J/QsNGA0L7Qu9GMINGB0LvQuNGI0LrQvtC8INC60L7RgNC+0YLQvtC6ICjQtNC+IDUg0YHQuNC80LLQvtC70L7QsiknXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChfLmlzU2ltcGxlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lcnJvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbG06IGVsbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQn9GA0L7RgdGC0L7QuSDQv9Cw0YDQvtC70YwgKNGC0L7Qu9GM0LrQviDRh9C40YHQu9CwLCDRgtC+0LvRjNC60L4g0LHRg9C60LLRiyknXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChfLmlzRm9yYmlkZGVuQ2hhcnModmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsbTogZWxtLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ9Cf0LDRgNC+0LvRjCDRgdC+0LTQtdGA0LbQuNGCINC30LDQv9GA0LXRidC10L3QvdGL0LUg0YHQuNC80LLQvtC70YsgKNGA0LDQt9GA0LXRiNC10L3QvdGL0LUgLSDQu9Cw0YLQuNC90YHQutC40LUg0LHRg9C60LLRiywg0YbQuNGE0YDRiywg0L/QvtC00YfQtdGA0LrQuNCy0LDQvdC40LUsINC80LjQvdGD0YEpJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxtLmNsYXNzTGlzdC5jb250YWlucygnanMtcGhvbmUnKSkge1xuICAgICAgICAgICAgaWYgKCFfLmlzUGhvbmUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBlbG06IGVsbSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ9Cc0LXQttC00YPQvdCw0YDQvtC00L3Ri9C5INGE0L7RgNC80LDRgiDQt9Cw0L/QuNGB0Lgg0YLQtdC70LXRhNC+0L3QsCDQvdC1INCy0YvQtNC10YDQttCw0L0nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxtLmNsYXNzTGlzdC5jb250YWlucygnanMtYWdyZWUnKSkge1xuICAgICAgICAgICAgaWYgKCFfLmlzQ2hlY2tlZChlbG0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBlbG06IGVsbSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ9CT0LDQu9C+0YfQutCwIFwi0KHQvtCz0LvQsNGB0LXQvSDRgdC+INCy0YHQtdC8XCIg0L3QtSDQv9C+0YHRgtCw0LLQu9C10L3QsCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX2NyZWF0ZU5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vdGlmaWNhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBub3RpZmljYXRpb24uY2xhc3NOYW1lID0gJ2FsZXJ0IGFsZXJ0LWRhbmdlcic7XG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb247XG4gICAgfTtcblxuICAgIEZvcm1IYW5kbGVyLnByb3RvdHlwZS5fbWFya0Vycm9ycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGYgPSB0aGlzO1xuICAgICAgICB0aGlzLl9lcnJvcnMuZm9yRWFjaChmdW5jdGlvbiAoZmllbGQsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgbm90aWZpY2F0aW9uID0gZi5fbm90aWZpY2F0aW9uLmNsb25lTm9kZShmYWxzZSk7XG4gICAgICAgICAgICBub3RpZmljYXRpb24uaW5uZXJUZXh0ID0gZmllbGQubWVzc2FnZTtcblxuICAgICAgICAgICAgZi5fZXJyb3JzW2luZGV4XVsnbm90aWZpY2F0aW9uJ10gPSBub3RpZmljYXRpb247XG5cbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBmLl9maW5kUGFyZW50KGZpZWxkLmVsbSwgJ2Zvcm0tZ3JvdXAnKTtcblxuICAgICAgICAgICAgcGFyZW50LmNsYXNzTGlzdC5hZGQoJ2hhcy1lcnJvcicpO1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX2ZpbmRQYXJlbnQgPSBmdW5jdGlvbiAoZWxtLCBzZWxlY3Rvcikge1xuICAgICAgICB2YXIgcGFyZW50ID0gZWxtLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHdoaWxlICghcGFyZW50LmNsYXNzTGlzdC5jb250YWlucyhzZWxlY3RvcikpIHtcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgfTtcblxuICAgIEZvcm1IYW5kbGVyLnByb3RvdHlwZS5fY2xlYXJFcnJvcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmID0gdGhpcztcbiAgICAgICAgdGhpcy5fZXJyb3JzLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgICAgICAgICBmaWVsZC5lbG0ucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKTtcbiAgICAgICAgICAgIGZpZWxkLm5vdGlmaWNhdGlvbi5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGYuX2Vycm9ycyA9IFtdO1xuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX2dldEVtYWlscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFsnYXV0aG9yQG1haWwuY29tJywgJ2Zvb0BtYWlsLmNvbScsICd0ZXN0ZXJAbWFpbC5jb20nXTtcbiAgICB9O1xuXG4gICAgd2luZG93LkZvcm1IYW5kbGVyID0gRm9ybUhhbmRsZXI7XG59KHdpbmRvdywgd2luZG93LnZhbGlkYXRvcikpO1xuIiwiLypcbiDQoNC10LvQuNC30L7QstCw0YLRjCDQstCw0LvQuNC00LDRhtC40Y4g0YTQvtGA0LzRiy4g0JLQsNC70LjQtNC40YDQvtCy0LDRgtGMINC/0L7Qu9GPINGE0L7RgNC80Ysg0L3QsNC00L4g0LIg0L/RgNC+0YbQtdGB0YHQtSDQvdCw0LHQvtGA0LAgKNC90L4g0L3QtSDQv9C+0LrQsNC30YvQstCw0YLRjCDQvtGI0LjQsdC60Lgg0LTQviDRgtC+0LPQviwg0LrQsNC6XG4g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINGH0YLQvi3RgtC+INCy0LLQtdC7KS4g0KTQvtGA0LzRgyDQvdC10LvRjNC30Y8g0LzQvtGH0Ywg0L7RgtC/0YDQsNCy0LjRgtGMLCDQtdGB0LvQuCDQtdGB0YLRjCDQvtGI0LjQsdC60LguINCV0YHQu9C4INC/0L7QutCw0LfQsNC90Ysg0L7RiNC40LHQutC4LCDQutC90L7Qv9C60LAg0L7RgtC/0YDQsNCy0LrQuFxuINGE0L7RgNC80Ysg0LTQvtC70LbQvdCwINCx0YvRgtGMINC90LXQsNC60YLQuNCy0L3QvtC5ICjQutC+0LQg0L3QtdCw0LrRgtC40LLQvdC+0Lkg0LrQvdC+0L/QutC4INC30LDQutC+0LzQvNC10L3RgtC40YDQvtCy0LDQvSkuINCf0L7Qu9GPLCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdGL0LUg0Log0LfQsNC/0L7Qu9C90LXQvdC40Y4g0L/QvtC80LXRh9C10L3RiyDQt9Cy0LXQt9C00L7Rh9C60LDQvNC4LlxuINCf0L7Qu9GPINGBINC+0YjQuNCx0LrQvtC5INC00L7Qu9C20L3RiyDQv9C+0LTRgdCy0LXRh9C40LLQsNGC0YzRgdGPINC00L7Qu9C20L3Ri9C8INC+0LHRgNCw0LfQvtC8ICjQutC+0YLQvtGA0YvQuSDQvNC+0LbQvdC+INGD0LLQuNC00LXRgtGMLCDRgNCw0YHQutC+0LzQvNC10L3RgtC40YDQvtCy0LDQsiDQutC+0LQg0L3QsCDQsdGD0YLRgdGC0YDQsNC/INGB0YLRgNCw0L3QuNGG0LUpLlxuINCS0YHQtSDRgNC10LPRg9C70Y/RgNC60Lgg0LTQvtC70LbQvdGLINCx0YvRgtGMINC90LDQv9C40YHQsNC90Ysg0YHQsNC80L7RgdGC0L7Rj9GC0LXQu9GM0L3Qvi5cblxuINCS0L7Qt9C80L7QttC90YvQtSDQvtGI0LjQsdC+0YfQvdGL0LUg0YHQuNGC0YPQsNGG0LjQuC4g0JTQu9GPINC60LDQttC00L7QuSDQv9GA0LjQtNGD0LzQsNGC0Ywg0Lgg0LLRi9Cy0L7QtNC40YLRjCDQv9C+0Y/RgdC90Y/RjtGJ0LXQtSDRgdC+0L7QsdGJ0LXQvdC40LUuINCY0Lcg0YHQvtC+0LHRidC10L3QuNGPINC00L7Qu9C20L3QviDQsdGL0YLRjCDRj9GB0L3QviDQslxuINGH0LXQvCDQv9GA0L7QsdC70LXQvNCwLiDQktCw0YDQuNCw0L3RgtGLIChcItGH0YLQvi3RgtC+INC90LUg0YLQsNC6XCIpINC90LUg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMLlxuIDEuINCf0L7Qu9C1LCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0Log0LfQsNC/0L7Qu9C90LXQvdC40Y4g0L3QtSDQt9Cw0L/QvtC70L3QtdC90L5cbiAyLiDQntGI0LjQsdC60LAg0LIgZW1haWwt0LVcbiAzLiBlbWFpbCDRg9C20LUg0LfQsNC90Y/RgiAo0YHQstC10YDRj9GC0YzRgdGPINGB0L4g0YHRgtCw0YLQuNGH0LXRgdC60LjQvCDRgdC/0LjRgdC60L7QvCBlbWFpbC3QvtCyLCDQutC+0YLQvtGA0YvQuSDRhdC+0YDQsNC90LjRgtGB0Y8g0L3QsCDQs9C70L7QsdCw0LvRjNC90L7QvCDRg9GA0L7QstC90LUg0LIg0L/QtdGA0LXQvNC10L3QvdC+0LkgdXNlZEVtYWlscylcbiBbJ2F1dGhvckBtYWlsLmNvbScsICdmb29AbWFpbC5jb20nLCAndGVzdGVyQG1haWwuY29tJ11cbiA0LiDQn9Cw0YDQvtC70Ywg0YHQu9C40YjQutC+0Lwg0LrQvtGA0L7RgtC+0LogKNC00L4gNSDRgdC40LzQstC+0LvQvtCyKVxuIDUuINCf0YDQvtGB0YLQvtC5INC/0LDRgNC+0LvRjCAo0YLQvtC70YzQutC+INGH0LjRgdC70LAsINGC0L7Qu9GM0LrQviDQsdGD0LrQstGLKVxuIDYuINCf0LDRgNC+0LvRjCDRgdC+0LTQtdGA0LbQuNGCINC30LDQv9GA0LXRidC10L3QvdGL0LUg0YHQuNC80LLQvtC70YsgKNGA0LDQt9GA0LXRiNC10L3QvdGL0LUgLSDQu9Cw0YLQuNC90YHQutC40LUg0LHRg9C60LLRiywg0YbQuNGE0YDRiywg0L/QvtC00YfQtdGA0LrQuNCy0LDQvdC40LUsINC80LjQvdGD0YEpXG4gNy4g0JzQtdC20LTRg9C90LDRgNC+0LTQvdGL0Lkg0YTQvtGA0LzQsNGCINC30LDQv9C40YHQuCDRgtC10LvQtdGE0L7QvdCwINC90LUg0LLRi9C00LXRgNC20LDQvVxuIDguINCT0LDQu9C+0YfQutCwIFwi0KHQvtCz0LvQsNGB0LXQvSDRgdC+INCy0YHQtdC8XCIg0L3QtSDQv9C+0YHRgtCw0LLQu9C10L3QsFxuXG4g0KDQtdGI0LXQvdC40LUg0LTQvtC70LbQvdC+INGA0LDQsdC+0YLQsNGC0Ywg0LIg0LjQtTkrXG5cbiDQlNC+0LHQsNCy0LjRgtGMINC6INC30LDQtNCw0L3QuNGOINGBINCy0LDQu9C40LTQsNGG0LjQtdC5INGE0L7RgNC80Ysg0YHQtdGA0LLQtdGA0L3Rg9GOINCy0LDQu9C40LTQsNGG0LjRjiBlbWFpbC3QsCAo0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvSDQu9C4INC+0L0pLiDQl9Cw0L/RgNC+0YEg0YEg0LLQsNC70LjQtNCw0YbQuNC10Lkg0LXQvNC10LnQu9CwXG4g0YHQu9Cw0YLRjCDQvdCwINGB0LXRgNCy0LXRgCBodHRwczovL2FxdWVvdXMtcmVhY2hlcy04MTMwLmhlcm9rdWFwcC5jb20gKNGPINGA0LDQt9GA0LXRiNC40Lsg0LrRgNC+0YHRgdC00L7QvNC10L3QvdGL0LUg0LfQsNC/0YDQvtGB0Ysg0LTQu9GPINGN0YLQvtCz0L4g0YHQtdGA0LLQtdGA0LApLlxuIGpRdWVyeSDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0L3QtdC70YzQt9GPLCDRgdC40L3RhdGA0L7QvdC90YvQtSDQt9Cw0L/RgNC+0YHRiyDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0Ywg0L3QtdC70YzQt9GPLiDQkiDQv9Cw0L/QutGDINGBINC30LDQtNCw0L3QuNC10Lwg0L/QvtC70L7QttC40YLRjCDQstGB0LUg0YTQsNC50LvRiyDRhNC+0YDQvNGLLlxuXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5mb0Zvcm0gPSBuZXcgRm9ybUhhbmRsZXIoJ2luZm9Gb3JtJyk7XG59KCkpO1xuIl19
