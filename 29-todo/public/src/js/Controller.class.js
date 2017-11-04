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
        }

        _bindListItemClick (e) {
            let $elm = $(e.currentTarget),
                $parent = $elm.closest('.js-list-parent'),
                listId = $parent.data('listId') || '';

            if ($elm.hasClass('js-list-set')) {
                this.listActive = listId;
                Mediator.publish(this.model.getTasks(parseInt(this.listActive)), 'task');
                Mediator.publish(this.listActive, 'listActive');
            } else if ($elm.hasClass('js-list-edit')) {
                console.log('edit');
            } else if ($elm.hasClass('js-list-remove')) {
                this.model.remove(listId);
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
    }

    window.todo = window.todo || {};
    window.todo.Controller = Controller;
})(window, jQuery);
