(function ($) {
    "use strict";

    console.log('thisIsTagManager');

    class TagManager {
        constructor (name) {
            this.name = name;
        }

        sayName () {
            console.log('ThisIsTagManager' + this.name);
        }
    }

    const tagManager = new TagManager('Class');
    tagManager.sayName();
}(jQuery));
