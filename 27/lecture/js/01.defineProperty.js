(function () {
    "use strict";

    let user = {
        firstName: 'Sergey',
        lastName: 'Popovich'
    };

    Object.defineProperty(user, 'fullName', {
        get: function () {
            return this.firstName + ' ' + this.lastName;
        },
        set: function (fullName) {
            this.firstName = fullName.split(' ')[0];
            this.lastName = fullName.split(' ')[1];
        }
    });

    console.log(user.fullName);
    user.fullName = 'Olga Nikuda';
    console.log(user);
}());
