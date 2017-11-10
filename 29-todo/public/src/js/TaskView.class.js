((window, $) => {
    "use strict";

    class TaskView {

        static getRoot () {
            return $("#todoTasks")
        }

        constructor () {
            this.$root = TaskView.getRoot();
            this.$dateTimeModal = $('#dateTimePicker');
            this.$dateTimeModal.find('select.date').drum();
        }

        toggleEditTask (task) {
            if (task.hasClass('openForm')) {
                task.find('input').prop('type', 'text').focus();
                task.find('span').hide();
            } else {
                task.find('input').prop('type', 'hidden');
                task.find('span').show();
            }
        }

        render (tasks) {
            let $root = TaskView.getRoot();

            $root.html('');

            if (tasks.length === 0) {
                $root.append(`<tr>
                    <td class="text-center" colspan="3">No Tasks!</td>
                </tr>`);
            } else {
                for (let i = 0; i < tasks.length; i += 1) {
                    $root.append(`<tr class="js-task-parent" data-task-id="${i}">
                        <td>
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <form id="editTask${i}">
                                    <span>${tasks[i].description}</span>
                                    <input class="form-control" type="hidden" name="tasks[${i}]" value="${tasks[i].description}">
                                </form>
                                <span>
                                    <a class="js-edit" href="javascript:void(0)"><span class="dripicons-pencil"></span></a>
                                    <a class="js-remove" href="javascript:void(0)"><span class="dripicons-cross"></span></a>
                                </span>
                            </div>
                        </td>
                        <td class="js-datetime" data-timestamp="${tasks[i].deadline}">${tasks[i].deadline ? moment(tasks[i]).format('DD.M.YYYY') : '---'}</td>
                        <td>
                            <label class="js-done custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" ${tasks[i].done ? 'checked' : ''}>
                                <span class="custom-control-indicator"></span>
                            </label>
                        </td>
                    </tr>`);
                }
            }
        }
    }

    window.todo = window.todo || {};
    window.todo.TaskView = TaskView;
})(window, jQuery);
