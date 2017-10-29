const Mediator = (() => {
    "use strict";

    return {
        subscribers: {
            any: [] // event type: subscribers
        },

        subscribe (fn, type = 'any') {
            if (typeof this.subscribers[type] === "undefined") {
                this.subscribers[type] = [];
            }
            this.subscribers[type].push(fn);
        },
        unsubscribe (fn, type) {
            this.visitSubscribers('unsubscribe', fn, type);
        },
        publish (publication, type) {
            this.visitSubscribers('publish', publication, type);
        },
        visitSubscribers (action, arg, type = 'any') {
            let subscribers = this.subscribers[type];

            for (let i = 0; i < subscribers.length; i += 1) {
                if (action === 'publish') {
                    subscribers[i](arg);
                } else {
                    if (subscribers[i] === arg) {
                        subscribers.splice(i, 1);
                    }
                }
            }
        }
    };
})();
