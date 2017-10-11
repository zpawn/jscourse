const mediator = (function () {
    "use strict";

    let events;

    events = {};

    return {
        subscribe: function (eventName, callback) {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            events[eventName].push(callback);
        },

        unsubscribe: function (eventName, callback_) {
            if (arguments.length === 1) {
                delete events[eventName];
            } else {
                if (events[eventName]) {
                    events[eventName] = events[eventName].filter(function (callback) {
                        return callback !== callback_;
                    });
                }
            }
        },

        publish: function (eventName, data) {
            let i, callbacks;

            callbacks = events[eventName];
            if (callbacks && callbacks.length) {
                for (i = 0; i < callbacks.length; i += 1) {
                    callbacks[i].call(undefined, data);
                }
            }
        }
    };
}());
