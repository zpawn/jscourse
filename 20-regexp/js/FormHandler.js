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