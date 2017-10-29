class Mediator {

    constructor () {
        this.events = {};
    }

    subscribe (event_name, callback) {
        if (!this.events[event_name]) {
            this.events[event_name] = [];
        }
        this.events[event_name].push(callback);
    }

    unsubscribe (event_name, callback_) {
        if (arguments.length === 1) {
            delete this.events[event_name];
        } else {
            if (this.events[event_name]) {
                this.events[event_name] = this.events[event_name].filter(function (callback) {
                    return callback !== callback_;
                });
            }
        }
    }

    publish (event_name, data) {
        let callbacks, i;

        callbacks = this.events[event_name];
        if (callbacks && callbacks.length) {
            for (i = 0; i < callbacks.length; i += 1) {
                callbacks[i](data);
            }
        }
    }
}
