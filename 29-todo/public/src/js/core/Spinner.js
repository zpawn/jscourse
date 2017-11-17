((window, $) => {
    "use strict";

    let Spinner = selector => {
        const $root = $(selector);
        let show = false;

        return {
            toggle (type) {
                (type === 'show') ? $root.show() : $root.hide();
            }
        };
    };

    window.todo = window.todo || {};
    window.todo.Spinner = Spinner;
})(window, jQuery);
