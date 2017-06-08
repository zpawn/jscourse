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
 */

(function () {
    var infoForm = new FormHandler('infoForm');
    var emails = ['author@mail.com', 'foo@mail.com', 'tester@mail.com'];
}());
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZhbGlkYXRlLmpzIiwiRm9ybUhhbmRsZXIuanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRvciAoKSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlzRW1haWw6IGZ1bmN0aW9uIChlbWFpbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAvLitALitcXC4uKy9nLnRlc3QoZW1haWwpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaXNQaG9uZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC9eXFwrXFxkezEyfSQvZy50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGlzU2hvcnQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAvXi57MCw0fSQvZy50ZXN0KHZhbHVlKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKiDQn9GA0L7RgdGC0L7QuSDQv9Cw0YDQvtC70YwgKNGC0L7Qu9GM0LrQviDRh9C40YHQu9CwLCDRgtC+0LvRjNC60L4g0LHRg9C60LLRiykgKi9cbiAgICAgICAgICAgIGlzU2ltcGxlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gL14oXFxkKSskL2cudGVzdCh2YWx1ZSkgfHwgL15bYS16QS1aXSskL2cudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKiog0J/QsNGA0L7Qu9GMINGB0L7QtNC10YDQttC40YIg0LfQsNC/0YDQtdGJ0LXQvdC90YvQtSDRgdC40LzQstC+0LvRiyAo0YDQsNC30YDQtdGI0LXQvdC90YvQtSAtINC70LDRgtC40L3RgdC60LjQtSDQsdGD0LrQstGLLCDRhtC40YTRgNGLLCDQv9C+0LTRh9C10YDQutC40LLQsNC90LjQtSwg0LzQuNC90YPRgSkgKi9cbiAgICAgICAgICAgIGlzRm9yYmlkZGVuQ2hhcnM6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAvW15cXHctX10rL2cudGVzdCh2YWx1ZSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpc0NoZWNrZWQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5jaGVja2VkO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaXNCbGFuazogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmcgPT09IFwiXCI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbWFpbElzU2V0OiBmdW5jdGlvbiAoZmluZEVtYWlsLCBlbWFpbHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW1haWxzLmZpbmQoZnVuY3Rpb24gKGVtYWlsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbWFpbCA9PT0gZmluZEVtYWlsO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgdHJpbTogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiAoc3RyaW5nKSA/IHN0cmluZy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJykgOiBzdHJpbmdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy52YWxpZGF0b3IgPSB2YWxpZGF0b3IoKTtcbn0oKSk7XG4iLCIoZnVuY3Rpb24gKHdpbmRvdywgdmFsaWRhdG9yKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gRm9ybUhhbmRsZXIgKGZvcm1JZCkge1xuICAgICAgICB2YXIgZiA9IHRoaXM7XG4gICAgICAgIGYuX2Zvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmb3JtSWQpO1xuICAgICAgICBmLl9mb2N1c2VkRWxtID0ge307XG4gICAgICAgIGYuX2ZvY3VzZWRUaW1lb3V0SWQgPSAwO1xuICAgICAgICBmLl9ub3RpZmljYXRpb24gPSBmLl9jcmVhdGVOb3RpZmljYXRpb24oKTtcbiAgICAgICAgZi5fZXJyb3JzID0gW107XG5cbiAgICAgICAgLy8vL1xuXG4gICAgICAgIGYuX2V2ZW50TGlzdGVuZXIoKTtcblxuICAgICAgICByZXR1cm4gZjtcbiAgICB9XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX2V2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLl9vbkZvY3VzLmJpbmQodGhpcyksIHRydWUpO1xuICAgICAgICB0aGlzLl9mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl9vbkJsdXIuYmluZCh0aGlzKSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9vbktleXVwLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB0aGlzLl9vblN1Ym1pdC5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgfTtcblxuICAgIEZvcm1IYW5kbGVyLnByb3RvdHlwZS5fb25Gb2N1cyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzZWRFbG0gPSBlLnRhcmdldDtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2ZvY3VzZWRUaW1lb3V0SWQpO1xuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX29uQmx1ciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzZWRFbG0gPSB7fTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2ZvY3VzZWRUaW1lb3V0SWQpO1xuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX29uS2V5dXAgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGhpcy5fZm9jdXNlZEVsbS52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWRhdGVGaWVsZHMoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX29uU3VibWl0ID0gZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICB2YXIgZiA9IHRoaXMsXG4gICAgICAgICAgICBmaWVsZHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9mb3JtLmVsZW1lbnRzLCAwKTtcblxuICAgICAgICBmaWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZWxtKSB7XG4gICAgICAgICAgICBmLl9jaGVja0ZpZWxkKGVsbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGYuX21hcmtFcnJvcnMoKTtcblxuICAgICAgICBpZiAoZi5fZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2Zvcm0gc3VibWl0ZWQnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX3ZhbGlkYXRlRmllbGRzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGlmICh0aGlzLl9mb2N1c2VkVGltZW91dElkICE9PSAwKSBjbGVhclRpbWVvdXQodGhpcy5fZm9jdXNlZFRpbWVvdXRJZCk7XG5cbiAgICAgICAgdGhpcy5fY2xlYXJFcnJvcnMoKTtcblxuICAgICAgICB0aGlzLl9mb2N1c2VkVGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5fY2hlY2tGaWVsZCh0aGlzLl9mb2N1c2VkRWxtKTtcbiAgICAgICAgICAgIHRoaXMuX21hcmtFcnJvcnMoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCA3NTApO1xuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX2NoZWNrRmllbGQgPSBmdW5jdGlvbiAoZWxtKSB7XG5cbiAgICAgICAgdmFyIF8gPSB2YWxpZGF0b3IsXG4gICAgICAgICAgICB2YWx1ZSA9IF8udHJpbShlbG0udmFsdWUpO1xuXG4gICAgICAgIGlmIChlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1yZXF1aXJlZCcpKSB7XG4gICAgICAgICAgICBpZiAoXy5pc0JsYW5rKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZWxtOiBlbG0sXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQn9C+0LvQtSwg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC6INC30LDQv9C+0LvQvdC10L3QuNGOINC90LUg0LfQsNC/0L7Qu9C90LXQvdC+J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsbS5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLWVtYWlsJykpIHtcbiAgICAgICAgICAgIGlmICghXy5pc0JsYW5rKHZhbHVlKSAmJiAhXy5pc0VtYWlsKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZWxtOiBlbG0sXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQntGI0LjQsdC60LAg0LIgZW1haWwt0LUnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLmVtYWlsSXNTZXQodmFsdWUsIHRoaXMuX2dldEVtYWlscygpKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZWxtOiBlbG0sXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdlbWFpbCDRg9C20LUg0LfQsNC90Y/RgidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1wYXNzd29yZCcpKSB7XG5cbiAgICAgICAgICAgIGlmIChfLmlzU2hvcnQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBlbG06IGVsbSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ9Cf0LDRgNC+0LvRjCDRgdC70LjRiNC60L7QvCDQutC+0YDQvtGC0L7QuiAo0LTQviA1INGB0LjQvNCy0L7Qu9C+0LIpJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5pc1NpbXBsZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXJyb3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxtOiBlbG0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn0J/RgNC+0YHRgtC+0Lkg0L/QsNGA0L7Qu9GMICjRgtC+0LvRjNC60L4g0YfQuNGB0LvQsCwg0YLQvtC70YzQutC+INCx0YPQutCy0YspJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5pc0ZvcmJpZGRlbkNoYXJzKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lcnJvcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbG06IGVsbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQn9Cw0YDQvtC70Ywg0YHQvtC00LXRgNC20LjRgiDQt9Cw0L/RgNC10YnQtdC90L3Ri9C1INGB0LjQvNCy0L7Qu9GLICjRgNCw0LfRgNC10YjQtdC90L3Ri9C1IC0g0LvQsNGC0LjQvdGB0LrQuNC1INCx0YPQutCy0YssINGG0LjRhNGA0YssINC/0L7QtNGH0LXRgNC60LjQstCw0L3QuNC1LCDQvNC40L3Rg9GBKSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsbS5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLXBob25lJykpIHtcbiAgICAgICAgICAgIGlmICghXy5pc1Bob25lKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZWxtOiBlbG0sXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQnNC10LbQtNGD0L3QsNGA0L7QtNC90YvQuSDRhNC+0YDQvNCw0YIg0LfQsNC/0LjRgdC4INGC0LXQu9C10YTQvtC90LAg0L3QtSDQstGL0LTQtdGA0LbQsNC9J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsbS5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLWFncmVlJykpIHtcbiAgICAgICAgICAgIGlmICghXy5pc0NoZWNrZWQoZWxtKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZWxtOiBlbG0sXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfQk9Cw0LvQvtGH0LrQsCBcItCh0L7Qs9C70LDRgdC10L0g0YHQviDQstGB0LXQvFwiINC90LUg0L/QvtGB0YLQsNCy0LvQtdC90LAnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRm9ybUhhbmRsZXIucHJvdG90eXBlLl9jcmVhdGVOb3RpZmljYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub3RpZmljYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbm90aWZpY2F0aW9uLmNsYXNzTmFtZSA9ICdhbGVydCBhbGVydC1kYW5nZXInO1xuICAgICAgICByZXR1cm4gbm90aWZpY2F0aW9uO1xuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX21hcmtFcnJvcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmID0gdGhpcztcbiAgICAgICAgdGhpcy5fZXJyb3JzLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkLCBpbmRleCkge1xuICAgICAgICAgICAgdmFyIG5vdGlmaWNhdGlvbiA9IGYuX25vdGlmaWNhdGlvbi5jbG9uZU5vZGUoZmFsc2UpO1xuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmlubmVyVGV4dCA9IGZpZWxkLm1lc3NhZ2U7XG5cbiAgICAgICAgICAgIGYuX2Vycm9yc1tpbmRleF1bJ25vdGlmaWNhdGlvbiddID0gbm90aWZpY2F0aW9uO1xuXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gZi5fZmluZFBhcmVudChmaWVsZC5lbG0sICdmb3JtLWdyb3VwJyk7XG5cbiAgICAgICAgICAgIHBhcmVudC5jbGFzc0xpc3QuYWRkKCdoYXMtZXJyb3InKTtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChub3RpZmljYXRpb24pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgRm9ybUhhbmRsZXIucHJvdG90eXBlLl9maW5kUGFyZW50ID0gZnVuY3Rpb24gKGVsbSwgc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IGVsbS5wYXJlbnRFbGVtZW50O1xuICAgICAgICB3aGlsZSAoIXBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgIH07XG5cbiAgICBGb3JtSGFuZGxlci5wcm90b3R5cGUuX2NsZWFyRXJyb3JzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2Vycm9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgICAgICAgICAgZmllbGQuZWxtLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLWVycm9yJyk7XG4gICAgICAgICAgICBmaWVsZC5ub3RpZmljYXRpb24ucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBmLl9lcnJvcnMgPSBbXTtcbiAgICB9O1xuXG4gICAgRm9ybUhhbmRsZXIucHJvdG90eXBlLl9nZXRFbWFpbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBbJ2F1dGhvckBtYWlsLmNvbScsICdmb29AbWFpbC5jb20nLCAndGVzdGVyQG1haWwuY29tJ107XG4gICAgfTtcblxuICAgIHdpbmRvdy5Gb3JtSGFuZGxlciA9IEZvcm1IYW5kbGVyO1xufSh3aW5kb3csIHdpbmRvdy52YWxpZGF0b3IpKTsiLCIvKlxuINCg0LXQu9C40LfQvtCy0LDRgtGMINCy0LDQu9C40LTQsNGG0LjRjiDRhNC+0YDQvNGLLiDQktCw0LvQuNC00LjRgNC+0LLQsNGC0Ywg0L/QvtC70Y8g0YTQvtGA0LzRiyDQvdCw0LTQviDQsiDQv9GA0L7RhtC10YHRgdC1INC90LDQsdC+0YDQsCAo0L3QviDQvdC1INC/0L7QutCw0LfRi9Cy0LDRgtGMINC+0YjQuNCx0LrQuCDQtNC+INGC0L7Qs9C+LCDQutCw0LpcbiDQv9C+0LvRjNC30L7QstCw0YLQtdC70Ywg0YfRgtC+LdGC0L4g0LLQstC10LspLiDQpNC+0YDQvNGDINC90LXQu9GM0LfRjyDQvNC+0YfRjCDQvtGC0L/RgNCw0LLQuNGC0YwsINC10YHQu9C4INC10YHRgtGMINC+0YjQuNCx0LrQuC4g0JXRgdC70Lgg0L/QvtC60LDQt9Cw0L3RiyDQvtGI0LjQsdC60LgsINC60L3QvtC/0LrQsCDQvtGC0L/RgNCw0LLQutC4XG4g0YTQvtGA0LzRiyDQtNC+0LvQttC90LAg0LHRi9GC0Ywg0L3QtdCw0LrRgtC40LLQvdC+0LkgKNC60L7QtCDQvdC10LDQutGC0LjQstC90L7QuSDQutC90L7Qv9C60Lgg0LfQsNC60L7QvNC80LXQvdGC0LjRgNC+0LLQsNC9KS4g0J/QvtC70Y8sINC+0LHRj9C30LDRgtC10LvRjNC90YvQtSDQuiDQt9Cw0L/QvtC70L3QtdC90LjRjiDQv9C+0LzQtdGH0LXQvdGLINC30LLQtdC30LTQvtGH0LrQsNC80LguXG4g0J/QvtC70Y8g0YEg0L7RiNC40LHQutC+0Lkg0LTQvtC70LbQvdGLINC/0L7QtNGB0LLQtdGH0LjQstCw0YLRjNGB0Y8g0LTQvtC70LbQvdGL0Lwg0L7QsdGA0LDQt9C+0LwgKNC60L7RgtC+0YDRi9C5INC80L7QttC90L4g0YPQstC40LTQtdGC0YwsINGA0LDRgdC60L7QvNC80LXQvdGC0LjRgNC+0LLQsNCyINC60L7QtCDQvdCwINCx0YPRgtGB0YLRgNCw0L8g0YHRgtGA0LDQvdC40YbQtSkuXG4g0JLRgdC1INGA0LXQs9GD0LvRj9GA0LrQuCDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0L3QsNC/0LjRgdCw0L3RiyDRgdCw0LzQvtGB0YLQvtGP0YLQtdC70YzQvdC+LlxuXG4g0JLQvtC30LzQvtC20L3Ri9C1INC+0YjQuNCx0L7Rh9C90YvQtSDRgdC40YLRg9Cw0YbQuNC4LiDQlNC70Y8g0LrQsNC20LTQvtC5INC/0YDQuNC00YPQvNCw0YLRjCDQuCDQstGL0LLQvtC00LjRgtGMINC/0L7Rj9GB0L3Rj9GO0YnQtdC1INGB0L7QvtCx0YnQtdC90LjQtS4g0JjQtyDRgdC+0L7QsdGJ0LXQvdC40Y8g0LTQvtC70LbQvdC+INCx0YvRgtGMINGP0YHQvdC+INCyXG4g0YfQtdC8INC/0YDQvtCx0LvQtdC80LAuINCS0LDRgNC40LDQvdGC0YsgKFwi0YfRgtC+LdGC0L4g0L3QtSDRgtCw0LpcIikg0L3QtSDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0YwuXG4gMS4g0J/QvtC70LUsINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQuiDQt9Cw0L/QvtC70L3QtdC90LjRjiDQvdC1INC30LDQv9C+0LvQvdC10L3QvlxuIDIuINCe0YjQuNCx0LrQsCDQsiBlbWFpbC3QtVxuIDMuIGVtYWlsINGD0LbQtSDQt9Cw0L3Rj9GCICjRgdCy0LXRgNGP0YLRjNGB0Y8g0YHQviDRgdGC0LDRgtC40YfQtdGB0LrQuNC8INGB0L/QuNGB0LrQvtC8IGVtYWlsLdC+0LIsINC60L7RgtC+0YDRi9C5INGF0L7RgNCw0L3QuNGC0YHRjyDQvdCwINCz0LvQvtCx0LDQu9GM0L3QvtC8INGD0YDQvtCy0L3QtSDQsiDQv9C10YDQtdC80LXQvdC90L7QuSB1c2VkRW1haWxzKVxuIFsnYXV0aG9yQG1haWwuY29tJywgJ2Zvb0BtYWlsLmNvbScsICd0ZXN0ZXJAbWFpbC5jb20nXVxuIDQuINCf0LDRgNC+0LvRjCDRgdC70LjRiNC60L7QvCDQutC+0YDQvtGC0L7QuiAo0LTQviA1INGB0LjQvNCy0L7Qu9C+0LIpXG4gNS4g0J/RgNC+0YHRgtC+0Lkg0L/QsNGA0L7Qu9GMICjRgtC+0LvRjNC60L4g0YfQuNGB0LvQsCwg0YLQvtC70YzQutC+INCx0YPQutCy0YspXG4gNi4g0J/QsNGA0L7Qu9GMINGB0L7QtNC10YDQttC40YIg0LfQsNC/0YDQtdGJ0LXQvdC90YvQtSDRgdC40LzQstC+0LvRiyAo0YDQsNC30YDQtdGI0LXQvdC90YvQtSAtINC70LDRgtC40L3RgdC60LjQtSDQsdGD0LrQstGLLCDRhtC40YTRgNGLLCDQv9C+0LTRh9C10YDQutC40LLQsNC90LjQtSwg0LzQuNC90YPRgSlcbiA3LiDQnNC10LbQtNGD0L3QsNGA0L7QtNC90YvQuSDRhNC+0YDQvNCw0YIg0LfQsNC/0LjRgdC4INGC0LXQu9C10YTQvtC90LAg0L3QtSDQstGL0LTQtdGA0LbQsNC9XG4gOC4g0JPQsNC70L7Rh9C60LAgXCLQodC+0LPQu9Cw0YHQtdC9INGB0L4g0LLRgdC10LxcIiDQvdC1INC/0L7RgdGC0LDQstC70LXQvdCwXG5cbiDQoNC10YjQtdC90LjQtSDQtNC+0LvQttC90L4g0YDQsNCx0L7RgtCw0YLRjCDQsiDQuNC1OStcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbmZvRm9ybSA9IG5ldyBGb3JtSGFuZGxlcignaW5mb0Zvcm0nKTtcbiAgICB2YXIgZW1haWxzID0gWydhdXRob3JAbWFpbC5jb20nLCAnZm9vQG1haWwuY29tJywgJ3Rlc3RlckBtYWlsLmNvbSddO1xufSgpKTsiXX0=
