(function () {
    "use strict";

    let asyncSum = function (a, b) {

        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                if (typeof a === 'number' && typeof b === 'number') {
                    resolve(a + b);
                } else {
                    reject('Arguments must be a number');
                }
            }, 2000);
        });
    };

    asyncSum(7, 3)
        .then(function (result) {
            console.log(result);
        })
        .catch(function (errorMessage) {
            console.log(errorMessage);
        });
}());
