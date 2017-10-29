((window, $) => {
    "use strict";

    class TaskView {
        constructor () {
            this.$root = $("#todoTasks");
        }

        render (data) {
            let $root = $("#todoTasks"),
                tasks = data.tasks;

            $root.html('');

            for (let i = 0; i < tasks.length; i += 1) {
                $root.append(`<tr>
                    <td>${tasks[i].description}</td>
                    <td>${tasks[i].deadline ? tasks[i].deadline : '---'}</td>
                    <td>
                        <label class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" ${tasks[i].done ? 'checked' : ''}>
                            <span class="custom-control-indicator"></span>
                        </label>
                    </td>
                </tr>`);
            }
        }
    }

    window.todo = window.todo || {};
    window.todo.TaskView = TaskView;
})(window, jQuery);
