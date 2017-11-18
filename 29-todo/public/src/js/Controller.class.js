((window, $, _) => {
    "use strict";

    class Controller {

        constructor (model, listView, taskView) {
            this.model = model;
            this.listView = listView;
            this.taskView = taskView;
            this.listActive = '';
            this.spinner = new todo.Spinner('#spinner');
            this.alert = new todo.Alert();
            this.scroller = new todo.Scroller();

            ////

            Mediator.subscribe(this.listView.render, 'list');
            Mediator.subscribe(this.taskView.render, 'task');
            Mediator.subscribe(this.listView.listActive, 'listActive');
            Mediator.subscribe(this.spinner.toggle, 'spinner');
            Mediator.subscribe(this.alert.render, 'alert');
            Mediator.subscribe(this.scroller.render, 'scroller');

            ////

            this.model.findAll();
            this.bind();
        }

        bind () {
            this.listView.$root.on('click', 'a', this._bindListItemClick.bind(this));
            $('#addNewListForm').on('submit', this._bindNewListSubmit.bind(this));
            $('#addNewTaskForm').on('submit', this._bindNewTaskSubmit.bind(this));
            $('#todoTasks').on('click', this._bindTaskItemClick.bind(this));
            $('#searchList').on('keyup', this._bindSearchList.bind(this));
            $('#searchTask').on('keyup', this._bindSearchTask.bind(this));
            $('#sortByDone').on('click', this._bindSortByDone.bind(this));
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
                this._editList(listId);
            } else if ($elm.hasClass('js-remove')) {
                this.model.remove(listId);
            }
        }

        _editList (listId) {
            let editList = this.listView.$root.find(`#editList${listId}`);

            editList.addClass('openForm');
            this.listView.toggleEditList(editList);

            editList.on('submit', e => {
                e.preventDefault();
                editList.off('submit');

                editList.removeClass('openForm');
                this.listView.toggleEditList(editList);
                this.model.updateList(listId, e.target.elements[0].value);
            });

            editList.on('focusout', e => {
                editList.removeClass('openForm');
                this.listView.toggleEditList(editList);
                editList.off('focusout');
            });
        }

        _bindNewListSubmit (e) {
            e.preventDefault();
            this.model.create(e.target);
            $('#newToDoList').val("");
        }

        _bindTaskItemClick (e) {
            let $elm = $(e.target),
                $parent = $elm.closest('.js-task-parent'),
                taskId = $parent.data('taskId');

            if ($elm.hasClass('js-datetime')) {
                console.log('>>> datetime', taskId);
            } else if ($elm.hasClass('js-done')) {
                this.model.updateTask(this.listActive, taskId, {
                    field: 'done',
                    value: !$elm.find('input').prop('checked')
                });
            } else if ($(e.target).closest('.js-edit').length) {
                this._editTask(taskId);
            } else if ($(e.target).closest('.js-remove').length) {
                this.model.removeTask(this.listActive, taskId);
            }
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

            editTask.on('focusout', e => {
                editTask.removeClass('openForm');
                this.taskView.toggleEditTask(editTask);
                editTask.off('focusout');
            });
        }

        _bindSearchList (e) {
            let search = _.trim(e.target.value).toLowerCase();

            if (search.length > 0) {
                Mediator.publish(
                    this.model.lists.filter(
                        list => list.title.toLowerCase().indexOf(search) !== -1
                    ),
                    'list'
                );
            } else {
                Mediator.publish(this.model.lists, 'list');
            }
        }

        _bindSearchTask (e) {
            if (this.listActive) {

                let search = _.trim(e.target.value).toLowerCase();

                if (search.length > 0) {
                    Mediator.publish(
                        this.model.getTasks(this.listActive)
                            .filter(
                                task => task.description.toLowerCase().indexOf(search) !== -1
                            ),
                        'task'
                    );
                } else {
                    Mediator.publish(this.model.getTasks(this.listActive), 'task');
                }
            }
        }

        _bindSortByDone (e) {
            if (this.listActive) {
                let sortIcon = $('#sortByDoneIcon');

                if (sortIcon.is(':visible')) {
                    sortIcon.hide();
                    Mediator.publish(this.model.getTasks(this.listActive), 'task')
                } else {
                    sortIcon.show();
                    Mediator.publish(
                        this.model.getTasks(this.listActive)
                            .filter(task => task.done === false),
                        'task'
                    );
                }
            }
        }
    }

    window.todo = window.todo || {};
    window.todo.Controller = Controller;
})(window, jQuery, _);
