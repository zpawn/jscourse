(function ($) {
    "use strict";

    const endpoint = 'https://hidden-brook-8135.herokuapp.com';

    function getTodos () {

        let todosList = new $.Deferred();
        $.get(endpoint + '/todos', (res) => {
            todosList.resolve(res);
        });
        return todosList;
    }

    let todos = getTodos();

    todos.then((todosList) => {
        console.log('todo:', todosList);
        let timeouted = new $.Deferred();
        setTimeout(() => {
            timeouted.resolve(true);
        }, 1000);
        console.log('FirstThen');
        return timeouted;
    }).then(() => {
        console.log('SecondThen');
    });
}(jQuery));
