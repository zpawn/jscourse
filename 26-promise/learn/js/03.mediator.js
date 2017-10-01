(function () {
    "use strict";

    const mediator = (function() {
        let subscribe = function(channel, fn) {
            if (!mediator.channels[channel]) {
                mediator.channels[channel] = [];
            }

            mediator.channels[channel].push({
                context: this, callback: fn
            });
            return this;
        },

        publish = function (channel) {
            if (!mediator.channels[channel]) {
                return false;
            }

            debugger;

            let args = Array.prototype.slice.call(arguments, 1);

            for (let i = 0, l = mediator.channels[channel].length; i < l; i++) {
                let subscription = mediator.channels[channel][i];
                subscription.callback.apply(subscription.context, args);
            }
            return this;
        };

        return {
            channels: {},
            publish: publish,
            subscribe: subscribe,
            installTo: function(obj) {
                obj.subscribe = subscribe;
                obj.publish = publish;
            }
        };
    }());

    console.dir(mediator);

    /**
     * Example: Pub/sub on a centralized mediator
     */
    mediator.name = 'tim';
    mediator.subscribe('nameChange', function (arg) {
        console.log(this.name);
        this.name = arg;
        console.log(this.name);
    });

    mediator.publish('nameChange', 'david'); //tim, david

    /**
     * Example: Pub/sub via third party mediator
     */
    let obj = {name: 'sam'};
    mediator.installTo(obj);
    obj.subscribe('nameChange', function (arg) {
        console.log(this.name);
        this.name = arg;
        console.log(this.name);
    });

    mediator.publish('nameChange', 'john');
}());
