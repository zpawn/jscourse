(function ($) {
    "use strict";

    const endpoint = 'https://hidden-brook-8135.herokuapp.com';

    function getTask (name) {
        let taskData = new $.Deferred();
        $.get(endpoint + '/todos/' + name, (res) => {
            taskData.resolve(res);
        });
        return taskData;
    }

    let task = getTask('another-task');

    task.then((task) => {
        console.log('task:', task);
    });

    /** Union some deferred */
    $.when(getTask('another-task'), getTask('example-task')).then((firstTask, secondTask) => {
        console.log('firstTask:', firstTask);
        console.log('secondTask:', secondTask);
    });
}(jQuery));
