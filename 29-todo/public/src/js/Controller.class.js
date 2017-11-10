((window, $) => {
    "use strict";

    class Controller {
        constructor (model, listView, taskView) {
            this.model = model;
            this.listView = listView;
            this.taskView = taskView;
            this.listActive = '';

            ////

            Mediator.subscribe(this.listView.render, 'list');
            Mediator.subscribe(this.taskView.render, 'task');
            Mediator.subscribe(this.listView.listActive, 'listActive');

            ////

            this.model.findAll();
            this.bind();
        }

        bind () {
            this.listView.$root.on('click', 'a', this._bindListItemClick.bind(this));
            $('#addNewListForm').on('submit', this._bindNewListSubmit.bind(this));
            $('#addNewTaskForm').on('submit', this._bindNewTaskSubmit.bind(this));
            $('#todoTasks').on('click', this._bindTaskItemClick.bind(this));
        }

        _bindListItemClick (e) {
            let $elm = $(e.currentTarget),
                $parent = $elm.closest('.js-list-parent'),
                listId = $parent.data('listId') || '';

            if ($elm.hasClass('js-set')) {
                this.listActive = listId;
                Mediator.publish(this.model.getTasks(parseInt(this.listActive)), 'task');
                Mediator.publish(this.listActive, 'listActive');
            } else if ($elm.hasClass('js-edit')) {
                console.log('edit');
            } else if ($elm.hasClass('js-remove')) {
                this.model.remove(listId);
            }
        }

        _bindTaskItemClick (e) {
            let $elm = $(e.target),
                $parent = $elm.closest('.js-task-parent'),
                taskId = $parent.data('taskId');

            if ($elm.hasClass('js-datetime')) {
                console.log('>>> datetime', taskId);
            } else if ($elm.hasClass('js-done')) {
                console.log('>>> done', taskId);
            } else if ($(e.target).closest('.js-edit').length) {
                this._editTask(taskId);
            } else if ($(e.target).closest('.js-remove').length) {
                this.model.removeTask(this.listActive, taskId);
            }
        }

        _bindNewListSubmit (e) {
            e.preventDefault();
            this.model.create(e.target);
            $('#newToDoList').val("");
        }

        _bindNewTaskSubmit (e) {
            e.preventDefault();
            this.model.update(e.target, this.listActive);
            $('#newToDoTask').val("");
        }

        _editTask (taskId) {
            let editTask = $(`#editTask${taskId}`);

            editTask.addClass('openForm');
            this.taskView.toggleEditTask(editTask);

            editTask.on('submit', e => {
                e.preventDefault();
                editTask.off('submit');

                editTask.removeClass('openForm');
                this.taskView.toggleEditTask(editTask);
                this.model.updateTask(this.listActive, taskId, {
                    field: 'description',
                    value: e.target.elements[0].value
                });
            });
        }
    }

    window.todo = window.todo || {};
    window.todo.Controller = Controller;
})(window, jQuery);
