(() => {
    "use strict";

    const endpoint = 'https://hidden-brook-8135.herokuapp.com';

    function getAllTodos () {
        return $.get(endpoint + '/todos').then((todoList) => {
            return $.when.apply($, todoList.map((todoName) => {
                return $.get(endpoint + '/todos/' + todoName);
            })).then((...args) => {
                return Array.prototype.reduce.call(args, (todos, todo, index) => {
                    todos[index] = todo[0];
                    return todos;
                }, {})
            });
        });
    }

    getAllTodos().then((todoList) => {
        console.log('todoList:', todoList);
    });
})();
