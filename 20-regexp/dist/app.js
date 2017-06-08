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
                console.log('check isChecked');
            },

            isBlank: function (string) {
                return string === "";
            },

            emailIsSet: function (findEmail, emails) {
                return emails.find(function (email) {
                    return email === findEmail;
                });
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
            if (!elm.checked) {
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
 */

(function () {
    var infoForm = new FormHandler('infoForm');
    var emails = ['author@mail.com', 'foo@mail.com', 'tester@mail.com'];
}());
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZhbGlkYXRlLmpzIiwiRm9ybUhhbmRsZXIuanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRvciAoKSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlzRW1haWw6IGZ1bmN0aW9uIChlbWFpbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAvLitALitcXC4uKy9nLnRlc3QoZW1haWwpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaXNQaG9uZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC9eXFwrXFxkezEyfSQvZy50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGlzU2hvcnQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAvXi57MCw0fSQvZy50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKiDQn9GA0L7RgdGC0L7QuSDQv9Cw0YDQvtC70YwgKNGC0L7Qu9GM0LrQviDRh9C40YHQu9CwLCDRgtC+0LvRjNC60L4g0LHRg9C60LLRiykgKi9cbiAgICAgICAgICAgIGlzU2ltcGxlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gL14oXFxkKSskL2cudGVzdCh2YWx1ZSkgfHwgL15bYS16QS1aXSskL2cudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKiog0J/QsNGA0L7Qu9GMINGB0L7QtNC10YDQttC40YIg0LfQsNC/0YDQtdGJ0LXQvdC90YvQtSDRgdC40LzQstC+0LvRiyAo0YDQsNC30YDQtdGI0LXQvdC90YvQtSAtINC70LDRgtC40L3RgdC60LjQtSDQsdGD0LrQstGLLCDRhtC40YTRgNGLLCDQv9C+0LTRh9C10YDQutC40LLQsNC90LjQtSwg0LzQuNC90YPRgSkgKi9cbiAgICAgICAgICAgIGlzRm9yYmlkZGVuQ2hhcnM6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAvW15cXHctX10rL2cudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpc0NoZWNrZWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGVjayBpc0NoZWNrZWQnKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGlzQmxhbms6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nID09PSBcIlwiO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW1haWxJc1NldDogZnVuY3Rpb24gKGZpbmRFbWFpbCwgZW1haWxzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVtYWlscy5maW5kKGZ1bmN0aW9uIChlbWFpbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW1haWwgPT09IGZpbmRFbWFpbDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHRyaW06IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHN0cmluZykgPyBzdHJpbmcucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpIDogc3RyaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudmFsaWRhdG9yID0gdmFsaWRhdG9yKCk7XG59KCkpO1xuIiwiKGZ1bmN0aW9uICh3aW5kb3csIHZhbGlkYXRvcikge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIEZvcm1IYW5kbGVyIChmb3JtSWQpIHtcbiAgICAgICAgdmFyIGYgPSB0aGlzO1xuICAgICAgICBmLl9mb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZm9ybUlkKTtcbiAgICAgICAgZi5fZm9jdXNlZEVsbSA9IHt9O1xuICAgICAgICBmLl9mb2N1c2VkVGltZW91dElkID0gMDtcbiAgICAgICAgZi5fbm90aWZpY2F0aW9uID0gZi5fY3JlYXRlTm90aWZpY2F0aW9uKCk7XG4gICAgICAgIGYuX2Vycm9ycyA9IFtdO1xuXG4gICAgICAgIC8vLy9cblxuICAgICAgICBmLl9ldmVudExpc3RlbmVyKCk7XG5cbiAgICAgICAgcmV0dXJuIGY7XG4gICAgfVxuXG4gICAgRm9ybUhhbmRsZXIucHJvdG90eXBlLl9ldmVudExpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1cy5iaW5kKHRoaXMpLCB0cnVlKTtcbiAgICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fb25CbHVyLmJpbmQodGhpcyksIHRydWUpO1xuICAgICAgICB0aGlzLl9mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fb25LZXl1cC5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5fb25TdWJtaXQuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX29uRm9jdXMgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLl9mb2N1c2VkRWxtID0gZS50YXJnZXQ7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9mb2N1c2VkVGltZW91dElkKTtcbiAgICB9O1xuXG4gICAgRm9ybUhhbmRsZXIucHJvdG90eXBlLl9vbkJsdXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLl9mb2N1c2VkRWxtID0ge307XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9mb2N1c2VkVGltZW91dElkKTtcbiAgICB9O1xuXG4gICAgRm9ybUhhbmRsZXIucHJvdG90eXBlLl9vbktleXVwID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ZvY3VzZWRFbG0udmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbGlkYXRlRmllbGRzKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRm9ybUhhbmRsZXIucHJvdG90eXBlLl9vblN1Ym1pdCA9IGZ1bmN0aW9uIChlKSB7XG5cbiAgICAgICAgdmFyIGYgPSB0aGlzLFxuICAgICAgICAgICAgZmllbGRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fZm9ybS5lbGVtZW50cywgMCk7XG5cbiAgICAgICAgZmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGVsbSkge1xuICAgICAgICAgICAgZi5fY2hlY2tGaWVsZChlbG0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBmLl9tYXJrRXJyb3JzKCk7XG5cbiAgICAgICAgaWYgKGYuX2Vycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmb3JtIHN1Ym1pdGVkJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRm9ybUhhbmRsZXIucHJvdG90eXBlLl92YWxpZGF0ZUZpZWxkcyA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiAodGhpcy5fZm9jdXNlZFRpbWVvdXRJZCAhPT0gMCkgY2xlYXJUaW1lb3V0KHRoaXMuX2ZvY3VzZWRUaW1lb3V0SWQpO1xuXG4gICAgICAgIHRoaXMuX2NsZWFyRXJyb3JzKCk7XG5cbiAgICAgICAgdGhpcy5fZm9jdXNlZFRpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuX2NoZWNrRmllbGQodGhpcy5fZm9jdXNlZEVsbSk7XG4gICAgICAgICAgICB0aGlzLl9tYXJrRXJyb3JzKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgNzUwKTtcbiAgICB9O1xuXG4gICAgRm9ybUhhbmRsZXIucHJvdG90eXBlLl9jaGVja0ZpZWxkID0gZnVuY3Rpb24gKGVsbSkge1xuXG4gICAgICAgIHZhciBfID0gdmFsaWRhdG9yLFxuICAgICAgICAgICAgdmFsdWUgPSBfLnRyaW0oZWxtLnZhbHVlKTtcblxuICAgICAgICBpZiAoZWxtLmNsYXNzTGlzdC5jb250YWlucygnanMtcmVxdWlyZWQnKSkge1xuICAgICAgICAgICAgaWYgKF8uaXNCbGFuayh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGVsbTogZWxtLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn0J/QvtC70LUsINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQuiDQt9Cw0L/QvtC70L3QtdC90LjRjiDQvdC1INC30LDQv9C+0LvQvdC10L3QvidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1lbWFpbCcpKSB7XG4gICAgICAgICAgICBpZiAoIV8uaXNCbGFuayh2YWx1ZSkgJiYgIV8uaXNFbWFpbCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGVsbTogZWxtLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn0J7RiNC40LHQutCwINCyIGVtYWlsLdC1J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5lbWFpbElzU2V0KHZhbHVlLCB0aGlzLl9nZXRFbWFpbHMoKSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGVsbTogZWxtLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnZW1haWwg0YPQttC1INC30LDQvdGP0YInXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxtLmNsYXNzTGlzdC5jb250YWlucygnanMtcGFzc3dvcmQnKSkge1xuXG4gICAgICAgICAgICBpZiAoXy5pc1Nob3J0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZWxtOiBlbG0sXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQn9Cw0YDQvtC70Ywg0YHQu9C40YjQutC+0Lwg0LrQvtGA0L7RgtC+0LogKNC00L4gNSDRgdC40LzQstC+0LvQvtCyKSdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKF8uaXNTaW1wbGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsbTogZWxtLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ9Cf0YDQvtGB0YLQvtC5INC/0LDRgNC+0LvRjCAo0YLQvtC70YzQutC+INGH0LjRgdC70LAsINGC0L7Qu9GM0LrQviDQsdGD0LrQstGLKSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKF8uaXNGb3JiaWRkZW5DaGFycyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxtOiBlbG0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn0J/QsNGA0L7Qu9GMINGB0L7QtNC10YDQttC40YIg0LfQsNC/0YDQtdGJ0LXQvdC90YvQtSDRgdC40LzQstC+0LvRiyAo0YDQsNC30YDQtdGI0LXQvdC90YvQtSAtINC70LDRgtC40L3RgdC60LjQtSDQsdGD0LrQstGLLCDRhtC40YTRgNGLLCDQv9C+0LTRh9C10YDQutC40LLQsNC90LjQtSwg0LzQuNC90YPRgSknXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1waG9uZScpKSB7XG4gICAgICAgICAgICBpZiAoIV8uaXNQaG9uZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGVsbTogZWxtLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn0JzQtdC20LTRg9C90LDRgNC+0LTQvdGL0Lkg0YTQvtGA0LzQsNGCINC30LDQv9C40YHQuCDRgtC10LvQtdGE0L7QvdCwINC90LUg0LLRi9C00LXRgNC20LDQvSdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1hZ3JlZScpKSB7XG4gICAgICAgICAgICBpZiAoIWVsbS5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBlbG06IGVsbSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ9CT0LDQu9C+0YfQutCwIFwi0KHQvtCz0LvQsNGB0LXQvSDRgdC+INCy0YHQtdC8XCIg0L3QtSDQv9C+0YHRgtCw0LLQu9C10L3QsCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX2NyZWF0ZU5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vdGlmaWNhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBub3RpZmljYXRpb24uY2xhc3NOYW1lID0gJ2FsZXJ0IGFsZXJ0LWRhbmdlcic7XG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb247XG4gICAgfTtcblxuICAgIEZvcm1IYW5kbGVyLnByb3RvdHlwZS5fbWFya0Vycm9ycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGYgPSB0aGlzO1xuICAgICAgICB0aGlzLl9lcnJvcnMuZm9yRWFjaChmdW5jdGlvbiAoZmllbGQsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgbm90aWZpY2F0aW9uID0gZi5fbm90aWZpY2F0aW9uLmNsb25lTm9kZShmYWxzZSk7XG4gICAgICAgICAgICBub3RpZmljYXRpb24uaW5uZXJUZXh0ID0gZmllbGQubWVzc2FnZTtcblxuICAgICAgICAgICAgZi5fZXJyb3JzW2luZGV4XVsnbm90aWZpY2F0aW9uJ10gPSBub3RpZmljYXRpb247XG5cbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBmLl9maW5kUGFyZW50KGZpZWxkLmVsbSwgJ2Zvcm0tZ3JvdXAnKTtcblxuICAgICAgICAgICAgcGFyZW50LmNsYXNzTGlzdC5hZGQoJ2hhcy1lcnJvcicpO1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKG5vdGlmaWNhdGlvbik7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX2ZpbmRQYXJlbnQgPSBmdW5jdGlvbiAoZWxtLCBzZWxlY3Rvcikge1xuICAgICAgICB2YXIgcGFyZW50ID0gZWxtLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHdoaWxlICghcGFyZW50LmNsYXNzTGlzdC5jb250YWlucyhzZWxlY3RvcikpIHtcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgfTtcblxuICAgIEZvcm1IYW5kbGVyLnByb3RvdHlwZS5fY2xlYXJFcnJvcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmID0gdGhpcztcbiAgICAgICAgdGhpcy5fZXJyb3JzLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgICAgICAgICBmaWVsZC5lbG0ucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKTtcbiAgICAgICAgICAgIGZpZWxkLm5vdGlmaWNhdGlvbi5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGYuX2Vycm9ycyA9IFtdO1xuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX2dldEVtYWlscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFsnYXV0aG9yQG1haWwuY29tJywgJ2Zvb0BtYWlsLmNvbScsICd0ZXN0ZXJAbWFpbC5jb20nXTtcbiAgICB9O1xuXG4gICAgd2luZG93LkZvcm1IYW5kbGVyID0gRm9ybUhhbmRsZXI7XG59KHdpbmRvdywgd2luZG93LnZhbGlkYXRvcikpOyIsIi8qXG4g0KDQtdC70LjQt9C+0LLQsNGC0Ywg0LLQsNC70LjQtNCw0YbQuNGOINGE0L7RgNC80YsuINCS0LDQu9C40LTQuNGA0L7QstCw0YLRjCDQv9C+0LvRjyDRhNC+0YDQvNGLINC90LDQtNC+INCyINC/0YDQvtGG0LXRgdGB0LUg0L3QsNCx0L7RgNCwICjQvdC+INC90LUg0L/QvtC60LDQt9GL0LLQsNGC0Ywg0L7RiNC40LHQutC4INC00L4g0YLQvtCz0L4sINC60LDQulxuINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDRh9GC0L4t0YLQviDQstCy0LXQuykuINCk0L7RgNC80YMg0L3QtdC70YzQt9GPINC80L7Rh9GMINC+0YLQv9GA0LDQstC40YLRjCwg0LXRgdC70Lgg0LXRgdGC0Ywg0L7RiNC40LHQutC4LiDQldGB0LvQuCDQv9C+0LrQsNC30LDQvdGLINC+0YjQuNCx0LrQuCwg0LrQvdC+0L/QutCwINC+0YLQv9GA0LDQstC60LhcbiDRhNC+0YDQvNGLINC00L7Qu9C20L3QsCDQsdGL0YLRjCDQvdC10LDQutGC0LjQstC90L7QuSAo0LrQvtC0INC90LXQsNC60YLQuNCy0L3QvtC5INC60L3QvtC/0LrQuCDQt9Cw0LrQvtC80LzQtdC90YLQuNGA0L7QstCw0L0pLiDQn9C+0LvRjywg0L7QsdGP0LfQsNGC0LXQu9GM0L3Ri9C1INC6INC30LDQv9C+0LvQvdC10L3QuNGOINC/0L7QvNC10YfQtdC90Ysg0LfQstC10LfQtNC+0YfQutCw0LzQuC5cbiDQn9C+0LvRjyDRgSDQvtGI0LjQsdC60L7QuSDQtNC+0LvQttC90Ysg0L/QvtC00YHQstC10YfQuNCy0LDRgtGM0YHRjyDQtNC+0LvQttC90YvQvCDQvtCx0YDQsNC30L7QvCAo0LrQvtGC0L7RgNGL0Lkg0LzQvtC20L3QviDRg9Cy0LjQtNC10YLRjCwg0YDQsNGB0LrQvtC80LzQtdC90YLQuNGA0L7QstCw0LIg0LrQvtC0INC90LAg0LHRg9GC0YHRgtGA0LDQvyDRgdGC0YDQsNC90LjRhtC1KS5cbiDQktGB0LUg0YDQtdCz0YPQu9GP0YDQutC4INC00L7Qu9C20L3RiyDQsdGL0YLRjCDQvdCw0L/QuNGB0LDQvdGLINGB0LDQvNC+0YHRgtC+0Y/RgtC10LvRjNC90L4uXG5cbiDQktC+0LfQvNC+0LbQvdGL0LUg0L7RiNC40LHQvtGH0L3Ri9C1INGB0LjRgtGD0LDRhtC40LguINCU0LvRjyDQutCw0LbQtNC+0Lkg0L/RgNC40LTRg9C80LDRgtGMINC4INCy0YvQstC+0LTQuNGC0Ywg0L/QvtGP0YHQvdGP0Y7RidC10LUg0YHQvtC+0LHRidC10L3QuNC1LiDQmNC3INGB0L7QvtCx0YnQtdC90LjRjyDQtNC+0LvQttC90L4g0LHRi9GC0Ywg0Y/RgdC90L4g0LJcbiDRh9C10Lwg0L/RgNC+0LHQu9C10LzQsC4g0JLQsNGA0LjQsNC90YLRiyAoXCLRh9GC0L4t0YLQviDQvdC1INGC0LDQulwiKSDQvdC1INC40YHQv9C+0LvRjNC30L7QstCw0YLRjC5cbiAxLiDQn9C+0LvQtSwg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC6INC30LDQv9C+0LvQvdC10L3QuNGOINC90LUg0LfQsNC/0L7Qu9C90LXQvdC+XG4gMi4g0J7RiNC40LHQutCwINCyIGVtYWlsLdC1XG4gMy4gZW1haWwg0YPQttC1INC30LDQvdGP0YIgKNGB0LLQtdGA0Y/RgtGM0YHRjyDRgdC+INGB0YLQsNGC0LjRh9C10YHQutC40Lwg0YHQv9C40YHQutC+0LwgZW1haWwt0L7Qsiwg0LrQvtGC0L7RgNGL0Lkg0YXQvtGA0LDQvdC40YLRgdGPINC90LAg0LPQu9C+0LHQsNC70YzQvdC+0Lwg0YPRgNC+0LLQvdC1INCyINC/0LXRgNC10LzQtdC90L3QvtC5IHVzZWRFbWFpbHMpXG4gWydhdXRob3JAbWFpbC5jb20nLCAnZm9vQG1haWwuY29tJywgJ3Rlc3RlckBtYWlsLmNvbSddXG4gNC4g0J/QsNGA0L7Qu9GMINGB0LvQuNGI0LrQvtC8INC60L7RgNC+0YLQvtC6ICjQtNC+IDUg0YHQuNC80LLQvtC70L7QsilcbiA1LiDQn9GA0L7RgdGC0L7QuSDQv9Cw0YDQvtC70YwgKNGC0L7Qu9GM0LrQviDRh9C40YHQu9CwLCDRgtC+0LvRjNC60L4g0LHRg9C60LLRiylcbiA2LiDQn9Cw0YDQvtC70Ywg0YHQvtC00LXRgNC20LjRgiDQt9Cw0L/RgNC10YnQtdC90L3Ri9C1INGB0LjQvNCy0L7Qu9GLICjRgNCw0LfRgNC10YjQtdC90L3Ri9C1IC0g0LvQsNGC0LjQvdGB0LrQuNC1INCx0YPQutCy0YssINGG0LjRhNGA0YssINC/0L7QtNGH0LXRgNC60LjQstCw0L3QuNC1LCDQvNC40L3Rg9GBKVxuIDcuINCc0LXQttC00YPQvdCw0YDQvtC00L3Ri9C5INGE0L7RgNC80LDRgiDQt9Cw0L/QuNGB0Lgg0YLQtdC70LXRhNC+0L3QsCDQvdC1INCy0YvQtNC10YDQttCw0L1cbiA4LiDQk9Cw0LvQvtGH0LrQsCBcItCh0L7Qs9C70LDRgdC10L0g0YHQviDQstGB0LXQvFwiINC90LUg0L/QvtGB0YLQsNCy0LvQtdC90LBcblxuINCg0LXRiNC10L3QuNC1INC00L7Qu9C20L3QviDRgNCw0LHQvtGC0LDRgtGMINCyINC40LU5K1xuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGluZm9Gb3JtID0gbmV3IEZvcm1IYW5kbGVyKCdpbmZvRm9ybScpO1xuICAgIHZhciBlbWFpbHMgPSBbJ2F1dGhvckBtYWlsLmNvbScsICdmb29AbWFpbC5jb20nLCAndGVzdGVyQG1haWwuY29tJ107XG59KCkpOyJdfQ==
