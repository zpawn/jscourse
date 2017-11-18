((window) => {
    "use strict";

    class Scroller {
        static get () {
            return document.querySelectorAll('.js-scroller');
        }

        render () {
            Scroller.get().forEach(scroll => {
                let ps = new PerfectScrollbar(scroll);
            });
        }
    }

    window.todo = window.todo || {};
    window.todo.Scroller = Scroller;
})(window);