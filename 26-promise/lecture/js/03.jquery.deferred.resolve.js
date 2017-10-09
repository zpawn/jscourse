(function ($) {
    "use strict";

    const endpoint = 'https://hidden-brook-8135.herokuapp.com';

    let d = new $.Deferred();
    d.resolve(100500);
    setTimeout(() => {
        d.then((val) => {
            console.log('resolve:', val);
        });
    }, 2000);

}(jQuery));
