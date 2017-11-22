((window) => {
    "use strict";

    class DateTimePicker {

        constructor () {
            this.picker = {
                $root: this,
                callback: {}
            };

            let picker = this.picker;

            $("#dateTimePicker").AnyPicker({
                onInit: function () {
                    picker.$root = this;
                },
                mode: "datetime",
                theme: "iOS",
                rowsNavigation: "scroller",
                onSetOutput: function (sOutput, oArrSelectedValues) {
                    picker.callback(oArrSelectedValues.date);
                }
            });
        }

        open (callback) {
            this.picker.$root.showOrHidePicker();
            this.picker.callback = callback;
        }
    }

    window.todo = window.todo || {};
    window.todo.DateTimePicker = DateTimePicker;
})(window);
