(function ($) {
    "use strict";

    let eventHandler = function () {
        console.log('clicking');
    };

    /** Event Namespace */
    $(document).on('click.counter', eventHandler);
    $(document).on('mousemove.counter', () => console.log('Mouse move'));
    $(document).on('mouseenter.counter', () => console.log('Mouse entered'));
    $(document).on('mouseleave.counter', () => console.log('Mouse left'));

    $(document).off('.counter');
}(jQuery));
