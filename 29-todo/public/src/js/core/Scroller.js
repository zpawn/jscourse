((window) => {
    "use strict";

    class Scroller {

        constructor (selector) {
            this.scrollerContainer = document.querySelectorAll(selector);
        }

        render () {
            this.scrollerContainer.forEach(scroll => {
                let ps = new PerfectScrollbar(scroll);
            });
        }
    }

    window.todo = window.todo || {};
    window.todo.Scroller = Scroller;
})(window);