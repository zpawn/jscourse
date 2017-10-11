(function ($) {
    "use strict";

    $(document).on('5secpage', () => console.log('5 second on page!'));
    $(document).trigger('5secpage');

    let slider = SimpleSlider('#slider').init();

    $(document).on('startEndLoop', (e, instance) => {
        console.log('endLoopEvent:', e);
        console.log('endLoopInstance:', instance);
    });

    $(slider).on('start-animation', (e, index) => console.log(index, e));

    $(slider).on('end-animation', (e, index) => console.log(index, e));

}(jQuery));
