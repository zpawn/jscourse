(function () {
    "use strict";

    const Mediator = function() {

        let debug = function() {
            console.log('error:', arguments);
        };

        let components = {};

        let broadcast = function(event, args, source) {
            if (!event) {
                return;
            }
            args = args || [];
            //debug(["Mediator received", event, args].join(' '));
            for (let c in components) {
                if (typeof components[c]["on" + event] === "function") {
                    try {
                        //debug("Mediator calling " + event + " on " + c);
                        source = source || components[c];
                        components[c]["on" + event].apply(source, args);
                    } catch (err) {
                        debug(["Mediator error.", event, args, source, err].join(' '));
                    }
                }
            }
        };

        let addComponent = function(name, component, replaceDuplicate) {
            if (name in components) {
                if (replaceDuplicate) {
                    removeComponent(name);
                } else {
                    throw new Error('Mediator name conflict: ' + name);
                }
            }
            components[name] = component;
        };

        let removeComponent = function(name) {
            if (name in components) {
                delete components[name];
            }
        };

        let getComponent = function(name) {
            return components[name]; // undefined if component has not been added
        };

        let contains = function(name) {
            return (name in components);
        };

        return {
            name      : "Mediator",
            broadcast : broadcast,
            add       : addComponent,
            rem       : removeComponent,
            get       : getComponent,
            has       : contains
        };
    }();

    Mediator.add('TestObject', function() {

        let someNumber = 0; // sample variable
        let someString = 'another sample variable';

        return {
            onInitialize: function() {
                // this.name is automatically assigned by the Mediator
                console.log(this.name + " initialized.");
            },
            onFakeEvent: function() {
                someNumber++;
                console.log("Handled " + someNumber + " times!");
            },
            onSetString: function(str) {
                someString = str;
                console.log('Assigned ' + someString);
            }
        }
    }());

    debugger;

    Mediator.broadcast("Initialize");                 // alerts "TestObject initialized"
    Mediator.broadcast('FakeEvent');                  // alerts "Handled 1 times!" (I know, bad grammar)
    Mediator.broadcast('SetString', ['test string']); // alerts "Assigned test string"
    Mediator.broadcast('FakeEvent');                  // alerts "Handled 2 times!"
    Mediator.broadcast('SessionStart');               // this call is safely ignored
    Mediator.broadcast('Translate', ['this is also safely ignored']);
}());
